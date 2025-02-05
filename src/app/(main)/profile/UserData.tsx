"use client";

import kyInstance from "@/lib/ky";
import { TransactionType } from "@/lib/types";
import useSession from "@/utils/useSession";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import React from "react";
import DeleteAccount from "./DeleteAcoount";

const UserData = () => {
  const { user } = useSession();

  if (!user) redirect("/sign-in");

  const { data, isError, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () =>
      kyInstance.get(`/api/getTransactions`).json<{
        transactions: TransactionType[];
        totalTransactions: number;
      }>(),
  });

  const totalIncome =
    data?.transactions.reduce(
      (sum, transaction) =>
        transaction.type === "income" ? sum + transaction.amount : sum,
      0,
    ) || 0;

  const totalExpense =
    data?.transactions.reduce(
      (sum, transaction) =>
        transaction.type === "expense" ? sum + transaction.amount : sum,
      0,
    ) || 0;

  return (
    <div className="space-y-7 rounded-md border border-border bg-card p-5">
      {isLoading && <p>Loading transactions...</p>}
      {isError && <p className="text-red-500">Failed to load transactions.</p>}

      {data && (
        <>
          <div className="flex flex-wrap justify-between gap-2">
            <div className="space-y-1 rounded-md border p-4 text-center">
              <p className="font-serif text-[15px] font-medium">Transactions</p>
              <p className="font-semibold text-muted-foreground">
                {data.totalTransactions}
              </p>
            </div>
            <div className="space-y-1 rounded-md border p-4 text-center">
              <p className="font-serif text-[15px] font-medium">Income</p>
              <p className="font-semibold text-green-600">
                ₹{totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1 rounded-md border p-4 text-center">
              <p className="font-serif text-[15px] font-medium">Expense</p>
              <p className="font-semibold text-destructive">
                ₹{totalExpense.toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text font-semibold md:mb-4 md:text-xl">
          Delete an account?
        </h1>
        <DeleteAccount />
      </div>
    </div>
  );
};

export default UserData;
