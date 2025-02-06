"use client";

import { cn } from "@/lib/utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { LogOutIcon, UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import useSession from "@/utils/useSession";
import { redirect } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface UserButtonProps {
  className?: string;
}

const UserButton = ({ className }: UserButtonProps) => {
  const { user, isPending } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  if (!user || isPending) {
    return <Skeleton className="h-12 w-12 rounded-full" />;
  }

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast({
            title: "Logged Out",
            description: "You have been logged out successfully",
          });
          redirect("/sign-in");
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Something went wrong",
          });
        },
      },
    });
    queryClient.clear();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("rounded-full", className)}>
          <UserAvatar avatarUrl={user.image} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Logged in as @{user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={`/profile`}>
          <DropdownMenuItem>
            <UserIcon className="mr-3 size-4" />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon className="mr-3 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
