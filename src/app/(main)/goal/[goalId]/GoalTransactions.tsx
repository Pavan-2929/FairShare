"use client";

import prisma from "@/lib/prisma";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceStrict } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { GoalTransactionType } from "@/lib/types";
import { Loader2 } from "lucide-react";
import GoalTransactionLoader from "@/components/skeletonLoaders/GoalTransactionLoader";

interface GoalTransactionsProps {
  goalId: string;
}

const GoalTransactions = ({ goalId }: GoalTransactionsProps) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["goalTransactions", goalId],
    queryFn: async () =>
      kyInstance
        .get(`/api/goalsTransactions/get?goalId=${goalId}`)
        .json<GoalTransactionType[]>(),
  });

  if (isLoading) {
    return <GoalTransactionLoader />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Error Loading Transactions
        </h2>
        <p className="mt-2 text-gray-500">
          Please try again later or check your network connection.
        </p>
      </div>
    );
  }

  if (!data || !data.length) {
    return (
      <div className="flex flex-col items-center justify-center px-5 py-11 text-center">
        <h2 className="text-lg font-semibold">No Goal Transactions Found</h2>
        <p className="mt-2 text-gray-500">
          Start by creating your first transaction to track your goals!
        </p>
      </div>
    );
  }

  return (
    <div className="pt-7">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead className="text-center">Amount (₹)</TableHead>
            <TableHead className="text-end">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="text-center">₹{item.amount}</TableCell>
              <TableCell className="text-end">
                {formatDistanceStrict(new Date(item.createdAt), new Date())} ago
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GoalTransactions;
