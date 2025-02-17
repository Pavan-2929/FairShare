"use server";

import prisma from "@/lib/prisma";
import { invoiceSchema, InvoiceValues } from "@/lib/validations";
import { getUser } from "@/utils/getUser";

export const CreateInvoiceAction = async (values: InvoiceValues) => {
  try {
    const {
      draftName,
      clientEmail,
      clientName,
      dueDate,
      issueDate,
      notes,
      paymentMethod,
      products,
      status,
      totalAmount,
      clientNumber,
    } = invoiceSchema.parse(values);
    const user = await getUser();

    await prisma.invoice.create({
      data: {
        userId: user.id,
        draftName,
        clientEmail,
        clientName,
        dueDate,
        issueDate,
        notes,
        paymentMethod,
        products: {
          create: products.map((product) => ({
            name: product.name,
            unitPrice: product.unitPrice,
            quantity: product.quantity,
            totalPrice: product.totalPrice,
          })),
        },
        status,
        totalAmount,
        clientNumber,
      },
    });
  } catch (error) {
    console.error("Failed to add Invoice:", error);
    throw new Error("Something went wrong.");
  }
};
