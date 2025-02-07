"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, Loader2, Mail, MoreVertical } from "lucide-react";
import React, { useTransition } from "react";
import { sendInvoice } from "./actions";
import { redirect } from "next/navigation";
import generateInvoicePDF from "@/utils/generateInvoicePDF";
import { InvoiceType } from "@/lib/types";
import useSession from "@/utils/useSession";
import { useToast } from "@/hooks/use-toast";
import DeleteInvoice from "./DeleteInvoice";

const InvoiceMore = ({ invoiceData }: { invoiceData: InvoiceType }) => {
  const [isPending, startTransition] = useTransition();

  const { user } = useSession();
  const { toast } = useToast();

  if (!user) return redirect("sign-in");

  const handleDownload = () => {
    const pdfBlob = generateInvoicePDF(invoiceData, user);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FairShare-Invoice-${invoiceData.id}`;
    link.click();
    toast({
      title: "Invoice downloaded",
      description: "Invoice has been downloaded!",
    });
  };

  const handleEmail = async () => {
    const pdfBlob = generateInvoicePDF(invoiceData, user);
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    const base64Pdf = pdfBuffer.toString("base64");

    try {
      startTransition(async () => {
        await sendInvoice(
          user.name,
          user.email,
          base64Pdf,
          invoiceData.clientName,
          invoiceData.clientEmail,
        );
        toast({
          title: "Invoice sent",
          description: "Invoice has been sent to your email!",
        });
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("There was an error sending the email. Please try again.");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isPending ? (
          <Loader2 className="size-5 animate-spin cursor-wait text-muted-foreground" />
        ) : (
          <MoreVertical className="size-5 cursor-pointer text-muted-foreground" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="space-y-2">
        <DropdownMenuItem asChild>
          <DeleteInvoice invoiceData={invoiceData} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload}>
          <Download className="mr-3" />
          Downlaod
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail}>
          <Mail className="mr-3" />
          Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default InvoiceMore;
