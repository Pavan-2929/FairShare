import Image from "next/image";
import React from "react";
import avatarImage from "@/assets/avatar.png";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  size?: number;
  avatarUrl: string | null | undefined;
}

const UserAvatar = ({ className, size, avatarUrl }: UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || avatarImage}
      width={size || 48}
      height={size || 48}
      alt="User avatar"
      className={cn("h-fit rounded-full object-cover", className)}
    />
  );
};

export default UserAvatar;
