import React from "react";
import { Skeleton } from "../ui/skeleton";

const DashboardLoader = () => {
  return (
    <>
      <div className="flex flex-wrap gap-5 pt-7">
        <div className="w-full min-w-[300px] flex-1 rounded-xl border border-accent-foreground/10 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg border border-accent-foreground/10 p-3">
              <Skeleton className="h-6 w-6 bg-muted/50" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-[120px] bg-muted/50" />
              <Skeleton className="h-8 w-[80px] bg-muted/50" />
            </div>
          </div>
          <Skeleton className="h-3 w-[160px] bg-muted/50" />
        </div>
        <div className="w-full min-w-[230px] flex-1 rounded-xl border border-accent-foreground/10 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg border border-accent-foreground/10 p-3">
              <Skeleton className="h-6 w-6 bg-muted/50" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-[120px] bg-muted/50" />
              <Skeleton className="h-8 w-[80px] bg-muted/50" />
            </div>
          </div>
          <Skeleton className="h-3 w-[160px] bg-muted/50" />
        </div>
        <div className="w-full min-w-[230px] flex-1 rounded-xl border border-accent-foreground/10 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg border border-accent-foreground/10 p-3">
              <Skeleton className="h-6 w-6 bg-muted/50" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-[120px] bg-muted/50" />
              <Skeleton className="h-8 w-[80px] bg-muted/50" />
            </div>
          </div>
          <Skeleton className="h-3 w-[160px] bg-muted/50" />
        </div>
        <div className="w-full min-w-[230px] flex-1 rounded-xl border border-accent-foreground/10 p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg border border-accent-foreground/10 p-3">
              <Skeleton className="h-6 w-6 bg-muted/50" />
            </div>
            <div>
              <Skeleton className="mb-2 h-4 w-[120px] bg-muted/50" />
              <Skeleton className="h-8 w-[80px] bg-muted/50" />
            </div>
          </div>
          <Skeleton className="h-3 w-[160px] bg-muted/50" />
        </div>
      </div>
    </>
  );
};

export default DashboardLoader;
