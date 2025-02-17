import { getUser } from "@/utils/getUser";
import React from "react";
import UserDetails from "./UserDetails";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/controls/FormInput";
import { Mail } from "lucide-react";
import UserOtherDetails from "./UserOtherDetails";
import UserImage from "./UserImage";
import UserData from "./UserData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile"
}

const ProfilePage = async () => {
  const user = await getUser();

  return (
    <div className="md:flex-r flex max-w-[100vw] flex-col justify-between gap-7 lg:flex-row lg:items-start">
      <div className="flex-1 space-y-5 rounded-md border border-border bg-card shadow-sm lg:w-[680px] lg:p-5">
        <UserImage />
        <div className="px-5 lg:pl-5">
          <Label>Email</Label>
          <FormInput
            icon={<Mail className="size-5 text-primary" />}
            className="border"
            value={user.email}
            disabled
          />
        </div>
        <div>
          <UserDetails />
        </div>
      </div>
      <div className="space-y-7">
        <UserOtherDetails />
        <UserData />
      </div>
    </div>
  );
};

export default ProfilePage;
