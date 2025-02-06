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
import { Card } from "@/components/ui/card";
import DashboardLoader from "@/components/skeletonLoaders/DashboardLoader";

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
    return <DashboardLoader />;
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
  const totalCategory = [
    "food",
    "electronics",
    "travel",
    "salary",
    "investment",
    "freelance",
  ];
  // const calculateTotal = (
  //   categories: string[],
  //   transactions: TransactionType[],
  // ) => {
  //   const totals: { category: string; total: number }[] = [];

  //   categories.forEach((category) => {
  //     let total = 0;

  //     transactions.forEach((transaction) => {
  //       if (transaction.category === category) {
  //         total += transaction.amount;
  //       }
  //     });
  //     totals.push({ category, total });
  //   });

  //   return totals;
  // };

  const calculateTotal = (
    categires: string[],
    transactions: TransactionType[],
    exchangeType: string,
  ) => {
    const categoryWiseTotal: {
      category: string;
      total: number;
    }[] = [];

    categires.forEach((category) => {
      if (totalCategory.includes(category)) {
        let total = 0;

        transactions.forEach((transaction) => {
          if (transaction.category === category) {
            total += transaction.amount;
          }
        });

        categoryWiseTotal.push({ category, total });
        return;
      } else {
        let total = 0;
        transactions.forEach((transaction) => {
          if (
            category === "other" &&
            !totalCategory.includes(transaction.category) &&
            transaction.type === exchangeType
          ) {
            total += transaction.amount;
          }
        });
        console.log(category, total);
        categoryWiseTotal.push({ category: "other", total });
      }
    });

    return categoryWiseTotal;
  };

  const incomeTotals = calculateTotal(
    incomeCategories,
    data.transactions,
    "income",
  );
  const expenseTotals = calculateTotal(
    expenseCategories,
    data.transactions,
    "expense",
  );

  console.log(incomeTotals);
  console.log(expenseTotals);

  const chartConfig = {
    desktop: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col justify-between gap-20 rounded-lg bg-background py-24 shadow-sm md:flex-row">
      <div className="w-full md:w-1/2">
        <h1 className="mb-4 text-lg font-semibold text-primary">
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
                  radius={6}
                  barSize={72}
                />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full md:w-1/2">
        <h1 className="mb-4 text-lg font-semibold text-destructive">
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
                  radius={6}
                  barSize={72}
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
