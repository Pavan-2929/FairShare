"use server";

import { getUser } from "@/app/getSessionUser";
import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/validations";

const addTransactionAction = async (credentials: TransactionType) => {
  try {
    const { amount, note, type, category, TransactionDate } = credentials;

    const user = await getUser();

    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        note,
        type,
        category,
        TransactionDate,
      },
    });
  } catch (error) {
    console.error("Failed to add transaction:", error);
    throw new Error("Something went wrong while adding the transaction.");
  }
};

export default addTransactionAction;
