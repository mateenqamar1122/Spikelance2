import { supabase } from "@/integrations/supabase/client";
import { Invoice, InvoiceItem } from "@/types/database";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const invoiceService = {
  // Get all invoices for the current user
  async getInvoices(): Promise<Invoice[]> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        project:projects(*),
        invoice_items(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get a single invoice by ID
  async getInvoice(id: string): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        project:projects(*),
        invoice_items(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Create a new invoice
  async createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'invoice_number'>): Promise<Invoice> {
    const { invoice_items, ...invoiceData } = invoice;
    
    const { data: invoiceResult, error: invoiceError } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    // Add invoice items if provided
    if (invoice_items && invoice_items.length > 0) {
      const items = invoice_items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_amount: item.total_amount,
        invoice_id: invoiceResult.id
      }));

      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(items);

      if (itemsError) throw itemsError;
    }

    return invoiceResult;
  },

  // Update an invoice
  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice> {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an invoice
  async deleteInvoice(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Add invoice items
  async addInvoiceItems(invoiceId: string, items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at'>[]): Promise<InvoiceItem[]> {
    const itemsWithInvoiceId = items.map(item => ({
      ...item,
      invoice_id: invoiceId
    }));

    const { data, error } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId)
      .select();

    if (error) throw error;
    return data || [];
  },

  // Update invoice item
  async updateInvoiceItem(id: string, updates: Partial<InvoiceItem>): Promise<InvoiceItem> {
    const { data, error } = await supabase
      .from('invoice_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete invoice item
  async deleteInvoiceItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('invoice_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Generate high-quality invoice preview image
  async generateInvoiceImage(element: HTMLElement): Promise<string> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        height: element.scrollHeight,
        width: element.scrollWidth,
        logging: false,
        ignoreElements: (element) => {
          // Ignore any interactive elements that might cause issues
          return element.tagName === 'BUTTON' || element.classList.contains('no-print');
        }
      });
      
      return canvas.toDataURL('image/png', 1.0);
    } catch (error) {
      console.error('Error generating invoice image:', error);
      throw new Error('Failed to generate invoice image');
    }
  },

  // Generate invoice PDF with high-quality preview image
  async generatePDF(invoiceId: string, element?: HTMLElement): Promise<Blob> {
    try {
      const invoice = await this.getInvoice(invoiceId);
      if (!invoice) throw new Error('Invoice not found');

      if (element) {
        console.log('Generating PDF from invoice preview element...');
        
        // Generate high-quality image from the preview
        const imageData = await this.generateInvoiceImage(element);
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Create a temporary image to get dimensions
        const img = new Image();
        img.src = imageData;
        
        return new Promise((resolve, reject) => {
          img.onload = () => {
            const imgWidth = pdfWidth;
            const imgHeight = (img.height * pdfWidth) / img.width;
            
            // If content is taller than one page, add multiple pages
            if (imgHeight > pdfHeight) {
              const totalPages = Math.ceil(imgHeight / pdfHeight);
              for (let i = 0; i < totalPages; i++) {
                if (i > 0) pdf.addPage();
                const yPosition = -(pdfHeight * i);
                pdf.addImage(imageData, 'PNG', 0, yPosition, imgWidth, imgHeight);
              }
            } else {
              pdf.addImage(imageData, 'PNG', 0, 0, imgWidth, imgHeight);
            }
            
            resolve(pdf.output('blob'));
          };
          
          img.onerror = () => {
            reject(new Error('Failed to load generated image'));
          };
        });
      } else {
        // Fallback: Generate simple text-based PDF
        console.log('Generating fallback text-based PDF...');
        const pdf = new jsPDF();
        
        pdf.setFontSize(20);
        pdf.text('INVOICE', 20, 30);
        
        pdf.setFontSize(12);
        pdf.text(`Invoice Number: ${invoice.invoice_number}`, 20, 50);
        pdf.text(`Issue Date: ${invoice.issue_date}`, 20, 60);
        pdf.text(`Due Date: ${invoice.due_date}`, 20, 70);
        
        if (invoice.client) {
          pdf.text(`Client: ${invoice.client.name}`, 20, 90);
          pdf.text(`Email: ${invoice.client.email}`, 20, 100);
        }
        
        let yPosition = 120;
        if (invoice.invoice_items) {
          pdf.text('Items:', 20, yPosition);
          yPosition += 10;
          
          invoice.invoice_items.forEach((item, index) => {
            pdf.text(`${index + 1}. ${item.description} - Qty: ${item.quantity} - $${item.unit_price} = $${item.total_amount}`, 25, yPosition);
            yPosition += 10;
          });
        }
        
        pdf.text(`Total: ${invoice.currency} ${invoice.total_amount}`, 20, yPosition + 20);
        
        return pdf.output('blob');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  },

  // Download PDF with improved quality
  async downloadPDF(invoiceId: string, element?: HTMLElement): Promise<string> {
    try {
      const invoice = await this.getInvoice(invoiceId);
      if (!invoice) throw new Error('Invoice not found');

      console.log('Starting PDF download for invoice:', invoice.invoice_number);
      const pdfBlob = await this.generatePDF(invoiceId, element);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      const filename = `invoice-${invoice.invoice_number}.pdf`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('PDF download completed:', filename);
      return filename;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error('Failed to download PDF');
    }
  },

  // Send invoice via email with PDF attachment and preview image
  async sendInvoice(invoiceId: string, email: string, subject: string, message: string, element?: HTMLElement): Promise<void> {
    try {
      const invoice = await this.getInvoice(invoiceId);
      if (!invoice) throw new Error('Invoice not found');

      console.log('Preparing to send invoice:', invoice.invoice_number, 'to:', email);

      // Generate PDF blob and preview image
      const pdfBlob = await this.generatePDF(invoiceId, element);
      let previewImage = '';
      
      if (element) {
        try {
          previewImage = await this.generateInvoiceImage(element);
        } catch (error) {
          console.warn('Could not generate preview image, continuing without it:', error);
        }
      }
      
      // Convert PDF blob to base64
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

      // Prepare email attachments
      const attachments: any[] = [{
        filename: `invoice-${invoice.invoice_number}.pdf`,
        content: base64Pdf,
        type: 'application/pdf'
      }];

      // Add preview image as attachment if available
      if (previewImage) {
        const base64Image = previewImage.split(',')[1]; // Remove data:image/png;base64, prefix
        attachments.push({
          filename: `invoice-${invoice.invoice_number}-preview.png`,
          content: base64Image,
          type: 'image/png'
        });
      }

      // Call the send-emails edge function with attachments
      const { data, error } = await supabase.functions.invoke('send-emails', {
        body: {
          to: email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Invoice ${invoice.invoice_number}</h2>
              <p style="white-space: pre-line;">${message}</p>
              
              ${previewImage ? `
                <div style="margin: 20px 0; text-align: center;">
                  <img src="${previewImage}" alt="Invoice Preview" style="max-width: 100%; height: auto; border: 1px solid #ddd; border-radius: 8px;" />
                </div>
              ` : ''}
              
              <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
                <h3>Invoice Details</h3>
                <p><strong>Invoice Number:</strong> ${invoice.invoice_number}</p>
                <p><strong>Issue Date:</strong> ${invoice.issue_date}</p>
                <p><strong>Due Date:</strong> ${invoice.due_date}</p>
                <p><strong>Total Amount:</strong> ${invoice.currency} ${invoice.total_amount}</p>
              </div>
              
              ${invoice.payment_instructions ? `
                <div style="background: #e8f5e8; padding: 15px; margin: 20px 0; border-radius: 8px;">
                  <h4>Payment Instructions</h4>
                  <p>${invoice.payment_instructions}</p>
                </div>
              ` : ''}
              
              <p style="margin-top: 30px; color: #666;">
                Please find the invoice attached as a PDF file${previewImage ? ' along with a preview image' : ''}.
              </p>
            </div>
          `,
          attachments: attachments
        }
      });

      if (error) throw error;

      console.log(`Invoice ${invoice.invoice_number} sent successfully to ${email}`);
    } catch (error) {
      console.error('Error sending invoice:', error);
      throw error;
    }
  }
};