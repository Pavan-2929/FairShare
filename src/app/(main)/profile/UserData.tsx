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
      0
    ) || 0;

  const totalExpense =
    data?.transactions.reduce(
      (sum, transaction) =>
        transaction.type === "expense" ? sum + transaction.amount : sum,
      0
    ) || 0;

  return (
    <div className="p-5 bg-card rounded-md space-y-7 border border-border">
      {isLoading && <p>Loading transactions...</p>}
      {isError && <p className="text-red-500">Failed to load transactions.</p>}

      {data && (
        <>
          <div className="flex justify-between gap-2">
            <div className="border p-4 text-center rounded-md space-y-1">
              <p className="font-medium text-[15px] font-serif">Transactions</p>
              <p className="text-muted-foreground font-semibold">
                {data.totalTransactions}
              </p>
            </div>
            <div className="border p-4 text-center rounded-md space-y-1">
              <p className="font-medium text-[15px] font-serif">Income</p>
              <p className="text-green-600 font-semibold">
                ${totalIncome.toFixed(2)}
              </p>
            </div>
            <div className="border p-4 text-center rounded-md space-y-1">
              <p className="font-medium text-[15px] font-serif">Expense</p>
              <p className="text-destructive font-semibold">
                ${totalExpense.toFixed(2)}
              </p>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold mb-4">Delete an account?</h1>
        <DeleteAccount />
      </div>
    </div>
  );
};

export default UserData;
