"use client";

import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const ResendOTP = () => {
  const [loading, setLoading] = useState(false);
  const [coolDown, setCoolDown] = useState(0);

  const params = useSearchParams();
  const router = useRouter();
  const email = atob(params.get("email") || "");
  const { toast } = useToast();

  useEffect(() => {
    if (coolDown > 0) {
      const timer = setTimeout(() => {
        setCoolDown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [coolDown]);

  const onSubmit = async () => {
    if (coolDown > 0) {
      toast({
        variant: "destructive",
        title: "Resend OTP",
        description: `You can resend OTP in ${coolDown} seconds`,
      });
    }

    const encodedEmail = btoa(email);

    await authClient.emailOtp.sendVerificationOtp(
      {
        email,
        type: "sign-in",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast({
            title: "Resend OTP",
            description: "A new OTP has been sent to your email address.",
          });
          setCoolDown(150);
          router.push(`/verify-otp?email=${encodedEmail}`);
          setLoading(false);
        },
        onError: (ctx) => {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              ctx.error.message ||
              "Something went wrong | Try different method",
          });
          setLoading(false);
        },
      },
    );
  };

  return (
    <div
      className="cursor-pointer space-y-4 hover:underline"
      onClick={onSubmit}
    >
      <p className="text-center text-muted-foreground">
        {loading ? (
          <span className="flex justify-center">
            <Loader2 className="animate-spin" />
          </span>
        ) : coolDown > 0 ? (
          `Rensed OTP in ${coolDown} seconds`
        ) : (
          "Didn't receive the OTP? Resend it"
        )}
      </p>
    </div>
  );
};

export default ResendOTP;
