import { Button } from "@/components/ui/button";
import { Download, Mail, Plus } from "lucide-react";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import AddTransaction from "./AddTransaction";
import ShareTransaction from "./ShareTransaction";
import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";

const PersonalBudget = async () => {
  const user = await getUser();

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { TransactionDate: "desc" },
  });

  return (
    <div className="flex items-center justify-between">
      <h1 className="font-bold text-2xl">Keep track of your budget</h1>

      <div className="flex gap-5">
        <ShareTransaction transactions={transactions} />
        <AddTransaction />
      </div>
    </div>
  );
};

export default PersonalBudget;
