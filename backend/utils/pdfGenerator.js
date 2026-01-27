import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

/**
 * Generate a professional quotation PDF
 * @param {Object} quotationData - The quotation data
 * @param {string} outputPath - Path to save the PDF
 * @returns {Promise<string>} - Path to the generated PDF
 */
export const generateQuotationPDF = (quotationData, outputPath) => {
  return new Promise((resolve, reject) => {
    try {
      console.log('Starting PDF generation...');
      console.log('Output path:', outputPath);
      
      // Create a document
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      // Pipe to file
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);
      
      console.log('Write stream created');

      // Colors
      const primaryColor = '#4f46e5'; // Indigo
      const secondaryColor = '#10b981'; // Green
      const textColor = '#1f2937';
      const lightGray = '#f3f4f6';

      // Helper function to draw a line
      const drawLine = (y, color = '#e5e7eb') => {
        doc.strokeColor(color).lineWidth(1)
           .moveTo(50, y)
           .lineTo(doc.page.width - 50, y)
           .stroke();
      };

      // HEADER SECTION
      doc.fillColor(primaryColor)
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('SCHOLARXAFRICA', 50, 50);

      doc.fillColor(textColor)
         .fontSize(10)
         .font('Helvetica')
         .text('Academic Project Services', 50, 85)
         .text('Professional Solutions for Your Success', 50, 100);

      // Contact info (right aligned)
      const headerRight = doc.page.width - 250;
      doc.fontSize(9)
         .text('Email: scholarxafricaprojects@gmail.com', headerRight, 50, { align: 'right' })
         .text('WhatsApp: +263 78 518 3361', headerRight, 65, { align: 'right' })
         .text('Website: www.scholarxafrica.co.zw', headerRight, 80, { align: 'right' });

      // Title
      doc.fillColor(primaryColor)
         .fontSize(24)
         .font('Helvetica-Bold')
         .text('QUOTATION', 50, 140);

      drawLine(175, primaryColor);

      // Quotation details box
      doc.rect(50, 190, 250, 120)
         .fillAndStroke(lightGray, '#d1d5db');

      doc.fillColor(textColor)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('QUOTATION DETAILS', 60, 200);

      doc.font('Helvetica')
         .fontSize(9)
         .text(`Quote Number: ${quotationData.quotationNumber}`, 60, 220)
         .text(`Date Issued: ${new Date(quotationData.dateIssued).toLocaleDateString('en-GB', { 
           day: '2-digit', 
           month: 'long', 
           year: 'numeric' 
         })}`, 60, 235)
         .text(`Valid Until: ${new Date(quotationData.validUntil).toLocaleDateString('en-GB', { 
           day: '2-digit', 
           month: 'long', 
           year: 'numeric' 
         })}`, 60, 250)
         .text(`Status: ${quotationData.status || 'Draft'}`, 60, 265);

      // Client details box
      doc.rect(320, 190, 240, 120)
         .fillAndStroke(lightGray, '#d1d5db');

      doc.fillColor(textColor)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('CLIENT DETAILS', 330, 200);

      doc.font('Helvetica')
         .fontSize(9)
         .text(`Name: ${quotationData.clientName}`, 330, 220)
         .text(`Email: ${quotationData.clientEmail}`, 330, 235)
         .text(`Phone: ${quotationData.clientPhone}`, 330, 250)
         .text(`University: ${quotationData.university}`, 330, 265)
         .text(`Course: ${quotationData.course}`, 330, 280);

      // Project Details Section
      let yPosition = 330;
      doc.fillColor(primaryColor)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('PROJECT INFORMATION', 50, yPosition);

      yPosition += 25;
      drawLine(yPosition);

      yPosition += 15;
      doc.fillColor(textColor)
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('Project Type:', 50, yPosition);
      
      doc.font('Helvetica')
         .text(quotationData.projectType, 150, yPosition);

      yPosition += 20;
      doc.font('Helvetica-Bold')
         .text('Description:', 50, yPosition);

      yPosition += 15;
      const descriptionLines = doc.heightOfString(quotationData.description, { 
        width: 500 
      });
      
      doc.font('Helvetica')
         .fontSize(9)
         .text(quotationData.description, 50, yPosition, { 
           width: 500, 
           align: 'justify' 
         });

      yPosition += descriptionLines + 25;

      // LINE ITEMS TABLE
      doc.fillColor(primaryColor)
         .fontSize(14)
         .font('Helvetica-Bold')
         .text('QUOTATION BREAKDOWN', 50, yPosition);

      yPosition += 25;

      // Table header
      doc.rect(50, yPosition, doc.page.width - 100, 25)
         .fillAndStroke(primaryColor, primaryColor);

      doc.fillColor('#ffffff')
         .fontSize(10)
         .font('Helvetica-Bold')
         .text('Description', 60, yPosition + 8, { width: 250 })
         .text('Qty', 320, yPosition + 8, { width: 50 })
         .text('Unit Price', 380, yPosition + 8, { width: 80 })
         .text('Amount', 470, yPosition + 8, { width: 80 });

      yPosition += 25;

      // Table rows
      let subtotal = 0;
      quotationData.lineItems.forEach((item, index) => {
        const amount = item.quantity * item.unitPrice;
        subtotal += amount;

        // Alternating row colors
        if (index % 2 === 0) {
          doc.rect(50, yPosition, doc.page.width - 100, 30)
             .fill(lightGray);
        }

        doc.fillColor(textColor)
           .fontSize(9)
           .font('Helvetica')
           .text(item.description, 60, yPosition + 10, { width: 240 })
           .text(item.quantity.toString(), 320, yPosition + 10, { width: 50 })
           .text(`$${item.unitPrice.toFixed(2)}`, 380, yPosition + 10, { width: 80 })
           .font('Helvetica-Bold')
           .text(`$${amount.toFixed(2)}`, 470, yPosition + 10, { width: 80 });

        yPosition += 30;
      });

      // Check if we need a new page
      if (yPosition > doc.page.height - 250) {
        doc.addPage();
        yPosition = 50;
      }

      drawLine(yPosition);
      yPosition += 15;

      // Subtotal
      doc.fontSize(10)
         .font('Helvetica')
         .text('Subtotal:', 380, yPosition)
         .font('Helvetica-Bold')
         .text(`$${subtotal.toFixed(2)}`, 470, yPosition);

      yPosition += 20;

      // Discount
      const discountAmount = quotationData.discount ? 
        (quotationData.discountType === 'percentage' ? 
          subtotal * (quotationData.discount / 100) : 
          quotationData.discount) : 0;

      if (discountAmount > 0) {
        doc.font('Helvetica')
           .text(`Discount ${quotationData.discountType === 'percentage' ? 
             `(${quotationData.discount}%)` : ''}:`, 380, yPosition)
           .fillColor(secondaryColor)
           .font('Helvetica-Bold')
           .text(`-$${discountAmount.toFixed(2)}`, 470, yPosition);
        
        yPosition += 20;
        doc.fillColor(textColor);
      }

      // Tax (if applicable)
      const taxAmount = quotationData.taxRate ? 
        (subtotal - discountAmount) * (quotationData.taxRate / 100) : 0;

      if (taxAmount > 0) {
        doc.font('Helvetica')
           .text(`Tax (${quotationData.taxRate}%):`, 380, yPosition)
           .font('Helvetica-Bold')
           .text(`$${taxAmount.toFixed(2)}`, 470, yPosition);
        
        yPosition += 20;
      }

      // Total
      const total = subtotal - discountAmount + taxAmount;

      doc.rect(370, yPosition - 5, 190, 30)
         .fillAndStroke(primaryColor, primaryColor);

      doc.fillColor('#ffffff')
         .fontSize(12)
         .font('Helvetica-Bold')
         .text('TOTAL:', 380, yPosition + 5)
         .fontSize(14)
         .text(`$${total.toFixed(2)}`, 470, yPosition + 5);

      yPosition += 45;
      doc.fillColor(textColor);

      // Payment terms
      if (quotationData.paymentTerms) {
        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text('PAYMENT TERMS', 50, yPosition);

        yPosition += 20;
        doc.fontSize(9)
           .font('Helvetica')
           .text(quotationData.paymentTerms, 50, yPosition, { 
             width: 500, 
             align: 'justify' 
           });

        yPosition += doc.heightOfString(quotationData.paymentTerms, { width: 500 }) + 20;
      }

      // Notes (if any)
      if (quotationData.notes) {
        // Check if we need a new page
        if (yPosition > doc.page.height - 150) {
          doc.addPage();
          yPosition = 50;
        }

        doc.fontSize(11)
           .font('Helvetica-Bold')
           .text('ADDITIONAL NOTES', 50, yPosition);

        yPosition += 20;
        doc.fontSize(9)
           .font('Helvetica')
           .text(quotationData.notes, 50, yPosition, { 
             width: 500, 
             align: 'justify' 
           });

        yPosition += doc.heightOfString(quotationData.notes, { width: 500 }) + 20;
      }

      // Terms and Conditions
      if (yPosition > doc.page.height - 200) {
        doc.addPage();
        yPosition = 50;
      }

      doc.fontSize(11)
         .font('Helvetica-Bold')
         .fillColor(primaryColor)
         .text('TERMS & CONDITIONS', 50, yPosition);

      yPosition += 20;

      const terms = [
        'This quotation is valid for the period specified above.',
        'Prices are quoted in USD and are subject to change without notice after the validity period.',
        'A 50% deposit is required before project commencement.',
        'Final balance is due upon project completion and before delivery.',
        'Delivery timeline will be confirmed upon project acceptance and deposit payment.',
        'Revisions beyond the agreed scope may incur additional charges.',
        'All intellectual property rights remain with ZimScholar until full payment is received.',
        'Client is responsible for providing all necessary project materials and information.',
        'Cancellation after project commencement may result in charges for work completed.',
        'This quotation does not constitute a contract until accepted by both parties.'
      ];

      doc.fontSize(8)
         .font('Helvetica')
         .fillColor(textColor);

      terms.forEach((term, index) => {
        doc.text(`${index + 1}. ${term}`, 50, yPosition, { 
          width: 500, 
          align: 'justify' 
        });
        yPosition += doc.heightOfString(term, { width: 500 }) + 8;
      });

      // Footer
      const footerY = doc.page.height - 80;
      drawLine(footerY);

      doc.fontSize(9)
         .fillColor(primaryColor)
         .font('Helvetica-Bold')
         .text('Thank you for choosing ZimScholar!', 50, footerY + 15, { 
           align: 'center', 
           width: doc.page.width - 100 
         });

      doc.fontSize(8)
         .fillColor(textColor)
         .font('Helvetica')
         .text('For any queries, please contact us at zimscholarprojects@gmail.com or WhatsApp +263 78 518 3361', 
           50, footerY + 35, { 
           align: 'center', 
           width: doc.page.width - 100 
         });

      // Finalize PDF
      doc.end();
      
      console.log('PDF finalized, waiting for write to complete...');

      writeStream.on('finish', () => {
        console.log('PDF write finished successfully');
        resolve(outputPath);
      });

      writeStream.on('error', (error) => {
        console.error('Write stream error:', error);
        reject(error);
      });

    } catch (error) {
      console.error('PDF generation error:', error);
      reject(error);
    }
  });
};

/**
 * Generate quotation number
 * @returns {string} - Formatted quotation number
 */
export const generateQuotationNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ZS-${year}${month}-${random}`;
};

export default {
  generateQuotationPDF,
  generateQuotationNumber
};
