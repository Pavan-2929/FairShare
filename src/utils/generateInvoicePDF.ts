import { InvoiceType, UserType } from "@/lib/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const generateInvoicePDF = (invoiceData: InvoiceType, user: UserType) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor: [number, number, number] = [45, 158, 72];
  const secondaryColor: [number, number, number] = [44, 62, 80];
  const padding = 15;

  doc.setFont("courier");

  const addHeader = () => {
    const logoUrl = "/logo.png";
    doc.addImage(logoUrl, "PNG", padding, padding, 40, 15);

    doc
      .setFontSize(22)
      .setFont("bold")
      .setTextColor(...primaryColor);
    doc.text(`${invoiceData.draftName}`, pageWidth / 2, 25, {
      align: "center",
    });

    doc.setDrawColor(...primaryColor);
    doc.line(padding, 40, pageWidth - padding, 40);
  };

  // Invoice Meta Information
  const addInvoiceMeta = () => {
    doc
      .setFontSize(20)
      .setFont("bold")
      .setTextColor(...primaryColor);
    doc.text("INVOICE", pageWidth - padding, 25, { align: "right" });

    doc.setFontSize(10).setTextColor(...secondaryColor);

    const metaData = [
      { label: "Invoice No:", value: invoiceData.id || "N/A" },
      {
        label: "Issue Date:",
        value: invoiceData.issueDate?.toLocaleDateString("en-GB") || "N/A",
      },
      {
        label: "Due Date:",
        value: invoiceData.dueDate?.toLocaleDateString("en-GB") || "N/A",
      },
      {
        label: "Status:",
        value: invoiceData.status?.toUpperCase() || "PENDING",
      },
      { label: "Payment Method:", value: invoiceData.paymentMethod || "N/A" },
    ];

    metaData.forEach((item, index) => {
      doc.text(`${item.label} ${item.value}`, pageWidth / 2, 48 + index * 8, {
        align: "center",
      });
    });
  };

  // Client Information Section
  const addClientInfo = (startY: number) => {
    doc.setDrawColor(...primaryColor);
    doc.line(padding, startY, pageWidth - padding, startY);

    doc.setFont("bold").setTextColor(...primaryColor);
    doc.text("BILL FROM", padding, startY + 10);

    doc.setFont("normal").setTextColor(0);
    doc.text(user.name || "N/A", padding, startY + 18);
    doc.text(user.email || "N/A", padding, startY + 26);
    doc.text(`Phone: ${user.phoneNumber || "N/A"}`, padding, startY + 34);

    doc.setFont("bold").setTextColor(...primaryColor);
    doc.text("BILL TO", pageWidth / 2 + padding, startY + 10);

    doc.setFont("normal").setTextColor(0);
    doc.text(
      invoiceData.clientName || "N/A",
      pageWidth / 2 + padding,
      startY + 18,
    );
    doc.text(
      invoiceData.clientEmail || "N/A",
      pageWidth / 2 + padding,
      startY + 26,
    );
    doc.text(
      `Phone: ${invoiceData.clientNumber || "N/A"}`,
      pageWidth / 2 + padding,
      startY + 34,
    );

    doc.setDrawColor(...primaryColor);
    doc.line(padding, startY + 42, pageWidth - padding, startY + 42);
    return startY + 50;
  };

  const addItemsTable = (startY: number) => {
    autoTable(doc, {
      startY,
      head: [
        ["Item", "Quantity", "Unit Price (INR)", "Total (INR)"].map(
          (content) => ({
            content,
            styles: {
              fillColor: primaryColor,
              textColor: 255,
              halign: "center",
            },
          }),
        ),
      ],
      body: invoiceData.products.map((item) => [
        { content: item.name || "N/A", styles: { halign: "center" } },
        {
          content: item.quantity?.toString() || "0",
          styles: { halign: "center" },
        },
        {
          content: `${item.unitPrice?.toFixed(2) || "0.00"}`,
          styles: { halign: "center" },
        },
        {
          content: `${item.totalPrice?.toFixed(2) || "0.00"}`,
          styles: { halign: "center" },
        },
      ]),
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { halign: "center" },
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      tableLineWidth: 0.1,
    });
    return Number(doc.previousAutoTable?.finalY) + 15 || startY;
  };

  // Totals Section
  const addTotals = (startY: number) => {
    doc
      .setFontSize(12)
      .setFont("bold")
      .setTextColor(...secondaryColor);

    const totals = [
      { label: "Tax (0%):", value: 0.0 },
      { label: "Total Amount (INR):", value: invoiceData.totalAmount || 0.0 },
    ];

    totals.forEach((total, index) => {
      const yPos = startY + index * 10;
      doc.text(total.label, pageWidth - 85, yPos);
      doc.text(`${total.value.toFixed(2)}`, pageWidth - padding, yPos, {
        align: "right",
      });
      if (total.label === "Total Amount:") {
        doc.setFontSize(14).setTextColor(...primaryColor);
      }
    });
    return startY + totals.length * 10 + 10;
  };

  const addNotes = (startY: number) => {
    if (!invoiceData.notes) return startY; // Skip if no notes

    doc
      .setFontSize(12)
      .setFont("bold")
      .setTextColor(...secondaryColor);
    doc.text("Notes:", padding, startY);

    doc.setFont("normal").setTextColor(0).setFontSize(10);
    const splitNotes = doc.splitTextToSize(
      invoiceData.notes,
      pageWidth - padding * 2,
    );
    doc.text(splitNotes, padding, startY + 8);

    return startY + 8 + splitNotes.length * 5 + 10; // Calculate new Y position
  };

  // Footer Section
  const addFooter = (startY: number) => {
    doc.setFontSize(9).setFont("normal").setTextColor(100);
    doc.text("Thank you for your business!", pageWidth / 2, startY, {
      align: "center",
    });
    doc.text(
      "Terms & Conditions: Payment due within 30 days. Late payments subject to 1.5% monthly interest.",
      pageWidth / 2,
      startY + 8,
      { align: "center" },
    );
    doc.text(
      "Fairshare - Budget Management Solutions • www.fairshare.com • support@fairshare.com",
      pageWidth / 2,
      startY + 16,
      { align: "center" },
    );
  };

  addHeader();
  addInvoiceMeta();
  let currentY = 86;
  currentY = addClientInfo(currentY);
  currentY = addItemsTable(currentY);
  currentY = addTotals(currentY);
  currentY = addNotes(currentY);

  addFooter(doc.internal.pageSize.height - 30);

  return doc.output("blob");
};

export default generateInvoicePDF;
