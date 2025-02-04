import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";
import React from "react";

const Invoices = async () => {
  const user = await getUser();
  const InvoicesData = await prisma.invoice.findMany({
    where: {
      userId: user.id,
    },
  });

  return <div></div>;
};

export default Invoices;
