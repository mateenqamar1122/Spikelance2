import { Invoice } from '@/services/invoiceService';
import { generateInvoicePDF } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string;
    encoding?: string;
  }>;
}

export const sendInvoiceEmail = async (invoice: Invoice, recipientEmail: string): Promise<boolean> => {
  try {
    // Generate PDF
    const pdfContent = generateInvoicePDF(invoice);

    // Email configuration
    const emailConfig: EmailConfig = {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    };

    // Email content
    const emailOptions: EmailOptions = {
      to: recipientEmail,
      subject: `Invoice ${invoice.invoiceNumber} from ${invoice.branding?.companyName || 'Company'}`,
      html: `
        <h2>Invoice ${invoice.invoiceNumber}</h2>
        <p>Dear ${invoice.clientName},</p>
        <p>Please find attached the invoice for your recent services.</p>
        <p><strong>Amount Due: $${invoice.total.toFixed(2)}</strong></p>
        <p>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p>Thank you for your business!</p>
        ${invoice.branding?.companyName ? `<p>Best regards,<br>${invoice.branding.companyName}</p>` : ''}
      `,
      attachments: [
        {
          filename: `Invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfContent.split('base64,')[1],
          encoding: 'base64'
        }
      ]
    };

    // Send email using nodemailer
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport(emailConfig);
    await transporter.sendMail(emailOptions);
    
    toast.success('Invoice sent successfully');

    return true;
  } catch (error) {
    console.error('Error sending invoice email:', error);
    return false;
  }
};