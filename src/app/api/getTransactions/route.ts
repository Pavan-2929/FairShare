import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";
import { TransactionType } from "@prisma/client";
import { NextRequest } from "next/server";

type WhereClauseType = {
  userId: string;
  type?: TransactionType;
  category?: {
    contains: string;
    mode: "insensitive";
  };
};

type OrderByType = {
  amount?: "asc" | "desc";
  createdAt?: "asc" | "desc";
};

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const page = Number(request.nextUrl.searchParams.get("page") || 1);
    const limit = Number(request.nextUrl.searchParams.get("limit") || "15");
    const search = request.nextUrl.searchParams.get("search") || "";
    const type = request.nextUrl.searchParams.get("type") || "";
    const sortAmount = request.nextUrl.searchParams.get("sortAmount") || "";
    const sortDate = request.nextUrl.searchParams.get("sortDate") || "";

    const skip = (page - 1) * limit;

    const whereClause: WhereClauseType = {
      userId: user.id,
    };

    if (type) {
      whereClause.type = type as TransactionType;
    }

    if (search) {
      whereClause.category = {
        contains: search,
        mode: "insensitive",
      };
    }

    const orderBy: OrderByType[] = [];

    if (sortAmount) {
      orderBy.push({
        amount: sortAmount === "asc" ? "asc" : "desc",
      });
    }

    if (sortDate) {
      orderBy.push({
        createdAt: sortDate === "asc" ? "asc" : "desc",
      });
    }

    if (orderBy.length === 0) {
      orderBy.push({ createdAt: "desc" });
    }

    const [transactions, totalTransactions] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
      }),

      prisma.transaction.count({
        where: whereClause,
      }),
    ]);

    return Response.json({ transactions, totalTransactions });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "An error occurred." }, { status: 500 });
  }
}
