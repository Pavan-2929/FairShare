"use client";

import kyInstance from "@/lib/ky";
import { TransactionType } from "@/lib/types";
import useSession from "@/utils/useSession";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import React from "react";
import {
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiDollarSign,
  FiActivity,
} from "react-icons/fi";
import CountUp from "react-countup";

const TransactionsData = () => {
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

  if (!data || !data.transactions || !data.totalTransactions) {
    return null;
  }

  const totalIncome =
    data.transactions.reduce(
      (sum, acc) => (acc.type === "income" ? sum + acc.amount : sum),
      0,
    ) || 0;

  const totalIncomeEntries = data.transactions.filter(
    (transaction) => transaction.type === "income",
  ).length;

  const totalExpense =
    data.transactions.reduce(
      (sum, acc) => (acc.type === "expense" ? sum + acc.amount : sum),
      0,
    ) || 0;

  const totalExpenseEntries = data.transactions.filter(
    (transaction) => transaction.type === "expense",
  ).length;

  const netSaving = totalIncome - totalExpense;
  const totalEntries = totalExpenseEntries + totalIncomeEntries;
  const totalAmount = totalExpense + totalIncome;

  return (
    <div className="flex flex-wrap gap-5 pt-7">
      <div className="w-full min-w-[260px] flex-1 rounded-xl border border-accent-foreground/10 p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg border border-accent-foreground/10 p-3">
            <FiDollarSign className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-accent-foreground/90">
              Total Transactions
            </p>
            <h1 className="text-[26px] font-bold text-foreground">
              <CountUp end={data.totalTransactions} duration={2} />
            </h1>
          </div>
        </div>
        <p className="text-sm text-accent-foreground">
          Tracking since {format(user.createdAt, "PPP")}
        </p>
      </div>

      <div className="min-w-[260px] flex-1 rounded-xl border p-6 transition-shadow hover:shadow-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg border border-accent-foreground/10 p-3">
            <FiArrowUpCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-accent-foreground/90">
              Total Income
            </p>
            <h1 className="text-[26px] font-bold text-foreground">
              ₹
              <CountUp end={totalIncome} duration={2} separator="," />
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="rounded-full px-2 py-1 text-sm text-accent-foreground">
            <CountUp end={totalIncomeEntries} duration={2} /> entries
          </span>
          <FiActivity className="h-5 w-5 text-accent-foreground" />
        </div>
      </div>

      <div className="min-w-[260px] flex-1 rounded-xl border border-accent-foreground/10 p-6 transition-shadow hover:shadow-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg border border-accent-foreground/10 p-3">
            <FiArrowDownCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-accent-foreground/90">
              Total Expense
            </p>
            <h1 className="text-[26px] font-bold text-foreground">
              ₹
              <CountUp end={totalExpense} duration={2} separator="," />
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="rounded-full px-2 py-1 text-sm text-accent-foreground">
            <CountUp end={totalExpenseEntries} duration={2} /> entries
          </span>
          <FiActivity className="h-5 w-5 text-accent-foreground" />
        </div>
      </div>

      <div className="min-w-[260px] flex-1 rounded-xl border border-accent-foreground/10 p-6 transition-shadow hover:shadow-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg border border-accent-foreground/10 p-3">
            <FiActivity className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-accent-foreground/90">
              Net Savings
            </p>
            <h1 className="text-[26px] font-bold text-foreground">
              ₹
              <CountUp end={Math.abs(netSaving)} duration={2} separator="," />
            </h1>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="rounded-full px-2 py-1 text-sm text-accent-foreground">
            from <CountUp end={totalEntries} duration={2} /> entries
          </span>
          <span className="text-sm text-accent-foreground">
            {netSaving >= 0 ? "Profit" : "Loss"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionsData;
