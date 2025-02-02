"use client";

import React from "react";
import { TransactionType } from "@/lib/types";
import useSession from "@/utils/useSession";
import generatePDF from "@/utils/generatePDF";
import { FaWhatsapp } from "react-icons/fa";
import { Download, Mail } from "lucide-react";
import { sendTransaction } from "./actions";

interface ShareTransactionProps {
  transactions: TransactionType[];
}

const ShareTransaction = ({ transactions }: ShareTransactionProps) => {
  const { user } = useSession();

  if (!user) return null;

  const handleDownload = () => {
    const pdfBlob = generatePDF(transactions, user.name);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `FairShare-Transactions-${user.name}`;
    link.click();
  };

  const handleWhatsApp = () => {
    const pdfBlob = generatePDF(transactions, user.name);
    const url = URL.createObjectURL(pdfBlob);
    window.open(
      `https://wa.me/?text=Download your transaction report here: ${url}`,
      "_blank"
    );
  };

  const handleEmail = async () => {
    const pdfBlob = generatePDF(transactions, user.name);
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    const base64Pdf = pdfBuffer.toString("base64");

    try {
      await sendTransaction(user.name, user.email, base64Pdf);
      alert("Report has been sent to your email!");
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("There was an error sending the email. Please try again.");
    }
  };

  return (
    <div className="flex gap-6">
      <button onClick={handleWhatsApp} aria-label="Share on WhatsApp">
        <FaWhatsapp className="size-[22px] text-muted-foreground hover:text-primary transition" />
      </button>
      <button onClick={handleEmail} aria-label="Send Email">
        <Mail className="size-[22px] text-muted-foreground hover:text-primary transition" />
      </button>
      <button onClick={handleDownload} aria-label="Download Report">
        <Download className="size-[22px] text-muted-foreground hover:text-primary transition" />
      </button>
    </div>
  );
};

export default ShareTransaction;
