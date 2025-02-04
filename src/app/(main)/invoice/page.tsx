import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import Link from "next/link";
import InvoiceDisplay from "./Invoices";

const InvoicePage = () => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl">Invoices</h1>

        <div className="flex gap-5">
          <Link href="/invoice/create">
            <Button>
              <Plus className="mr-2 size-5 " />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>
      <InvoiceDisplay />
    </div>
  );
};

export default InvoicePage;
