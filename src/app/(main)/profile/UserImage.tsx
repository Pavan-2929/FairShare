"use client";

import useSession from "@/utils/useSession";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useRef, useState } from "react";
import UserAvatar from "@/assets/avatar.png";
import kyInstance from "@/lib/ky";
import { authClient } from "@/lib/auth-client";

interface CloudinaryResponse {
  secure_url: string;
}

const UserImage = () => {
  const { user } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!user) redirect("/sign-in");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "fairshare");

    setIsUploading(true);

    try {
      const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL as string;
      const response = await kyInstance.post(uploadUrl, { body: formData });

      if (response.ok) {
        const data: CloudinaryResponse = await response.json();
        setImageUrl(data?.secure_url);
        authClient.updateUser({
          image: data?.secure_url,
          name: user.name,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="hidden"
        disabled={isUploading}
      />
      <div className="group relative mx-auto w-fit">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="relative block rounded-full transition-all duration-300 hover:ring-4 hover:ring-blue-200 focus:ring-4 focus:ring-blue-300"
          aria-label="Change profile picture"
        >
          <div className="relative">
            <Image
              src={imageUrl || user.image || UserAvatar}
              alt="Avatar"
              width={150}
              height={150}
              className={`h-32 w-32 rounded-full border-2 border-primary object-cover shadow-lg transition-opacity duration-300 ${
                isUploading ? "opacity-50" : "opacity-100"
              }`}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Camera className="mb-1 h-6 w-6 transform text-white transition-transform group-hover:scale-110" />
              <span className="px-2 text-center text-xs font-medium text-white">
                Change Photo
              </span>
            </div>

            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full border border-muted-foreground bg-black/40 backdrop-blur-sm">
                <Loader2 className="size-12 animate-spin text-primary" />
              </div>
            )}
          </div>
        </button>
      </div>
    </>
  );
};

export default UserImage;
