"use server";

import prisma from "@/lib/prisma";
import { invoiceSchema, InvoiceValues } from "@/lib/validations";
import { getUser } from "@/utils/getUser";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

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

    return redirect("/invoice");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error("Failed to add Invoice:", error);
    throw new Error("Something went wrong.");
  }
};
