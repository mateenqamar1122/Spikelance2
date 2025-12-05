import { Invoice } from '@/services/invoiceService';
import { downloadInvoicePDF } from './invoiceActions';
import { toast } from 'sonner';
import { sendInvoiceEmail } from '@/services/emailService';

/**
 * Downloads the invoice as a PDF file
 * @param invoice The invoice to download
 */
export const handleDownloadPDF = (invoice: Invoice) => {
  try {
    downloadInvoicePDF(invoice);
    toast.success('Invoice PDF downloaded successfully');
  } catch (error) {
    console.error('Error downloading invoice PDF:', error);
    toast.error('Failed to download invoice PDF');
  }
};

/**
 * Sends the invoice to the client via email
 * @param invoice The invoice to send
 * @param recipientEmail The email address to send the invoice to
 */
export const handleSendToClient = async (invoice: Invoice, recipientEmail: string) => {
  try {
    const success = await sendInvoiceEmail(invoice, recipientEmail);
    if (success) {
      toast.success(`Invoice sent to ${recipientEmail}`);
      return true;
    } else {
      toast.error('Failed to send invoice');
      return false;
    }
  } catch (error) {
    console.error('Error sending invoice:', error);
    toast.error('Failed to send invoice');
    return false;
  }
};

/**
 * Generates and copies a payment link for the invoice
 * @param invoice The invoice to generate a payment link for
 */
export const handleCopyPaymentLink = async (invoice: Invoice) => {
  try {
    // Generate a payment link based on the invoice ID
    // This would typically be a URL to a payment page with the invoice ID as a parameter
    const baseUrl = window.location.origin;
    const paymentLink = `${baseUrl}/payments/invoice/${invoice.id}`;
    
    // Copy the link to clipboard
    await navigator.clipboard.writeText(paymentLink);
    
    toast.success('Payment link copied to clipboard');
    return true;
  } catch (error) {
    console.error('Error copying payment link:', error);
    toast.error('Failed to copy payment link');
    return false;
  }
};