import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";
import { FileText } from "lucide-react";
import React from "react";
import { InvoiceType } from "@/lib/types";
import Invoice from "./Invoice";

const Invoices = async () => {
  const user = await getUser();
  const InvoicesData = await prisma.invoice.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      products: true,
    },
  });

  if (!InvoicesData || !InvoicesData.length) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-4 mt-24">
        <FileText className="w-16 h-16 text-muted-foreground" />
        <p className="font-semibold text-xl text-muted-foreground">
          Looks like you haven't added any transactions yet.
        </p>
        <p className="text-center text-gray-500">
          To get started, you can add your first transaction and start tracking
          your income and expenses.
          <br />
          It only takes a few moments!
        </p>
      </div>
    );
  }

  return (
    <>
      {InvoicesData.map((invoiceData) => (
        <div key={invoiceData.id}>
          <Invoice invoiceData={invoiceData} />
        </div>
      ))}
    </>
  );
};

export default Invoices;
