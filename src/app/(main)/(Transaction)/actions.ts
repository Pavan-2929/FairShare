"use server";

import { getUser } from "@/app/getUser";
import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";
import { TransactionValues } from "@/lib/validations";

export const addTransactionAction = async (credentials: TransactionValues) => {
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

export const deleteTransactionAction = async (transactionId: string) => {
  try {
    await prisma.transaction.delete({
      where: { id: transactionId },
    });
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    throw new Error("Something went wrong while deleting the transaction.");
  }
};

export const updateTransactionAction = async (
  transactionData: TransactionType,
  transactionId: string
) => {
  console.log(transactionData);
  console.log(transactionId);

  const { amount, note, type, category, TransactionDate } = transactionData;

  if (!amount || !type || !category || !TransactionDate) {
    throw new Error("All required fields must be provided.");
  }

  try {
    const user = await getUser();

    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    console.log(existingTransaction);

    if (!existingTransaction) {
      throw new Error("Transaction not found.");
    }
console.log(user.id);

    if (existingTransaction.userId !== user.id) {
      throw new Error("Unauthorized access to this transaction.");
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        amount,
        note,
        type,
        category,
        TransactionDate,
      },
    });
  } catch (error) {
    console.error(
      "Failed to update transaction:",
      error instanceof Error ? error.message : error
    );
    throw new Error("Something went wrong while updating the transaction.");
  }
};
