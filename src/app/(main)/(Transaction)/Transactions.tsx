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
import {
  FileText,
  Calendar,
  InfoIcon,
  ArrowUp,
  ArrowDown,
  SearchIcon,
  TimerResetIcon,
} from "lucide-react";
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
import { FormInput } from "@/components/controls/FormInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { debounce, filter } from "lodash";

const Transactions = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    sortAmount: "",
    sortDate: "",
  });
  const limit = 15;

  const { data, isError, isLoading } = useQuery({
    queryKey: ["transactions", page, filters],
    queryFn: async () =>
      kyInstance
        .get(
          `/api/getTransactions?page=${page}&limit=${limit}&sortAmount=${filters.sortAmount}&sortDate=${filters.sortDate}&type=${filters.type}&search=${filters.search}`,
        )
        .json<{ transactions: TransactionType[]; totalTransactions: number }>(),
  });

  const resetFilters = () => {
    setFilters({
      search: "",
      type: "",
      sortAmount: "",
      sortDate: "",
    });
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearchDebounced = debounce((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
    setPage(1);
  }, 500);

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

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between gap-5">
        <FormInput
          icon={<SearchIcon className="size-4 text-muted-foreground" />}
          className="h-9 min-w-full"
          defaultValue={filters.search}
          placeholder={
            window.innerWidth < 768 ? "Category" : "Enter Category..."
          }
          onChange={(e) => handleSearchDebounced(e.target.value)}
        />
        <div className="flex items-center sm:gap-5">
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger className="space-x-2">
              <SelectValue
                placeholder={
                  window.innerWidth < 768 ? "Type" : "Filter by type"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Button className="ml-2" variant="outline" onClick={resetFilters}>
            <span className="hidden sm:inline-flex">Reset</span>{" "}
            <TimerResetIcon />
          </Button>
        </div>
      </div>
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
                <TableHead>
                  <div
                    onClick={() =>
                      handleFilterChange(
                        "sortAmount",
                        filters.sortAmount === "asc" ? "desc" : "asc",
                      )
                    }
                    className="flex cursor-pointer items-center gap-1"
                  >
                    <span> Amount</span>
                    <div className="space-x-2 px-0">
                      {filters.sortAmount === "asc" ? (
                        <ArrowUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ArrowDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>
                  <div
                    onClick={() =>
                      handleFilterChange(
                        "sortDate",
                        filters.sortDate === "asc" ? "desc" : "asc",
                      )
                    }
                    className="flex cursor-pointer items-center gap-1"
                  >
                    <span>Date</span>
                    <div className="space-x-2 px-0">
                      {filters.sortDate === "asc" ? (
                        <ArrowUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ArrowDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </TableHead>
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
    </div>
  );
};

export default Transactions;
