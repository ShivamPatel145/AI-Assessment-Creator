import PDFDocument from 'pdfkit';
import { Response } from 'express';

export const generatePdf = (assignment: any, res: Response) => {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${assignment.title}.pdf"`);
  
  doc.pipe(res);

  doc.fontSize(20).text(assignment.title, { align: 'center' }).moveDown();
  
  assignment.result.sections.forEach((section: any) => {
    doc.fontSize(16).text(section.title).moveDown(0.5);
    if (section.instructions) {
      doc.fontSize(12).font('Helvetica-Oblique').text(section.instructions).moveDown().font('Helvetica');
    }
    section.questions.forEach((q: any, i: number) => {
      doc.fontSize(12).text(`${i + 1}. ${q.question} [${q.marks} Marks, ${q.difficulty}]`).moveDown(0.5);
    });
    doc.moveDown();
  });

  doc.end();
};
