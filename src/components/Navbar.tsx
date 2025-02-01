import Image from "next/image";
import React from "react";
import avatar from "@/assets/avatar.png";
import UserButton from "./UserButton";

const Navbar = () => {
  return (
    <div className="border-b-2 shadow-sm bg-card py-2 flex justify-end pe-16">
      <div className="">
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
