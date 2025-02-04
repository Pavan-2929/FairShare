import { Input } from "@/components/ui/input";
import UserAvatar from "@/components/UserAvatar";
import { getUser } from "@/utils/getUser";
import React from "react";
import UserDetails from "./UserDetails";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/controls/FormInput";
import { Mail } from "lucide-react";
import UserOtherDetails from "./UserOtherDetails";
import UserImage from "./UserImage";
import UserData from "./UserData";

const ProfilePage = async () => {
  const user = await getUser();

  return (
    <div className="flex items-start justify-between gap-7">
      <div className="border border-border bg-card flex-1 w-[680px] p-5 rounded-md shadow-sm space-y-5">
        <UserImage />
        <div className="pl-5">
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
