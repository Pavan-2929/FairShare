import { getUser } from "@/app/getSessionUser";
import prisma from "@/lib/prisma";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  FileText,
  Calendar,
  Wallet,
  MoreHorizontal,
} from "lucide-react";

const ShowTransactions = async () => {
  const user = await getUser();

  if (!user) {
    return <p className="text-red-500">User not found</p>;
  }

  // Fetch transactions for the logged-in user
  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { TransactionDate: "desc" },
  });

  return (
    <div className="mx-auto">
      {transactions.length === 0 ? (
        <div className="text-gray-500 flex flex-col items-center gap-3 mt-10">
          <FileText className="w-16 h-16 text-gray-400" />
          <p>No transactions found</p>
        </div>
      ) : (
        <Table className="border rounded-xl  shadow-md">
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
                <TableCell>{txn.category}</TableCell>
                <TableCell
                  className={`${
                    txn.type === "income" ? "text-primary" : "text-destructive"
                  }`}
                >
                  {txn.type === "income" ? "+" : "-"} ${txn.amount.toNumber()}
                </TableCell>
                <TableCell>{txn.type}</TableCell>
                <TableCell>{txn.note || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="text-muted-foreground" size={16} />
                    {new Date(txn.TransactionDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell className="flex justify-end items-center">
                  <MoreHorizontal className="size-5 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ShowTransactions;
