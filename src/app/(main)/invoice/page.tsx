import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import Link from "next/link";
import InvoiceDisplay from "./Invoices";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice",
};

const InvoicePage = () => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>

        <div className="flex gap-5">
          <Link href="/invoice/create">
            <Button>
              <Plus className="mr-1 size-5 sm:mr-2" />
              Create
              <span className="hidden sm:inline">Invoice</span>
            </Button>
          </Link>
        </div>
      </div>
      <InvoiceDisplay />
    </div>
  );
};

export default InvoicePage;
