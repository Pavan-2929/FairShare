import React from "react";
import AddTransaction from "./AddTransaction";
import Transactions from "./Transactions";

const Home = async () => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-5 md:flex-row">
        <h1 className="hidden text-xl font-bold md:inline-flex md:text-2xl">
          Keep track of your budget
        </h1>
        <h1 className="inline-flex text-xl font-bold md:hidden md:text-2xl">
          Transactions
        </h1>

        <div className="flex w-full justify-between gap-5 md:w-fit">
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
