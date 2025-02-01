"use client";
import React from "react";
import { jsPDF } from "jspdf";
import { TransactionType } from "@/lib/types";
import useSession from "@/app/useSession";
import generatePDF from "@/app/generatePdf";
import { FaWhatsapp } from "react-icons/fa";
import { Download, Mail } from "lucide-react";

interface ShareTransactionProps {
  transaction: TransactionType[];
}

const ShareTransaction = ({ transaction }: ShareTransactionProps) => {
  const user = useSession();

  if (!user) {
    return null;
  }

  const handleDownload = () => {
    generatePDF(transaction, user.name);
  };

  return (
    <div className="flex gap-6">
      <button aria-label="Share on WhatsApp">
        <FaWhatsapp className="size-[22px] text-muted-foreground hover:text-primary transition" />
      </button>
      <button aria-label="Send Email">
        <Mail className="size-[22px] text-muted-foreground hover:text-primary transition" />
      </button>
      <button onClick={handleDownload} aria-label="Download Report">
        <Download className="size-[22px] text-muted-foreground hover:text-primary transition" />
      </button>
    </div>
  );
};

export default ShareTransaction;
