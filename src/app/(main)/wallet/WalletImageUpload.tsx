"use client";

import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import useSession from "@/utils/useSession";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { useRef, useState } from "react";
import { Control } from "react-hook-form";
import Placeholder from "@/assets/Placeholder.png";
import { CameraIcon, Loader2 } from "lucide-react";
import kyInstance from "@/lib/ky";

interface WalletImageUploadProps {
  control: Control<any>;
  name: string;
}

interface CloudinaryResponseProps {
  secure_url: string;
}

const WalletImageUpload = ({ control, name }: WalletImageUploadProps) => {
  const { user } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  if (!user) redirect("/sign-in");

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "fairshare");

    setIsUploading(true);

    try {
      const uploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL as string;

      const response = await kyInstance.post(uploadUrl, {
        body: formData,
      });

      if (response.ok) {
        const data: CloudinaryResponseProps = await response.json();
        setImageUrl(data.secure_url);
        onChange(data.secure_url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <FormField
        name={name}
        control={control}
        render={({ field }) => (
          <FormItem>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, field.onChange)}
              ref={fileInputRef}
              className="hidden"
              disabled={isUploading}
            />
            <div className="group relative mx-auto w-fit">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="block rounded-full"
              >
                <div className="relative">
                  <Image
                    src={imageUrl || Placeholder}
                    alt="Upload Image"
                    width={150}
                    height={150}
                    className="h-32 w-32 rounded-full border-2 border-primary"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <CameraIcon className="size-6 text-white group-hover:scale-110" />
                    <span className="text-xs font-semibold text-white">
                      Change Photo
                    </span>
                  </div>
                  {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm">
                      <Loader2 className="size-12 animate-spin text-primary" />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};

export default WalletImageUpload;
