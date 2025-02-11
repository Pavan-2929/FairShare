import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const goalId = request.nextUrl.searchParams.get("goalId");

    if (!goalId) {
      return Response.json({ error: "Missing goalId" }, { status: 400 });
    }

    const goalsTransactions = await prisma.goalTransaction.findMany({
      where: {
        goalId,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(goalsTransactions);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred." }, { status: 500 });
  }
}
