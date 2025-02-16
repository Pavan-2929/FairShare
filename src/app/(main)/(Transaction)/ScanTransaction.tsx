"use client";

import { Button } from "@/components/ui/button";
import { CameraIcon } from "lucide-react";
import React, { useRef, useTransition } from "react";
import { scanReceipt } from "./actions";
import { TransactionValues } from "@/lib/validations";
import LoadingButton from "@/components/controls/LoadingButton";
import { useToast } from "@/hooks/use-toast";

interface ScanTransactionProps {
  onScanCompelete: (data: TransactionValues) => void;
}

const ScanTransaction = ({ onScanCompelete }: ScanTransactionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleReceiptScan = (file: File) => {
    startTransition(async () => {
      try {
        const data = await scanReceipt(file);
        console.log(data);
        if (!data || Object.keys(data).length === 0) {
          toast({
            variant: "destructive",
            title: "Warning",
            description:
              "No receipt found. Please make sure you are scanning a valid receipt.",
          });
          return;
        }
        onScanCompelete(data);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to scan the receipt. Please try again.",
          });
        }
      }
    });
  };
  return (
    <div className="pt-5">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <LoadingButton
        loading={isPending}
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        type="button"
        className="w-full bg-input/35"
      >
        <CameraIcon />
        Scan Recipt with AI
      </LoadingButton>
    </div>
  );
};

export default ScanTransaction;
