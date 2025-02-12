"use client"; // Add this directive to make it a client component

import {
  CreditCardIcon,
  Files,
  Home,
  LucideLayoutDashboard,
  TargetIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import logoImage from "@/assets/logo.png";
import Image from "next/image";
import UserButton from "../UserButton";

const Menubar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    } else if (path !== "/") {
      return pathname.startsWith(path);
    }
  };
  return (
    <>
      <div className="z-50 w-full bg-background/75 md:hidden">
        <div className="flex h-16 items-center justify-between border-b px-5">
          <Link
            href="/"
            className="mb-5 flex cursor-pointer items-center space-x-4 pt-3"
          >
            <Image
              src={logoImage}
              alt="Logo"
              className="h-10 w-10 rounded-full object-cover"
            />
            <h1 className="text-2xl font-bold text-primary">FairShare</h1>
          </Link>
          <UserButton />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 z-50 w-full border-t-2 bg-background/75 backdrop-blur md:hidden">
        <div className="flex h-14 items-center justify-evenly px-5">
          <Link href="/" className="relative">
            <Home
              className={`size-5 transition-colors ${
                isActive("/") ? "text-primary" : "text-foreground"
              }`}
            />
            {isActive("/") && (
              <div className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>

          <Link href="/dashboard" className="relative">
            <LucideLayoutDashboard
              className={`size-5 transition-colors ${
                isActive("/dashboard") ? "text-primary" : "text-foreground"
              }`}
            />
            {isActive("/dashboard") && (
              <div className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>

          <Link href="/invoice" className="relative">
            <Files
              className={`size-5 transition-colors ${
                isActive("/invoice") ? "text-primary" : "text-foreground"
              }`}
            />
            {isActive("/invoice") && (
              <div className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>

          <Link href="/goals" className="relative">
            <CreditCardIcon
              className={`size-5 transition-colors ${
                isActive("/goal") ? "text-primary" : "text-foreground"
              }`}
            />
            {isActive("/goal") && (
              <div className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>

          <Link href="/profile" className="relative">
            <User
              className={`size-5 transition-colors ${
                isActive("/profile") ? "text-primary" : "text-foreground"
              }`}
            />
            {isActive("/profile") && (
              <div className="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Menubar;
