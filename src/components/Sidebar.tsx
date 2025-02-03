"use client";

import React from "react";
import { Home, User, Settings, LogOut, LucideLayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="sticky top-0 h-screen bg-card w-80 border-r-2 flex flex-col py-3 ">
      <Link
        href="/"
        className="flex items-center space-x-4 mb-5 pb-3 border-b-2 cursor-pointer px-5"
      >
        <Image
          src={logo}
          alt="Logo"
          className="w-10 object-cover h-10 rounded-full"
        />
        <h1 className="text-2xl text-primary font-bold">FairShare</h1>
      </Link>

      <nav className="flex-1 px-5">
        <ul className="space-y-4">
          <li>
            <Button
              variant="ghost"
              className={`w-full justify-start flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                isActive("/")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/")}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={`w-full justify-start flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                isActive("/profile")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/profile")}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={`w-full justify-start flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                isActive("/dashboard")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/dashboard")}
            >
              <LucideLayoutDashboard className="w-5 h-5" />
              <span>Dashboard</span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className={`w-full justify-start flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
                isActive("/settings")
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              onClick={() => router.push("/settings")}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start flex items-center space-x-2 px-4 py-2 rounded-md text-muted-foreground hover:bg-muted"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
