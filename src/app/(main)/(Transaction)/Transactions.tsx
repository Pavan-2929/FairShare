"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { FileText, Calendar, InfoIcon } from "lucide-react";
import TransactionActions from "./TransactionActions";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { Button } from "@/components/ui/button";
import TransactionLoader from "@/components/skeletonLoaders/TransactionLoader";

const Transactions = () => {
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["transactions", page],
    queryFn: async () =>
      kyInstance
        .get(`/api/getTransactions?page=${page}&limit=${limit}`)
        .json<{ transactions: TransactionType[]; totalTransactions: number }>(),
  });

  if (isLoading) {
    return <TransactionLoader />;
  }

  if (isError) {
    return (
      <p className="mt-10 text-destructive">
        Error occured during fetching transactions.
      </p>
    );
  }

  if (!data) {
    return null;
  }

  const { transactions, totalTransactions } = data;
  const totalPages = Math.ceil(totalTransactions / limit);

  console.log(totalTransactions);

  return (
    <>
      {transactions.length <= 0 ? (
        <div className="flex flex-col items-center gap-4 pt-24 text-muted-foreground">
          <FileText className="size-10 text-muted-foreground md:size-16" />
          <p className="text-center text-lg font-semibold text-muted-foreground md:text-xl">
            Looks like you haven&apos;t added any transactions yet.
          </p>
          <p className="text-center text-gray-500">
            To get started, you can add your first transaction and start
            tracking your income and expenses.
            <br />
            It only takes a few moments!
          </p>
        </div>
      ) : (
        <>
          <Table className="rounded-xl border shadow-md">
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="capitalize">{txn.category}</TableCell>
                  <TableCell
                    className={cn(
                      txn.type === "income"
                        ? "text-primary"
                        : "text-destructive",
                      "min-w-[100px] font-semibold",
                    )}
                  >
                    {txn.type === "income" ? "+" : "-"} ₹{txn.amount}
                  </TableCell>
                  <TableCell className="min-w-[100px] capitalize">
                    {txn.type}
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    <Dialog>
                      <DialogTrigger disabled={!txn.note}>
                        {" "}
                        {txn.note ? (
                          <InfoIcon className="size-5 text-muted-foreground" />
                        ) : (
                          "—"
                        )}
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Notes...</DialogTitle>
                          <DialogDescription>{txn.note}</DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="text-muted-foreground" size={16} />
                      {new Date(txn.TransactionDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell className="flex items-center justify-end">
                    <TransactionActions transaction={txn} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <div className="my-4 flex items-center justify-center gap-2">
              <Button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>
              <span className="text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Transactions;
