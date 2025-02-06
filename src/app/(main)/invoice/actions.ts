"use server";

import prisma from "@/lib/prisma";
import InvoiceMailer from "../../../../emails/InvoiceMailer";

interface UpdateInvoiceProps {
  status: "paid" | "pending" | "overdue" | "cancelled";
  invoiceId: string;
}

export const UpdateInvoice = async ({
  status,
  invoiceId,
}: UpdateInvoiceProps) => {
  console.log(status);

  try {
    await prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status,
      },
    });
  } catch (error) {
    console.error("Failed to update invoice status:", error);
    throw new Error("Something went wrong while updating the invoice status.");
  }
};

export const DeleteInvoiceAction = async (invoiceId: string) => {
  try {
    console.log(invoiceId);

    await prisma.product.deleteMany({
      where: {
        invoiceId: invoiceId,
      },
    });

    const invoice = await prisma.invoice.delete({
      where: {
        id: invoiceId,
      },
    });

    console.log(invoice);
  } catch (error) {
    console.log("Failed to delete invoice:", error);
    throw new Error("Something went wrong while deleting the invoice.");
  }
};

export const sendInvoice = async (
  name: string,
  email: string,
  base64Pdf: string,
  clientName: string,
  clientEmail: string
) => {
  try {
    const pdfBuffer = Buffer.from(base64Pdf, "base64");

    await InvoiceMailer({
      name,
      email,
      pdf: pdfBuffer,
      clientName,
      clientEmail,
    });
  } catch (error) {
    console.error(
      "Failed to update transaction:",
      error instanceof Error ? error.message : error
    );
    throw new Error("Something went wrong while updating the transaction.");
  }
};
