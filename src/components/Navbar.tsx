import React from "react";
import UserButton from "./UserButton";
import ThemeToggler from "./ThemeToggler";
import Link from "next/link";
import { BotIcon } from "lucide-react";

const Navbar = () => {
  return (
    <div className="hidden items-center justify-end border-b bg-card py-2 pe-7 shadow-sm md:flex lg:pe-16">
      <ThemeToggler />
      <Link href="/chatbot">
        <BotIcon className="size-7 mx-8 text-muted-foreground" />
      </Link>
      <UserButton />
    </div>
  );
};

export default Navbar;
