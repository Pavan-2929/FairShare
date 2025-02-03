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
      0
    ) || 0;

  const totalIncomeEntries = data.transactions.filter(
    (transaction) => transaction.type === "income"
  ).length;

  const totalExpense =
    data.transactions.reduce(
      (sum, acc) => (acc.type === "expense" ? sum + acc.amount : sum),
      0
    ) || 0;

  const totalExpenseEntries = data.transactions.filter(
    (transaction) => transaction.type === "expense"
  ).length;

  const netSaving = totalIncome - totalExpense;
  const totalEntries = totalExpenseEntries + totalIncomeEntries;
  const totalAmount = totalExpense + totalIncome;

  return (
    <div className="flex flex-wrap gap-5 pt-7">
      <div className="border border-accent-foreground/10 rounded-xl p-6 w-full min-w-[300px] flex-1 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 border border-accent-foreground/10 rounded-lg">
            <FiDollarSign className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-accent-foreground/90 text-sm">
              Total Transactions
            </p>
            <h1 className="text-[26px] font-bold text-foreground">
              <CountUp end={totalAmount} duration={2} />
            </h1>
          </div>
        </div>
        <p className="text-sm text-accent-foreground">
          Tracking since {format(user.createdAt, "PPP")}
        </p>
      </div>

      <div className="border rounded-xl p-6 flex-1 min-w-[250px] hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 border border-accent-foreground/10  rounded-lg">
            <FiArrowUpCircle className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-accent-foreground/90 text-sm">
              Total Income
            </p>
            <h1 className="text-[26px] font-bold text-foreground">
              ₹
              <CountUp end={totalIncome} duration={2} separator="," />
            </h1>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="px-2 py-1 text-accent-foreground rounded-full text-sm">
            <CountUp end={totalIncomeEntries} duration={2} /> entries
          </span>
          <FiActivity className="w-5 h-5 text-accent-foreground" />
        </div>
      </div>

      <div className="border border-accent-foreground/10 rounded-xl p-6 flex-1 min-w-[250px] hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 border border-accent-foreground/10 rounded-lg">
            <FiArrowDownCircle className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-accent-foreground/90 text-sm">
              Total Expense
            </p>
            <h1 className="text-[26px] font-bold text-foreground">
              ₹
              <CountUp end={totalExpense} duration={2} separator="," />
            </h1>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="px-2 py-1 text-accent-foreground rounded-full text-sm">
            <CountUp end={totalExpenseEntries} duration={2} /> entries
          </span>
          <FiActivity className="w-5 h-5 text-accent-foreground" />
        </div>
      </div>

      <div className="border border-accent-foreground/10 rounded-xl p-6 flex-1 min-w-[250px] hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 border border-accent-foreground/10 rounded-lg">
            <FiActivity className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold text-accent-foreground/90 text-sm">
              Net Savings
            </p>
            <h1 className="text-[26px] font-bold text-foreground">
              ₹
              <CountUp end={Math.abs(netSaving)} duration={2} separator="," />
            </h1>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="px-2 py-1 text-accent-foreground rounded-full text-sm">
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
