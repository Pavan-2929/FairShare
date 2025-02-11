import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  BellIcon,
  CalendarIcon,
  FlagIcon,
  MoreHorizontal,
  StarIcon,
} from "lucide-react";
import React from "react";
import CreateGoalTransaction from "./CreateGoalTransaction";
import GoalTransactions from "./GoalTransactions";

type Params = Promise<{ goalId: string }>;

interface GoalPageProps {
  params: Params;
}
const GoalPage = async ({ params }: GoalPageProps) => {
  const resolvedParams = await params;
  const goaldId = resolvedParams.goalId;

  const goalData = await prisma.goal.findFirst({
    where: {
      id: goaldId,
    },
  });

  if (!goalData) {
    return <h1>Goal not found.</h1>;
  }

  const progressValue = (goalData.currentAmount / goalData.targetAmount) * 100;

  const priorityIcons = {
    low: <FlagIcon className="size-5 text-primary" />,
    medium: <AlertCircle className="size-5 text-yellow-500" />,
    high: <AlertCircle className="size-5 text-destructive" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{goalData.title}</h1>
            <span className="pt-0.5 text-muted-foreground">
              (₹{goalData.targetAmount})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="px-3 py-1.5" variant="outline">
              {goalData.status}
            </Badge>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardDescription className="grid grid-cols-1 gap-11 p-3 text-[15px] font-semibold leading-8 tracking-wider sm:p-6 md:grid-cols-2">
        <div>
          <img
            src={goalData.image}
            alt="image"
            className="max-h-60 w-full rounded-sm object-cover"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col pb-5">
            <div className="flex items-center justify-between pb-0.5">
              <span>Progress</span>
              <span>
                ₹{goalData.currentAmount} / {goalData.targetAmount}
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                {priorityIcons[goalData.priority]}
                <p>{goalData.priority}</p>
              </div>
              <div className="flex items-center gap-3">
                <CalendarIcon className="size-5 text-base text-primary" />
                <p>
                  {formatDistanceToNow(new Date(goalData.completionDate), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <BellIcon className="size-5 text-base text-primary" />
                <p>Reminder: {goalData.reminder}</p>
              </div>
              <div className="flex items-center gap-3">
                <StarIcon className="size-5 text-base text-primary" />
                <p>{goalData.category}</p>
              </div>
            </div>
          </div>
          <div className="flex pt-5 text-sm font-normal">
            <h2 className="font-semibold">Note:- </h2>
            <span>{goalData.note}</span>
          </div>
        </div>
      </CardDescription>
      <Separator className="px-3 sm:px-6" />
      <CardContent>
        <div className="grid gap-11 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                <h1>Your Goal's Transactions</h1>
              </div>
              <CreateGoalTransaction goalId={goalData.id} />
            </div>
            <GoalTransactions goalId={goalData.id} />
          </div>
          <div>Other content</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalPage;
