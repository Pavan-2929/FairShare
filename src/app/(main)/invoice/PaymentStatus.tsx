"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceType } from "@/lib/types";
import React, { useState } from "react";
import { UpdateInvoice } from "./actions";

interface PaymentStatusProps {
  invoiceData: InvoiceType;
}

const PaymentStatus = ({ invoiceData }: PaymentStatusProps) => {
  const [status, setStatus] = useState<
    "pending" | "paid" | "overdue" | "cancelled"
  >(invoiceData.status);

  const handleChange = async (
    value: "pending" | "paid" | "overdue" | "cancelled",
  ) => {
    setStatus(value);
    await UpdateInvoice({ status: value, invoiceId: invoiceData.id });
  };

  return (
    <Select
      value={status}
      onValueChange={(val: "pending" | "paid" | "overdue" | "cancelled") =>
        handleChange(val)
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Select an Invoice Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="overdue">Overdue</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default PaymentStatus;
