"use client";

import { FormInput } from "@/components/controls/FormInput";
import LoadingButton from "@/components/controls/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreditCardIcon, Plus } from "lucide-react";
import React, { useState, useTransition } from "react";
import {
  addGoalTransaction,
  updateGoalCurrentValue,
  updateUserWalletFromGoalsTransaction,
} from "./actions";
import { useQueryClient } from "@tanstack/react-query";
import { GoalTransactionType, GoalType } from "@/lib/types";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface CreateGoalTransactionProps {
  goalId: string;
}

const CreateGoalTransaction = ({ goalId }: CreateGoalTransactionProps) => {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(1000);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const queryClient = useQueryClient();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!amount) return;
    startTransition(async () => {
      try {
        const [newGoalTransaction, updatedUser, updatedGoal] =
          await Promise.all([
            addGoalTransaction({ amount, goalId }),
            updateUserWalletFromGoalsTransaction(amount),
            updateGoalCurrentValue({ amount, goalId }),
          ]);

        queryClient.invalidateQueries({
          queryKey: ["goals"],
        });

        queryClient.setQueryData(
          ["goals"],
          (oldData: GoalType[] | undefined) => {
            if (!oldData) return [];

            return oldData.map((goal) => {
              if (goal.id === goalId) {
                return { ...goal, currentAmount: updatedGoal.currentAmount };
              }
              return goal;
            });
          },
        );

        authClient.updateUser({
          name: updatedUser.name,
          image: updatedUser.image,
        });

        queryClient.invalidateQueries({
          queryKey: ["goalTransactions", goalId],
        });

        queryClient.setQueryData(
          ["goalTransactions", goalId],
          (oldData: GoalTransactionType[]) => {
            return oldData
              ? [newGoalTransaction, ...oldData]
              : [newGoalTransaction];
          },
        );
        router.refresh();
        setIsOpen(false);
      } catch (error) {
        console.error(error);
        setError("Failed to create the goal. Please check your input.");
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add To Goal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select amount to add into your goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FormInput
            icon={<CreditCardIcon className="size-4 text-primary" />}
            type="number"
            value={amount === 0 ? "" : amount}
            placeholder="Enter amount"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <DialogFooter className="flex gap-3 pt-7">
            <Button variant="outline">Cancel</Button>
            <LoadingButton loading={isPending}>Add</LoadingButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGoalTransaction;
