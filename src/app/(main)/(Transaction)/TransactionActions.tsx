"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash2Icon } from "lucide-react";
import DeleteTransaction from "./DeleteTransaction";
import { TransactionType } from "@/lib/types";
import UpdateTransaction from "./UpdateTransaction";
const TransactionActions = ({
  Transaction,
}: {
  Transaction: TransactionType;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreHorizontal className="size-5 cursor-pointer text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <DeleteTransaction TransactionId={Transaction.id} />
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <UpdateTransaction
            transactionData={Transaction}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TransactionActions;
