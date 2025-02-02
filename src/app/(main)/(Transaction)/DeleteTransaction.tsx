import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTransactionAction } from "./actions";
import LoadingButton from "@/components/controls/LoadingButton";
import { useQueryClient } from "@tanstack/react-query";
import { TransactionsData, TransactionType } from "@/lib/types";

const DeleteTransaction = ({ TransactionId }: { TransactionId: string }) => {
  const queryClinet = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      await deleteTransactionAction(TransactionId);

      queryClinet.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClinet.setQueryData(
        ["transactions"],
        (oldData: {
          transactions: TransactionType[];
          totalTransactions: number;
        }) => {
          if (!oldData) return;

          return {
            transactions: oldData.transactions.filter(
              (transaction) => transaction.id !== TransactionId
            ),
            totalTransactions: oldData.totalTransactions - 1,
          };
        }
      );

      setOpen(false);
    } catch (err) {
      setError("Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Trash2Icon className="mr-3" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to delete this
          transaction?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="secondary">
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            variant="destructive"
            onClick={onSubmit}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransaction;
