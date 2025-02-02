import prisma from "@/lib/prisma";
import { TransactionType } from "@/lib/types";
import { getUser } from "@/utils/getUser";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = Number(request.nextUrl.searchParams.get("page") || 1);
    const limit = Number(request.nextUrl.searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;

    const [transactions, totalTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),

      prisma.transaction.count({
        where: { userId: user.id },
      }),
    ]);

    return Response.json({ transactions, totalTransactions });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred." }, { status: 500 });
  }
}
