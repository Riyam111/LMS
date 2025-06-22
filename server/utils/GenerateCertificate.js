import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const generateCertificatePDF = ({ studentName, courseTitle, date }) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
    });

    const buffer = [];

    doc.on('data', buffer.push.bind(buffer));
    doc.on('end', () => {
      resolve(Buffer.concat(buffer));
    });

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

    // Border
    doc
      .lineWidth(4)
      .strokeColor('#003049')
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .stroke();

    // Title
    doc
      .fillColor('#003049')
      .fontSize(28)
      .font('Times-Bold')
      .text(' Certificate of Completion', {
        align: 'center',
        underline: true,
      });

    doc.moveDown(2);

    doc
      .fontSize(16)
      .fillColor('black')
      .font('Times-Roman')
      .text(`This is to certify that`, { align: 'center' });

    doc.moveDown(1);

    doc
      .fontSize(24)
      .font('Times-Bold')
      .fillColor('#2a9d8f')
      .text(studentName, { align: 'center' });

    doc.moveDown(1.5);

    doc
      .fontSize(16)
      .font('Times-Roman')
      .fillColor('black')
      .text(`has successfully completed the course`, { align: 'center' });

    doc.moveDown(1);

    doc
      .fontSize(20)
      .font('Times-BoldItalic')
      .fillColor('#264653')
      .text(`"${courseTitle}"`, { align: 'center' });

    doc.moveDown(2);

    doc
      .fontSize(14)
      .font('Times-Italic')
      .fillColor('gray')
      .text(`Date of Completion: ${date}`, { align: 'center' });

    doc.moveDown(4);

    // Signature line (optional)
    doc
      .fontSize(12)
      .font('Times-Roman')
      .fillColor('black')
      .text('_______________________', { align: 'right' });
    doc.text('Instructor Signature', { align: 'right' });

    doc.end();
  });
};

export default generateCertificatePDF;
