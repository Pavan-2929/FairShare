import Image from "next/image";
import React from "react";
import avatar from "@/assets/avatar.png";
import UserButton from "./UserButton";
import ThemeToggler from "./ThemeToggler";

const Navbar = () => {
  return (
    <div className="hidden items-center justify-end border-b bg-card py-2 pe-16 shadow-sm md:flex">
      <ThemeToggler />
      <UserButton />
    </div>
  );
};

export default Navbar;
