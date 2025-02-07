"use client";

import React, { useTransition } from "react";
import { TransactionType } from "@/lib/types";
import useSession from "@/utils/useSession";
import generatePDF from "@/utils/generatePDF";
import { Download, Loader2, Mail } from "lucide-react";
import { sendTransaction } from "./actions";
import { useToast } from "@/hooks/use-toast";

interface ShareTransactionProps {
  transactions: TransactionType[];
}

const ShareTransaction = ({ transactions }: ShareTransactionProps) => {
  const { user } = useSession();

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  if (!user) return null;

  const handleDownload = () => {
    const pdfBlob = generatePDF(transactions, user.name);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FairShare-Transactions-${user.name}`;
    link.click();
  };

  const handleEmail = async () => {
    const pdfBlob = generatePDF(transactions, user.name);
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    const base64Pdf = pdfBuffer.toString("base64");

    try {
      startTransition(async () => {
        await sendTransaction(user.name, user.email, base64Pdf);
      });
      toast({
        title: "Email sent",
        description: "Transaction report has been sent!",
      });
    } catch (error) {
      console.error("Failed to send email:", error);
      toast({
        variant: "destructive",
        title: "Failed to send email",
        description: "There was an error sending the email. Please try again.",
      });
    }
  };

  return (
    <div className="flex gap-6">
      <button onClick={handleEmail} aria-label="Send Email">
        {isPending ? (
          <Loader2 className="size-[22px] animate-spin text-muted-foreground" />
        ) : (
          <Mail className="size-[22px] text-muted-foreground transition hover:text-primary" />
        )}
      </button>
      <button onClick={handleDownload} aria-label="Download Report">
        <Download className="size-[22px] text-muted-foreground transition hover:text-primary" />
      </button>
    </div>
  );
};

export default ShareTransaction;
