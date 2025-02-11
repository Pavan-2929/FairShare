"use server";

import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";

interface AddGoalTransactionProps {
  amount: number;
  goalId: string;
}

export const addGoalTransaction = async ({
  amount,
  goalId,
}: AddGoalTransactionProps) => {
  const newGoalTransaction = await prisma.goalTransaction.create({
    data: {
      amount,
      goalId,
    },
  });
  return newGoalTransaction;
};

export const updateUserWalletFromGoalsTransaction = async (amount: number) => {
  const user = await getUser();

  const newWallet = user.wallet - amount;

  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      wallet: newWallet,
    },
  });

  return updatedUser;
};

export const updateGoalCurrentValue = async ({
  amount,
  goalId,
}: AddGoalTransactionProps) => {
  const goal = await prisma.goal.findFirst({
    where: {
      id: goalId,
    },
  });

  if (!goal) {
    throw new Error("Goal not found.");
  }

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

  return updatedGoal;
};
