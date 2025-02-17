"use client";

import React from "react";
import {
  Home,
  User,
  LogOut,
  LucideLayoutDashboard,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import lightLogo from "@/assets/lightLogo.png";
import darkLogo from "@/assets/darkLogo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaFileInvoice } from "react-icons/fa";
import useSession from "@/utils/useSession";
import { formatCurrency } from "@/utils/formatCurrency";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { user, isPending } = useSession();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    } else if (path !== "/") {
      return pathname.startsWith(path);
    }
  };

  return (
    <div className="sticky top-0 hidden h-screen flex-col border-r bg-card py-3 md:flex lg:w-80">
      <Link
        href="/"
        className="mb-5 flex cursor-pointer items-center space-x-4 border-b px-5 pb-3"
      >
        <div className="relative h-10 w-12 lg:ml-3 lg:w-14">
          <Image
            src={lightLogo}
            alt="Logo"
            className="absolute inset-0 hidden h-10 w-12 dark:block lg:w-14"
          />
          <Image
            src={darkLogo}
            alt="Logo"
            className="absolute inset-0 h-10 w-12 dark:hidden lg:w-14"
          />
        </div>

        <h1 className="hidden text-2xl font-bold text-primary lg:inline-block">
          FairShare
        </h1>
      </Link>

      <nav className="flex-1 px-5">
        <ul className="space-y-4">
          <li>
            <Button
              variant="ghost"
              className={`flex w-full items-center justify-start space-x-2 rounded-md px-4 py-2 transition-all duration-300 ${
                isActive("/")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/")}
            >
              <Home className="h-5 w-5" />
              <span className="hidden lg:inline-flex">Home</span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={`flex w-full items-center justify-start space-x-2 rounded-md px-4 py-2 transition-all duration-300 ${
                isActive("/invoice")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/invoice")}
            >
              <FaFileInvoice className="h-5 w-5" />
              <span className="hidden lg:inline-flex">Invoice</span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={`flex w-full items-center justify-start space-x-2 rounded-md px-4 py-2 transition-all duration-300 ${
                isActive("/profile")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/profile")}
            >
              <User className="h-5 w-5" />
              <span className="hidden lg:inline-flex">Profile</span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={`flex w-full items-center justify-start space-x-2 rounded-md px-4 py-2 transition-all duration-300 ${
                isActive("/dashboard")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/dashboard")}
            >
              <LucideLayoutDashboard className="h-5 w-5" />
              <span className="hidden lg:inline-flex">Dashboard</span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={`flex w-full items-center justify-start space-x-2 rounded-md px-4 py-2 transition-all duration-300 ${
                isActive("/goal")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/goals")}
            >
              <CreditCard className="h-5 w-5" />
              <span className="hidden lg:inline-flex">
                Goals{" "}
                <span className="pl-1">
                  {isPending
                    ? ""
                    : `(${formatCurrency(Number(user?.wallet)).slice(0, 10)})`}
                </span>
              </span>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
