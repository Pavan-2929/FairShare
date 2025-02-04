"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import React from "react";
import { DeleteInvoice } from "../actions";
import { useRouter } from "next/navigation";

const InvoiceMore = ({ invoiceId }: { invoiceId: string }) => {
  console.log(invoiceId);

  const router = useRouter();

  const handleDelete = async () => {
    try {
      await DeleteInvoice(invoiceId);
      router.refresh();
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="size-5 cursor-pointer text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        <DropdownMenuItem>Downlaod</DropdownMenuItem>
        <DropdownMenuItem>Email</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvoiceMore;
