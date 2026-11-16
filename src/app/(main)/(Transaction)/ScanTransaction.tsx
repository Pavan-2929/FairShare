"use client";

import { CameraIcon } from "lucide-react";
import React, { useRef, useTransition } from "react";
import { scanReceipt } from "./actions";
import { TransactionValues } from "@/lib/validations";
import LoadingButton from "@/components/controls/LoadingButton";
import { useToast } from "@/hooks/use-toast";

interface ScanTransactionProps {
  onScanCompelete: (data: TransactionValues) => void;
}

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;

  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const maxWidth = 1024;
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(img.src);
          if (!blob) return resolve(file);
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.75,
      );
    };
    img.onerror = () => resolve(file);
  });
}

const ScanTransaction = ({ onScanCompelete }: ScanTransactionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleReceiptScan = (file: File) => {
    startTransition(async () => {
      try {
        const compressedFile = await compressImage(file);
        const data = await scanReceipt(compressedFile);
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
          e.target.value = "";
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
        Scan Receipt with AI
      </LoadingButton>
    </div>
  );
};

export default ScanTransaction;
