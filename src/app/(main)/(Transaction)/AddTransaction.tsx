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
import { CalendarIcon, Plus } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { transactionSchema, TransactionValues } from "@/lib/validations";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { addTransactionHandler } from "./actions";
import LoadingButton from "@/components/controls/LoadingButton";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import ScanTransaction from "./ScanTransaction";
import Divider from "@/components/Divider";

type oldDataType = {
  transactions: TransactionValues[];
  totalTransactions: number;
};
const AddTransaction = () => {
  const queryClinet = useQueryClient();

  const [amountType, setAmountType] = useState<"expense" | "income">("expense");
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<TransactionValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      note: "",
      type: undefined,
      category: "",
      TransactionDate: new Date(),
    },
  });

  const onSubmit = async (values: TransactionValues) => {
    setLoading(true);
    setError(null);

    try {
      const { newTransaction, newUser, error } =
        await addTransactionHandler(values);

      if (error) {
        setError(error);
        return;
        }
        
      if (!newTransaction || !newUser) {
        return;
        }
        
      authClient.updateUser({
        name: newUser.name,
        image: newUser.image,
      });

      form.reset();
      setIsOpen(false);

      queryClinet.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClinet.setQueryData(["transactions"], (oldData: oldDataType) => {
        if (!oldData) return;

        return {
          transactions: [newTransaction, ...oldData.transactions],
          totalTransactions: oldData.totalTransactions + 1,
        };
      });
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create the Transaction.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScanComplete = (data: TransactionValues) => {
    if (data) {
      form.setValue("amount", data.amount);
      form.setValue("note", data.note);
      form.setValue("type", data.type);
      form.setValue("category", data.category);
      form.setValue("TransactionDate", new Date(data.TransactionDate));

      form.trigger();
    }
  };

  const categories = {
    expense: ["food", "electronics", "travel", "other"],
    income: ["salary", "freelance", "investment", "other"],
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="ml-6 gap-2">
          <Plus />
          <span className="hidden md:inline-flex">Add Transaction</span>
          <span className="inline-flex md:hidden">Add</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Transaction</DialogTitle>
        </DialogHeader>
        <ScanTransaction onScanCompelete={handleScanComplete} />
        <Divider />

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
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Amount"
                      {...field}
                      className="bg-background"
                    />
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
                      className="resize-none bg-background"
                      {...field}
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
                    value={form.watch("type")}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setAmountType(val as "expense" | "income");
                    }}
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
                      defaultValue={form.watch("category")}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setCategory(val);
                      }}
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
                Add Transaction
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransaction;
