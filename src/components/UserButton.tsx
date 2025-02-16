"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
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
import { BotIcon, LogOutIcon, Moon, Sun, UserIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import useSession from "@/utils/useSession";
import { redirect } from "next/navigation";
import { Skeleton } from "./ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

interface UserButtonProps {
  className?: string;
}

const UserButton = ({ className }: UserButtonProps) => {
  const { user, isPending } = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

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
        <DropdownMenuSeparator className="block md:hidden" />
        <Link href="/chatbot" className="block md:hidden">
          <DropdownMenuItem>
            <BotIcon className="mr-3 size-4" />
            Chatbot
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="block md:hidden" />

        <DropdownMenuItem
          className="inline-flex md:hidden"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <DropdownMenuSeparator className="block md:hidden" />
          {theme === "dark" ? (
            <>
              <Moon className="mr-3 size-4" />
              Dark
            </>
          ) : (
            <>
              <Sun className="mr-3 size-4" />
              Light
            </>
          )}
        </DropdownMenuItem>
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
