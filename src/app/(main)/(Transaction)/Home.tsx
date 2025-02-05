import React, { Suspense } from "react";
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
      <div className="flex flex-col items-start justify-start gap-5 md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-bold md:text-2xl">
          Keep track of your budget
        </h1>

        <div className="flex w-full justify-between gap-5 md:w-fit">
          {transactions.length > 0 && (
            <ShareTransaction transactions={transactions} />
          )}
          <div className="ml-auto flex">
            <AddTransaction />
          </div>
        </div>
      </div>
      <Transactions />
    </div>
  );
};

export default Home;
