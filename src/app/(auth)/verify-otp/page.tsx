import React from "react";
import AuthImage from "@/assets/auth.png";
import Image from "next/image";
import Link from "next/link";
import Divider from "@/components/Divider";
import VerifyOTPForm from "./VeirfyOTPForm";

const VerifyOtp = () => {
  return (
    <div className="flex">
      <div className="relative flex w-[40vw] flex-col items-center justify-center min-h-screen px-12 py-8 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,hsl(142.1_76.2%_36.3%),hsl(142.1_76.2%_26.3%),hsl(142.1_76.2%_46.3%),hsl(142.1_76.2%_36.3%))] bg-[length:400%_400%] animate-gradient" />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/10 backdrop-blur-sm"
              style={{
                width: `${Math.random() * 40 + 20}px`,
                height: `${Math.random() * 40 + 20}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${15 + i * 2}s infinite linear`,
              }}
            />
          ))}
        </div>
        <div className="z-10 text-center text-white space-y-6">
          <div className="absolute top-8 left-1/2 -translate-x-1/2">
            <Image
              src={AuthImage}
              height={125}
              width={150}
              alt="Auth Image"
              className="drop-shadow-lg"
            />
          </div>
          <p className="text-4xl font-bold text-white/95">OTP Verification</p>
          <p className="font-medium leading-7 tracking-wide text-white/85">
            We've sent a one-time password (OTP) to your email. Please enter it
            below to complete the registration process.
          </p>
        </div>
      </div>

      <div className="flex flex-1 space-y-12 bg-card items-center justify-center py-8 px-6 flex-col">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Enter Your OTP</h1>
          <p className="font-medium tracking-wider">
            Check your email and enter the OTP sent to your address.
          </p>
        </div>
        <div className="w-full max-w-md space-y-6">
          <VerifyOTPForm />
          <Divider />
          <div className="space-y-4">
            <p className="text-muted-foreground text-center">
              Didn't receive the OTP? <Link href="/resend-otp">Resend it</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
