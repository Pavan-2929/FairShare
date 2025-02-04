"use server";

import prisma from "@/lib/prisma";

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


export const DeleteInvoice = async (invoiceId: string) => {
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
