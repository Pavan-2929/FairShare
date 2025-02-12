"use server";

import prisma from "@/lib/prisma";
import { goalSchema, GoalValues } from "@/lib/validations";
import { getUser } from "@/utils/getUser";

export default async function createGoalAction(values: GoalValues) {
  try {
    console.log(values);

    const {
      category,
      completionDate,
      image,
      note,
      priority,
      targetAmount,
      title,
    } = goalSchema.parse(values);

    const user = await getUser();

    const newGoal = await prisma.goal.create({
      data: {
        userId: user.id,
        title,
        note: note || "",
        image,
        targetAmount,
        completionDate,
        category,
        priority,
      },
    });

    return newGoal;
  } catch (error) {
    console.error("Failed to create goals", error);
    throw new Error("Something went wrong while creating the goals status.");
  }
}
