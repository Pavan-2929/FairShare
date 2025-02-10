"use server";

import prisma from "@/lib/prisma";
import {
  TransactionValues,
  UpdateUserValues,
  UserOtherDetailsValues,
} from "@/lib/validations";
import { getUser } from "@/utils/getUser";

export async function updateUserDetails(values: UpdateUserValues) {
  const { name, phoneNumber } = values;

  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const newUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      phoneNumber,
    },
  });

  return newUser;
}

export async function updateUserOtherDetails(values: UserOtherDetailsValues) {
  const { age, gender, city } = values;

  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const newUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      age,
      gender,
      city,
    },
  });

  return newUser;
}

export async function updateUserWallet(values: TransactionValues) {
  const { amount, type } = values;

  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  let walletMoney = user.wallet;

  if (type === "expense") {
    walletMoney -= amount;
  } else {
    walletMoney += amount;
  }

  const newUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      wallet: walletMoney,
    },
  });

  return newUser;
}
