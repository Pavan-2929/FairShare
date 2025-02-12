"use server";

import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";
import { Goal } from "lucide-react";

interface AddGoalTransactionProps {
  amount: number;
  goalId: string;
}

export const handleGoalTransaction = async ({
  amount,
  goalId,
}: AddGoalTransactionProps) => {
  return await prisma.$transaction(async () => {
    const user = await getUser();

    const goal = await prisma.goal.findFirst({
      where: {
        id: goalId,
      },
    });

    if (!goal) {
      throw new Error("Goal not found.");
    }

    // Update User's wallet
    const newWallet = user.wallet - amount;

    if (newWallet < 0) {
      throw new Error("You don't have enough balance in your wallet.");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        wallet: newWallet,
      },
    });

    // Update Goal's CurrentAmount
    const totalCurrentAmount = amount + goal.currentAmount;

    if (totalCurrentAmount > goal.targetAmount) {
      throw new Error("Amount exceeds target amount.");
    }

    const targetAchieved = totalCurrentAmount === goal.targetAmount;

    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
      },
      data: {
        currentAmount: {
          increment: amount,
        },
        status: targetAchieved ? "completed" : "active",
      },
    });

    // Update Goal's Transaction
    const newGoalTransaction = await prisma.goalTransaction.create({
      data: {
        amount,
        goalId,
      },
    });

    return { updatedGoal, updatedUser, newGoalTransaction };
  });
};

export const changeStatusToCancelled = async (goalId: string) => {
  await prisma.goal.update({
    where: {
      id: goalId,
    },
    data: {
      status: "cancelled",
    },
  });
};
export const changeStatusToActive = async (goalId: string) => {
  await prisma.goal.update({
    where: {
      id: goalId,
    },
    data: {
      status: "active",
    },
  });
};

export const deleteGoal = async (goalId: string) => {
  await prisma.goal.delete({
    where: {
      id: goalId,
    },
  });
};
