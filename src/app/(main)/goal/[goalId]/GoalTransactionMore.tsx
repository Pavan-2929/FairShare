"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArchiveRestore,
  CrossIcon,
  MoreHorizontal,
  Trash2Icon,
} from "lucide-react";
import React, { useTransition } from "react";
import {
  changeStatusToActive,
  changeStatusToCancelled,
  deleteGoal,
} from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/controls/LoadingButton";
import { useRouter } from "next/navigation";
import { GoalTransactionType, GoalType } from "@/lib/types";

interface GoalTransactionMoreProps {
  goalData: GoalType;
}

const GoalTransactionMore = ({ goalData }: GoalTransactionMoreProps) => {
  const [isTerminatePending, startTerminateTransiction] = useTransition();
  const [isDeletePending, startDeleteTransiction] = useTransition();
  const [isActivePending, startActiveTransiction] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleTerminateGoal = () => {
    startTerminateTransiction(async () => {
      try {
        await changeStatusToCancelled(goalData.id);
        toast({
          title: "Goal terminated",
          description: "The goal has been successfully terminated.",
        });
        router.push("/goals");
      } catch (error) {
        console.error("Failed to terminate goal:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to terminate goal. Please try again later.",
        });
      }
    });
  };

  const handleDeleteGoal = () => {
    startDeleteTransiction(async () => {
      try {
        await deleteGoal(goalData.id);
        toast({
          title: "Goal deleted",
          description: "The goal has been successfully deleted.",
        });
        router.push("/goals");
      } catch (error) {
        console.error("Failed to delete goal:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete goal. Please try again later.",
        });
      }
    });
  };

  const handleActiveGoal = () => {
    startActiveTransiction(async () => {
      try {
        await changeStatusToActive(goalData.id);
        toast({
          title: "Goal activated",
          description: "The goal has been successfully activated.",
        });
        router.refresh();
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to activate goal. Please try again later.",
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2">
        {goalData.status === "active" && (
          <DropdownMenuItem onClick={handleTerminateGoal}>
            <LoadingButton
              loading={isTerminatePending}
              variant="ghost"
              className="h-7 space-x-2 px-0"
            >
              <CrossIcon className="size-4 text-yellow-500" />
              <span>Terminate</span>
            </LoadingButton>
          </DropdownMenuItem>
        )}
        {goalData.status === "cancelled" && (
          <DropdownMenuItem onClick={handleActiveGoal}>
            <LoadingButton
              loading={isTerminatePending}
              variant="ghost"
              className="h-7 space-x-2 px-0"
            >
              <ArchiveRestore className="size-4 text-primary" />
              <span>Restore</span>
            </LoadingButton>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="space-x-2">
          <LoadingButton
            onClick={handleDeleteGoal}
            loading={isDeletePending}
            variant="ghost"
            className="h-7 space-x-2 px-0"
          >
            <Trash2Icon className="size-4 text-destructive" />
            <span>Delete</span>
          </LoadingButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GoalTransactionMore;
