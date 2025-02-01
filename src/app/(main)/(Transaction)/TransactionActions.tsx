"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import DeleteTransaction from "./DeleteTransaction";
import { TransactionType } from "@/lib/types";
import UpdateTransaction from "./UpdateTransaction";

interface TransactionActionsProps {
  transaction: TransactionType;
}

const TransactionActions = ({ transaction }: TransactionActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal className="size-5 cursor-pointer text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteTransaction TransactionId={transaction.id} />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <UpdateTransaction transactionData={transaction} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionActions;
