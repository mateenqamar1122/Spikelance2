import jsPDF from 'jspdf';
import { Client } from '@/types/database';
import { format } from 'date-fns';

export const generateClientPDF = (client: Client): string => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Helper function to add text with proper line breaks
  const addText = (text: string, x: number, y: number, maxWidth: number) => {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * doc.getLineHeight());
  };

  // Add header with company name if available
  doc.setFontSize(24);
  doc.setTextColor(0, 0, 139); // Dark blue for header
  yPos = addText(client.company || client.name, margin, yPos, pageWidth - 2 * margin);

  // Add divider
  yPos += 10;
  doc.setDrawColor(0, 0, 139);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // Client Information Section
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Client Information', margin, yPos);
  yPos += 10;

  // Contact Details
  doc.setFontSize(12);
  if (client.contact_name) {
    yPos = addText(`Contact Person: ${client.contact_name}${client.contact_position ? ` (${client.contact_position})` : ''}`, margin, yPos, pageWidth - 2 * margin);
  }
  if (client.email) {
    yPos = addText(`Email: ${client.email}`, margin, yPos, pageWidth - 2 * margin);
  }
  if (client.phone) {
    yPos = addText(`Phone: ${client.phone}`, margin, yPos, pageWidth - 2 * margin);
  }

  // Address Section
  if (client.address || client.city || client.state || client.postal_code || client.country) {
    yPos += 5;
    const address = [
      client.address,
      [client.city, client.state, client.postal_code].filter(Boolean).join(', '),
      client.country
    ].filter(Boolean).join('\n');
    yPos = addText(`Address:\n${address}`, margin, yPos, pageWidth - 2 * margin);
  }

  // Additional Details
  yPos += 5;
  if (client.website) {
    yPos = addText(`Website: ${client.website}`, margin, yPos, pageWidth - 2 * margin);
  }
  if (client.industry) {
    yPos = addText(`Industry: ${client.industry}`, margin, yPos, pageWidth - 2 * margin);
  }
  if (client.status) {
    yPos = addText(`Status: ${client.status.charAt(0).toUpperCase() + client.status.slice(1)}`, margin, yPos, pageWidth - 2 * margin);
  }

  // Projects Section
  if (client.projects && client.projects.length > 0) {
    yPos += 15;
    doc.setFontSize(16);
    doc.text('Projects', margin, yPos);
    yPos += 10;
    doc.setFontSize(12);

    client.projects.forEach((project) => {
      const projectInfo = [
        `Name: ${project.name}`,
        `Status: ${project.status.replace('-', ' ')}`,
        project.deadline ? `Deadline: ${format(new Date(project.deadline), 'MMM d, yyyy')}` : null,
        `Progress: ${project.progress}%`
      ].filter(Boolean).join('\n');

      yPos = addText(projectInfo, margin, yPos, pageWidth - 2 * margin);
      yPos += 5;
    });
  }

  // Notes Section
  if (client.notes) {
    yPos += 15;
    doc.setFontSize(16);
    doc.text('Notes', margin, yPos);
    yPos += 10;
    doc.setFontSize(12);
    yPos = addText(client.notes, margin, yPos, pageWidth - 2 * margin);
  }

  // Footer with dates
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128); // Gray color for footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.text(
    `Created: ${format(new Date(client.created_at), 'MMM dd, yyyy')} | Last Updated: ${format(new Date(client.updated_at), 'MMM dd, yyyy')}`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  // Save the PDF
  return doc.output('datauristring');
};