"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Edit } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { transactionSchema } from "@/lib/validations";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { updateTransactionAction } from "./actions";
import LoadingButton from "@/components/controls/LoadingButton";
import { TransactionType } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

type oldDataType = {
  transactions: TransactionType[];
  totalTransactions: number;
};

const UpdateTransaction = ({
  transactionData,
}: {
  transactionData: TransactionType;
}) => {
  const queryClient = useQueryClient();

  const [amountType, setAmountType] = useState<"expense" | "income">(
    transactionData.type,
  );
  const [category, setCategory] = useState<string>(transactionData.category);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TransactionType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: transactionData.amount,
      note: transactionData?.note || "",
      type: transactionData.type,
      category: transactionData.category,
      TransactionDate: new Date(transactionData.TransactionDate),
    },
  });

  const onSubmit = async (values: TransactionType) => {
    setLoading(true);
    setError(null);

    try {
      const result = await updateTransactionAction(values, transactionData.id);

      if (result?.error) {
        setError(error);
        return;
      }

      form.reset();
      setIsOpen(false);

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClient.setQueryData(["transactions"], (oldData: oldDataType) => {
        if (!oldData) return;

        return {
          transactions: oldData.transactions.map((txn: TransactionType) => {
            if (txn.id === transactionData.id) {
              return { ...txn, ...values };
            }
          }),
          totalTransactions: oldData.totalTransactions,
        };
      });
    } catch (err) {
      console.error(err);
      setError("Failed to update transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(
    () => ({
      expense: ["food", "electronics", "travel", "other"],
      income: ["salary", "freelance", "investment", "other"],
    }),
    [],
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit className="mr-3" />
          Update
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {error && (
              <p className="text-medium text-center text-destructive">
                {error}
              </p>
            )}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="Amount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notes..."
                      className="resize-none"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select
                    onValueChange={(val) => {
                      field.onChange(val);
                      setAmountType(val as "expense" | "income");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-end justify-between gap-x-3">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        setCategory((val as string) || "");
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories[amountType]?.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() +
                              category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {category === "other" && (
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Input placeholder="Category" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="TransactionDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Transaction Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a Transaction-Date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-5">
              <LoadingButton loading={loading} type="submit" className="w-full">
                Update Transaction
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTransaction;
