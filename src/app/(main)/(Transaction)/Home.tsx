import { Button } from "@/components/ui/button";
import { Download, Mail, Plus } from "lucide-react";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import AddTransaction from "./AddTransaction";
import ShareTransaction from "./ShareTransaction";
import prisma from "@/lib/prisma";
import { getUser } from "@/utils/getUser";
import Transactions from "./Transactions";

const Home = async () => {
  const user = await getUser();

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
  });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-2xl">Keep track of your budget</h1>

        <div className="flex gap-5">
          {transactions.length > 0 && (
            <ShareTransaction transactions={transactions} />
          )}
          <AddTransaction />
        </div>
      </div>
      <Transactions />
  
    </div>
  );
};

export default Home;
