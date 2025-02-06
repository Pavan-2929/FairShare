import React from "react";
import UserButton from "./UserButton";
import ThemeToggler from "./ThemeToggler";

const Navbar = () => {
  return (
    <div className="hidden items-center justify-end border-b bg-card py-2 lg:pe-16 pe-7 shadow-sm md:flex">
      <ThemeToggler />
      <UserButton />
    </div>
  );
};

export default Navbar;
