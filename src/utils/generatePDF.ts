import { TransactionType } from "@/lib/types";
import jsPDF from "jspdf";
const generatePDF = (transactions: TransactionType[], name: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = 40;
  const primaryColor: [number, number, number] = [45, 158, 72];
  const accentColor: [number, number, number] = [44, 62, 80];
  const headerColor: [number, number, number] = [199, 236, 238];

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

  const logoUrl = "/logo.png";
  const logoHeight = 22;
  const logoWidth = 35;
  doc.addImage(logoUrl, "PNG", margin, margin, logoWidth, logoHeight);

  doc.text("Fairshare Report", pageWidth / 2, currentY, { align: "center" });
  currentY += 10;

  doc.setDrawColor(...primaryColor);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  doc.setFontSize(10);
  doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
  doc.setFont("helvetica", "normal");

  const userInfo = `Report for: ${name}`;
  const dateInfo = `Generated on: ${new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  doc.text(userInfo, margin, currentY);
  const dateWidth = doc.getTextWidth(dateInfo);
  doc.text(dateInfo, pageWidth - margin - dateWidth, currentY);
  currentY += 20;

  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("Transaction Report", pageWidth / 2, currentY, { align: "center" });
  currentY += 12;

  const headers = ["  #", "Amount", "Type", "Category", "Date"];
  const columnPositions = [
    margin,
    margin + 20,
    margin + 60,
    margin + 95,
    pageWidth - margin - 40,
  ];

  doc.setFillColor(...primaryColor);
  doc.rect(margin, currentY - 5, pageWidth - margin * 2, 10, "F");
  doc.setFontSize(10);
  doc.setTextColor(256, 256, 256);

  headers.forEach((header, index) => {
    doc.text(header, columnPositions[index], currentY + 2);
  });
  currentY += 12;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const lineHeight = 8;
  const rowBackgroundColor = [245, 245, 245];

  transactions.forEach((transaction: TransactionType, index: number) => {
    if (currentY + 40 > pageHeight - margin) {
      doc.addPage();
      currentY = margin + 10;
      doc.setFillColor(...primaryColor);
      doc.rect(margin, currentY - 5, pageWidth - margin * 2, 10, "F");
      doc.setFontSize(10);
      doc.setTextColor(256, 256, 256);
      headers.forEach((header, idx) => {
        doc.text(header, columnPositions[idx], currentY + 2);
      });
      currentY += 12;
    }

    doc.setFillColor(
      rowBackgroundColor[0],
      rowBackgroundColor[1],
      rowBackgroundColor[2],
    );
    doc.rect(margin, currentY - 2, pageWidth - margin * 2, lineHeight + 4, "F");

    const indexString = `   ${index + 1}`;

    doc.setTextColor(...accentColor);
    doc.text(String(indexString), columnPositions[0], currentY + 6);
    doc.text(
      `${transaction.amount.toFixed(2)}`,
      columnPositions[1],
      currentY + 6,
    );

    if (transaction.type === "income") {
      doc.setTextColor(56, 161, 105);
    } else {
      doc.setTextColor(229, 62, 62);
    }
    doc.text(
      transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1),
      columnPositions[2],
      currentY + 6,
    );

    doc.setTextColor(...accentColor);
    doc.text(transaction.category, columnPositions[3], currentY + 6);

    const transDate = new Date(transaction.TransactionDate);
    doc.text(
      transDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      columnPositions[4],
      currentY + 6,
    );

    currentY += lineHeight + 8;

    if (transaction.note) {
      const noteText = `Note: ${transaction.note}`;
      const noteLines = doc.splitTextToSize(noteText, pageWidth - margin * 2);

      noteLines.forEach((line: string) => {
        if (currentY + lineHeight > pageHeight - margin) {
          doc.addPage();
          currentY = margin;
          doc.setFillColor(...headerColor);
          doc.rect(margin, currentY - 5, pageWidth - margin * 2, 10, "F");
          doc.setTextColor(...primaryColor);
          headers.forEach((header, idx) => {
            doc.text(header, columnPositions[idx], currentY + 1);
          });
          currentY += 1;
        }

        doc.setTextColor(...accentColor);
        doc.text(line, margin, currentY);
        currentY += 6;
      });

      currentY += 8;
    }
  });

  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.setFont("helvetica", "italic");
  doc.line(
    margin,
    pageHeight - margin,
    pageWidth - margin,
    pageHeight - margin,
  );
  doc.text(
    `Confidential - Generated by Fairshare • Page ${doc.getNumberOfPages()}`,
    pageWidth / 2,
    pageHeight - margin + 5,
    { align: "center" },
  );

  return doc.output("blob");
};

export default generatePDF;
