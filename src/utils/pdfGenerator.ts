import jsPDF from 'jspdf';
import { Invoice, InvoiceItem } from '@/services/invoiceService';
import { format } from 'date-fns';

export const generateInvoicePDF = (invoice: Invoice): string => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // Add company branding
  if (invoice.branding) {
    doc.setTextColor(invoice.branding.primaryColor || '#000000');
    doc.setFontSize(24);
    doc.text(invoice.branding.companyName || 'Company Name', 20, yPos);
    if (invoice.branding.logo) {
      // Add logo if provided
      doc.addImage(invoice.branding.logo, 'PNG', pageWidth - 60, 20, 40, 40);
    }
  }

  // Add invoice details
  yPos += 30;
  doc.setFontSize(12);
  doc.setTextColor('#000000');
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, yPos);
  doc.text(`Date: ${format(new Date(invoice.issueDate), 'MMM dd, yyyy')}`, 20, yPos + 10);
  doc.text(`Due Date: ${format(new Date(invoice.dueDate), 'MMM dd, yyyy')}`, 20, yPos + 20);

  // Add client details
  yPos += 40;
  doc.setFontSize(14);
  doc.text('Bill To:', 20, yPos);
  doc.setFontSize(12);
  doc.text(invoice.clientName || 'Client Name', 20, yPos + 10);

  // Add items table
  yPos += 30;
  const tableHeaders = ['Description', 'Quantity', 'Rate', 'Amount'];
  const tableTop = yPos;
  const cellPadding = 5;
  const colWidths = [80, 30, 30, 30];
  let startX = 20;

  // Draw table headers
  doc.setFillColor(240, 240, 240);
  doc.rect(startX, tableTop, pageWidth - 40, 10, 'F');
  doc.setFont('helvetica', 'bold');
  tableHeaders.forEach((header, i) => {
    doc.text(header, startX + cellPadding, tableTop + 7);
    startX += colWidths[i];
  });

  // Draw table rows
  doc.setFont('helvetica', 'normal');
  yPos = tableTop + 15;
  if (invoice.items && Array.isArray(invoice.items)) {
    invoice.items.forEach((item: InvoiceItem) => {
      startX = 20;
      doc.text(item.description, startX + cellPadding, yPos);
      doc.text(item.quantity.toString(), startX + colWidths[0] + cellPadding, yPos);
      doc.text(`$${item.rate.toFixed(2)}`, startX + colWidths[0] + colWidths[1] + cellPadding, yPos);
      doc.text(`$${item.amount.toFixed(2)}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + cellPadding, yPos);
      yPos += 10;
    });
  }

  // Add total
  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.text(`Total: $${invoice.total.toFixed(2)}`, pageWidth - 50, yPos);

  // Add notes if any
  if (invoice.notes) {
    yPos += 30;
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.notes, 20, yPos + 10);
  }

  // Add footer if enabled in branding
  if (invoice.branding?.showFooter && invoice.branding?.footerText) {
    doc.setFontSize(10);
    doc.text(
      invoice.branding.footerText,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Generate PDF as base64 string
  return doc.output('dataurlstring');
};