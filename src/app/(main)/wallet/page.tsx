import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUser } from "@/utils/getUser";
import { Plus } from "lucide-react";
import React from "react";
import CreateGoal from "./CreateGoal";

const WalletPage = async () => {
  const user = await getUser();
  return (
    <div className="flex items-center justify-between">
      <div className="text-2xl font-bold">
        <h1>Keep Track on your Goals</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">₹{user.wallet}</Button>
        <CreateGoal />
      </div>
    </div>
  );
};

export default WalletPage;
