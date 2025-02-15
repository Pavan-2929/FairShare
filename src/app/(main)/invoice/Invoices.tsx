import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";
import { FileText } from "lucide-react";
import React from "react";
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
      <div className="flex flex-col items-center gap-4 pt-24 text-muted-foreground">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-xl font-semibold text-muted-foreground">
          Looks like you haven&apos;t added any invoices yet.
        </p>
        <p className="text-center text-gray-500">
          To get started, you can add your first invoice and start tracking your
          income and expenses.
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
