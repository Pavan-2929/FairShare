import { Button } from "@/components/ui/button";
import { getUser } from "@/utils/getUser";
import { Calendar, FileText } from "lucide-react";
import React from "react";
import { format } from "date-fns";
import TransactionsData from "./TransactionsData";
import LineCharts from "./LineCharts";
import Category from "./Category";
import prisma from "@/lib/prisma";

const DashboardPage = async () => {
  const user = await getUser();

  if (!user) return null;

  const transaction = await prisma.transaction.findFirst({
    where: { userId: user.id },
  });

  if (!transaction)
    return (
      <div className="mt-24 flex flex-col items-center gap-4 text-muted-foreground">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-xl font-semibold text-muted-foreground">
          Looks like you haven't added any transactions yet.
        </p>
        <p className="text-center text-gray-500">
          To get started, you can add your first transaction and start tracking
          your income and expenses.
          <br />
          It only takes a few moments!
        </p>
      </div>
    );
  return (
    <div>
      <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Dashbaord</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 rounded-md border px-4 py-2 text-sm font-semibold text-muted-foreground">
            <Calendar className="text-muted-foreground" />
            <p>
              {format(user.createdAt, "dd-MMM-yyyy")} to{" "}
              {format(new Date(), "dd-MMM-yyyy")}
            </p>
          </div>
        </div>
      </div>
      <TransactionsData />
      <LineCharts />
      <Category />
    </div>
  );
};

export default DashboardPage;
