import { getUser } from "@/utils/getUser";
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

const ShowTransactions = async () => {
  const user = await getUser();

  if (!user) {
    return <p className="text-red-500">User not found</p>;
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { TransactionDate: "desc" },
  });
  return (
    <div className="mx-auto">
      {transactions.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-4 mt-24">
          <FileText className="w-16 h-16 text-muted-foreground" />
          <p className="font-semibold text-xl text-muted-foreground">
            Looks like you haven't added any transactions yet.
          </p>
          <p className="text-center text-gray-500">
            To get started, you can add your first transaction and start
            tracking your income and expenses.
            <br />
            It only takes a few moments!
          </p>
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
                  className={cn(
                    txn.type === "income" ? "text-primary" : "text-destructive",
                    "font-semibold"
                  )}
                >
                  {txn.type === "income" ? "+" : "-"} ${txn.amount}
                </TableCell>
                <TableCell>{txn.type}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger>
                      {" "}
                      {txn.note ? (
                        <InfoIcon className="text-muted-foreground size-5" />
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
                <TableCell className="flex justify-end items-center">
                  <TransactionActions transaction={txn} />
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
