"use client";

import kyInstance from "@/lib/ky";
import { TransactionType } from "@/lib/types";
import useSession from "@/utils/useSession";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const LineCharts = () => {
  const { user } = useSession();
  
  const { data, isError, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () =>
      kyInstance.get(`/api/getTransactions`).json<{
        transactions: TransactionType[];
        totalTransactions: number;
      }>(),
  });
  
  if (!user) return redirect("/sign-in");
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data</div>;

  const formatData = (transactions: TransactionType[]) => {
    const groupedData: { date: string; income: number; expense: number }[] = [];

    transactions.forEach((transaction) => {
      const month = new Date(transaction.TransactionDate).toLocaleString(
        "default",
        {
          month: "short",
          year: "numeric",
        }
      );

      let isExistingMonth = groupedData.find((item) => item.date === month);

      if (!isExistingMonth) {
        isExistingMonth = { date: month, income: 0, expense: 0 };
        groupedData.push(isExistingMonth);
      }

      if (transaction.type === "income") {
        isExistingMonth.income += transaction.amount;
      } else {
        isExistingMonth.expense += transaction.amount;
      }
    });

    return groupedData.sort((a, b) =>
      new Date(a.date) > new Date(b.date) ? 1 : -1
    );
  };

  const formattedData = formatData(data?.transactions || []);

  return (
    <div className="py-20">
      <h1 className="text-center text-2xl font-semibold mb-6">
        Income and Expense Trends
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="hsl(var(--primary) / 0.8)"
            strokeWidth={3}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="hsl(var(--destructive) / 0.8)"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineCharts;
