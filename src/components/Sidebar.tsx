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
import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaFileInvoice } from "react-icons/fa";
import useSession from "@/utils/useSession";

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
        className="mb-5 flex cursor-pointer items-center space-x-4 border-b-2 px-5 pb-3"
      >
        <Image
          src={logo}
          alt="Logo"
          className="h-10 w-10 rounded-full object-cover"
        />
        <h1 className="hidden text-2xl font-bold text-primary lg:inline-flex">
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
                isActive("/wallet")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/wallet")}
            >
              <CreditCard className="h-5 w-5" />
              <span className="hidden lg:inline-flex">
                Wallet{" "}
                <span className="pl-1">
                  {isPending ? "" : `(₹${user?.wallet})`}
                </span>
              </span>
            </Button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start space-x-2 rounded-md px-4 py-2 text-muted-foreground hover:bg-muted"
        >
          <LogOut className="h-5 w-5" />
          <span className="hidden lg:inline-flex">Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
