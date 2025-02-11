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
import { redirect, useRouter } from "next/navigation";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";

interface CreateGoalTransactionProps {
  goalId: string;
}

const CreateGoalTransaction = ({ goalId }: CreateGoalTransactionProps) => {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number>(100);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { width, height } = useWindowSize();

  const queryClient = useQueryClient();
  let result;

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

        if (updatedGoal.status === "completed") {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }

        router.refresh();
        setAmount(100);
        setIsOpen(false);
      } catch (error: unknown) {
        console.error(error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to create the goal.");
        }
      }
    });
  };
  return (
    <>
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />{" "}
        </div>
      )}{" "}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="size-4" />
            Add
            <span className="hidden sm:inline-flex">To Goal</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select amount to add into your goal</DialogTitle>
          </DialogHeader>
          {error && <p className="mb-3 text-red-500">{error}</p>}{" "}
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
    </>
  );
};

export default CreateGoalTransaction;
