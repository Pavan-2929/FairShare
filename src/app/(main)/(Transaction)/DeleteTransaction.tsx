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
import { TransactionType } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type oldDataType = {
  transactions: TransactionType[];
  totalTransactions: number;
};

const DeleteTransaction = ({ TransactionId }: { TransactionId: string }) => {
  const queryClinet = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const onSubmit = async () => {
    setLoading(true);

    try {
      await deleteTransactionAction(TransactionId);

      queryClinet.invalidateQueries({
        queryKey: ["transactions"],
      });

      queryClinet.setQueryData(["transactions"], (oldData: oldDataType) => {
        if (!oldData) return;

        return {
          transactions: oldData.transactions.filter(
            (transaction) => transaction.id !== TransactionId,
          ),
          totalTransactions: oldData.totalTransactions - 1,
        };
      });
      toast({
        title: "Success",
        description: "The selected transaction has been deleted.",
      });

      setOpen(false);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete transaction. Please try again.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full p-4 flex justify-start">
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
