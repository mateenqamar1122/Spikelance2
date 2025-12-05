import { Invoice } from '@/services/invoiceService';
import { generateInvoicePDF } from './pdfGenerator';

export const downloadInvoicePDF = (invoice: Invoice) => {
  const pdfDataUrl = generateInvoicePDF(invoice);
  const link = document.createElement('a');
  link.href = pdfDataUrl;
  link.download = `invoice-${invoice.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printInvoice = (invoice: Invoice) => {
  const pdfDataUrl = generateInvoicePDF(invoice);
  const printWindow = window.open(pdfDataUrl);
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    };
  }
};

export const shareInvoice = async (invoice: Invoice) => {
  if (navigator.share) {
    try {
      const pdfDataUrl = generateInvoicePDF(invoice);
      const pdfBlob = await fetch(pdfDataUrl).then(res => res.blob());
      const file = new File([pdfBlob], `invoice-${invoice.invoiceNumber}.pdf`, { type: 'application/pdf' });
      
      await navigator.share({
        title: `Invoice #${invoice.invoiceNumber}`,
        text: `Invoice for ${invoice.clientName}`,
        files: [file]
      });
      return true;
    } catch (error) {
      console.error('Error sharing invoice:', error);
      return false;
    }
  } else {
    // Fallback to copy link functionality
    const dummyLink = `${window.location.origin}/invoices/${invoice.id}`;
    await navigator.clipboard.writeText(dummyLink);
    return 'copied';
  }
};