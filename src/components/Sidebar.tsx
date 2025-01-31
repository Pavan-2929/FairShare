import React from "react";
import { Home, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="h-screen bg-card w-80 border-r-2 flex flex-col py-3">
      <div className="flex items-center space-x-4 mb-5 pb-3 border-b-2 px-7 ">
        <Image
          src={logo}
          alt="Logo"
          className="w-10 object-cover h-10 rounded-full"
        />
        <h1 className="text-2xl text-primary font-bold">FairShare</h1>
      </div>

      <nav className="flex-1 px-5 ">
        <ul className="space-y-3">
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start flex items-center text-muted-foreground space-x-2 hover:bg-muted"
            >
              <Home className="w-5 h-5" />
              <span className="text-muted-foreground">
                Dashboard
              </span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start flex items-center text-muted-foreground space-x-2 hover:bg-muted"
            >
              <User className="w-5 h-5 " />
              <span className=" text-muted-foreground">Profile</span>
            </Button>
          </li>
          <li>
            <Button
              variant="ghost"
              className="w-full justify-start flex items-center text-muted-foreground space-x-2 hover:bg-muted"
            >
              <Settings className="w-5 h-5" />
              <span className="text-muted-foreground">
                Settings
              </span>
            </Button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start flex items-center space-x-2 hover:bg-card"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
