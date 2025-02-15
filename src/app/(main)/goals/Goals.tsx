"use client";

import prisma from "@/lib/prisma";
import React, { useState } from "react";
import Goal from "./Goal";
import GoalLoader from "@/components/skeletonLoaders/GoalLoader";
import { FileText, SearchIcon, TimerResetIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import { GoalType } from "@/lib/types";
import { FormInput } from "@/components/controls/FormInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Goals = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => kyInstance.get("/api/goals/get").json<GoalType[]>(),
  });

  const handleSearchFilter = () => {
    let filteredGoals = data || [];

    if (statusFilter) {
      filteredGoals = filteredGoals.filter(
        (goal) => goal.status === statusFilter,
      );
    }

    if (priorityFilter) {
      filteredGoals = filteredGoals.filter(
        (goal) => goal.priority === priorityFilter,
      );
    }

    if (searchQuery) {
      filteredGoals = filteredGoals.filter((goal) =>
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filteredGoals;
  };

  const filteredGoals = handleSearchFilter();

  const resetFilters = () => {
    setStatusFilter("");
    setPriorityFilter("");
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <div className="space-y-7">
        <div className="flex items-center justify-between gap-5">
          <Skeleton className="h-9 w-32 md:w-80" />
          <div className="flex items-center gap-1 sm:gap-5">
            <Skeleton className="h-9 w-16 md:w-48" />
            <Skeleton className="h-9 w-12 md:w-24" />
          </div>
        </div>{" "}
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          <GoalLoader />
          <GoalLoader />
          <GoalLoader />
          <GoalLoader />
        </div>
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
    <div className="space-y-7">
      <div className="flex items-center justify-between gap-5">
        <FormInput
          icon={<SearchIcon className="size-4 text-muted-foreground" />}
          className="h-9 min-w-full"
          defaultValue={searchQuery}
          placeholder={window.innerWidth < 768 ? "Title" : "Enter Title..."}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex items-center sm:gap-5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="space-x-2">
              <SelectValue
                placeholder={
                  window.innerWidth < 768 ? "Status" : "Filter by Status"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="space-x-2">
              <SelectValue
                placeholder={
                  window.innerWidth < 768 ? "Priority" : "Filter by Priority"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
          <Button className="ml-2" variant="outline" onClick={resetFilters}>
            <span className="hidden sm:inline-flex">Reset</span>{" "}
            <TimerResetIcon />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
        {filteredGoals.length > 0 ? (
          (filteredGoals ? filteredGoals : data).map((goal) => (
            <Goal key={goal.id} goalData={goal} />
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center gap-4 pt-24 text-muted-foreground">
            <FileText className="h-16 w-16 text-muted-foreground" />
            <p className="text-xl font-semibold text-muted-foreground">
              No goals found for the selected filters.
            </p>
            <p className="text-center text-gray-500">
              Try adjusting your filters or resetting them to see all goals.
              <br />
              If you haven&apos;t added any goals yet, start by creating one to track
              your progress.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
