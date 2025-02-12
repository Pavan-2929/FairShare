"use client";

import prisma from "@/lib/prisma";
import React from "react";
import Goal from "./Goal";
import GoalLoader from "@/components/skeletonLoaders/GoalLoader";
import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { GoalType } from "@/lib/types";

const Goals = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => kyInstance.get("/api/goals/get").json<GoalType[]>(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        <GoalLoader />
        <GoalLoader />
        <GoalLoader />
        <GoalLoader />
      </div>
    );
  }

  if (!data || !data.length) {
    return (
      <div className="flex flex-col items-center gap-4 pt-24 text-muted-foreground">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-xl font-semibold text-muted-foreground">
          Looks like you haven&apos;t added any goals yet.
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
    <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
      {data.map((goal) => (
        <Goal key={goal.id} goalData={goal} />
      ))}
    </div>
  );
};

export default Goals;
