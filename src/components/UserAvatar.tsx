import Image from "next/image";
import React from "react";
import avatarImage from "@/assets/avatar.png";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  size?: number;
  avatarUrl: string | null | undefined;
}

const UserAvatar = ({ className, size = 48, avatarUrl }: UserAvatarProps) => {
  return (
    <Image
      src={avatarUrl || avatarImage}
      width={size}
      height={size}
      alt="User avatar"
      className={cn("rounded-full object-cover border border-primary", className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};

export default UserAvatar;
