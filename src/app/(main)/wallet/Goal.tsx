import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoalType } from "@/lib/types";
import {
  AlertCircle,
  ArrowRight,
  BellIcon,
  CalendarIcon,
  FlagIcon,
  StarIcon,
  TargetIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

interface GoalProps {
  goalData: GoalType;
}

const Goal = ({ goalData }: GoalProps) => {
  const priorityIcons = {
    low: <FlagIcon className="size-5 text-primary" />,
    medium: <AlertCircle className="size-5 text-yellow-500" />,
    high: <AlertCircle className="size-5 text-destructive" />,
  };

  const progressValue = (goalData.currentAmount / goalData.targetAmount) * 100;

  return (
    <Card className="relative">
      {goalData.image && (
        <div
          className="absolute inset-0 opacity-20 blur-[2px] hover:opacity-35"
          style={{ backgroundImage: `url(${goalData.image})` }}
        />
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg">
            <TargetIcon className="size-5 text-primary" />
            <h2 className="font-semibold">{goalData.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="z-50">
                  {priorityIcons[goalData.priority]}
                </TooltipTrigger>
                <TooltipContent>
                  <p>Priority: {goalData.priority}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Badge className="px-3 py-1.5 capitalize" variant="outline">
              {goalData.status}
            </Badge>
          </div>
        </CardTitle>
        <CardDescription className="py-3">
          <p className="text-sm font-medium tracking-wide">
            {goalData.note || "No additional notes."}
          </p>
        </CardDescription>
        <CardContent className="sm:p-0 space-y-3">
          {/* Progress Section */}
          <div className="flex flex-col gap-1 pb-5">
            <div className="flex items-center justify-between">
              <span>Progress</span>
              <span>
                {goalData.currentAmount} / {goalData.targetAmount}
              </span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>

          {goalData.completionDate && (
            <div className="flex items-center gap-3">
              <CalendarIcon className="size-4 text-primary" />
              <p className="text-sm">
                {formatDistanceToNow(new Date(goalData.completionDate))}
              </p>
            </div>
          )}

          <div className="flex items-center gap-3">
            <BellIcon className="size-4 text-primary" />
            <p className="text-sm">Reminder: {goalData.reminder}</p>
          </div>

          <div className="flex items-center gap-3">
            <StarIcon className="size-4 text-primary" />
            <p className="text-sm">{goalData.category}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[13px] text-muted-foreground">
              {formatDistanceToNow(new Date(goalData.createdAt))}
            </p>
            <Button variant="outline" className="z-50 bg-transparent/35 hover:bg-transparent">
            <span>Explore</span>
            <ArrowRight className="ml-2 size-4"/>
            </Button>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default Goal;
