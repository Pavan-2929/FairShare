"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import React from "react";
import { DeleteInvoice, sendInvoice } from "../actions";
import { redirect, useRouter } from "next/navigation";
import generateInvoicePDF from "@/utils/generateInvoicePDF";
import { InvoiceType } from "@/lib/types";
import useSession from "@/utils/useSession";

const InvoiceMore = ({ invoiceData }: { invoiceData: InvoiceType }) => {
  const router = useRouter();

  const { user } = useSession();

  if (!user) return redirect("sign-in");

  const handleDelete = async () => {
    try {
      await DeleteInvoice(invoiceData.id);
      router.refresh();
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  };

  const handleDownload = () => {
    const pdfBlob = generateInvoicePDF(invoiceData, user);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FairShare-Invoice-${invoiceData.id}`;
    link.click();
  };

  const handleEmail = async () => {
    const pdfBlob = generateInvoicePDF(invoiceData, user);
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    const base64Pdf = pdfBuffer.toString("base64");

    try {
      await sendInvoice(
        user.name,
        user.email,
        base64Pdf,
        invoiceData.clientName,
        invoiceData.clientEmail
      );
      alert("Report has been sent to your email!");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("There was an error sending the email. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="size-5 cursor-pointer text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>Downlaod</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>Email</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvoiceMore;
