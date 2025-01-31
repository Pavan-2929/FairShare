"use client";

import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingButton from "@/components/controls/LoadingButton";
const VerifyOTPForm = () => {
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const params = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const email = atob(params.get("email") || "");
  console.log(email);

  const handleVerifyOTP = async (e: any) => {
    e.preventDefault();
    await authClient.signIn.emailOtp(
      {
        email,
        otp: value,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setValue("");
          router.push(`/`);
          setLoading(false);
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
          console.error(ctx.error.message);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleVerifyOTP}
      className="space-y-4 flex flex-col items-center "
    >
      {error && (
        <p className="text-medium text-center text-destructive">{error}</p>
      )}{" "}
      <InputOTP
        maxLength={6}
        value={value}
        onChange={(value) => setValue(value)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <LoadingButton loading={loading} type="submit">
        Verify yout OTP
      </LoadingButton>
    </form>
  );
};

export default VerifyOTPForm;
