"use client";

import kyInstance from "@/lib/ky";
import { TransactionType } from "@/lib/types";
import useSession from "@/utils/useSession";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Category = () => {
  const { user } = useSession();

  if (!user) return redirect("/sign-in");

  const { data, isError, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () =>
      kyInstance.get(`/api/getTransactions`).json<{
        transactions: TransactionType[];
        totalTransactions: number;
      }>(),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row justify-between gap-12 p-6 bg-background rounded-lg shadow-sm">
        <div className="w-full md:w-1/2">
          <Skeleton className="h-[400px] w-full" />
        </div>
        <div className="w-full md:w-1/2">
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load transaction data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) return null;

  const expenseCategories = ["food", "electronics", "travel", "other"];
  const incomeCategories = ["salary", "freelance", "investment", "other"];

  const calculateTotal = (
    categories: string[],
    transactions: TransactionType[]
  ) => {
    const totals: { category: string; total: number }[] = [];

    categories.forEach((category) => {
      let total = 0;

      transactions.forEach((transaction) => {
        if (transaction.category === category) {
          total += transaction.amount;
        }
      });
      totals.push({ category, total });
    });

    return totals;
  };

  const incomeTotals = calculateTotal(incomeCategories, data.transactions);
  const expenseTotals = calculateTotal(expenseCategories, data.transactions);

  const chartConfig = {
    desktop: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col md:flex-row justify-between gap-20 py-24 bg-background rounded-lg shadow-sm">
      <div className="w-full md:w-1/2">
        <h1 className="text-lg font-semibold text-primary mb-4">
          Income Categories
        </h1>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={incomeTotals}>
                <CartesianGrid vertical={false} stroke="hsl(var(--muted))" />
                <XAxis
                  dataKey="category"
                  tickMargin={10}
                  stroke="hsl(var(--muted-foreground))"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--primary) / 0.8)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <h1 className="text-lg font-semibold text-destructive mb-4">
          Expense Categories
        </h1>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={expenseTotals}>
                <CartesianGrid vertical={false} stroke="hsl(var(--muted))" />
                <XAxis
                  dataKey="category"
                  tickMargin={10}
                  stroke="hsl(var(--muted-foreground))"
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey="total"
                  fill="hsl(var(--destructive) / 0.8)"
                  radius={8}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Category;
