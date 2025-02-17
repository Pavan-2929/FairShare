import React from "react";
import AuthImage from "@/assets/lightLogo.png";
import Image from "next/image";
import Divider from "@/components/Divider";
import VerifyOTPForm from "./VeirfyOTPForm";
import ResendOTP from "./ResendOTP";
import ArrowDownScroll from "@/components/controls/ArrowDownScroll";

const VerifyOtp = () => {
  return (
    <div className="flex flex-col lg:flex-row">
      <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-8 lg:w-[40vw] lg:px-12">
        <div className="animate-gradient absolute inset-0 bg-[linear-gradient(45deg,hsl(142.1_76.2%_36.3%),hsl(142.1_76.2%_26.3%),hsl(142.1_76.2%_46.3%),hsl(142.1_76.2%_36.3%))] bg-[length:400%_400%]" />
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
        <div className="z-10 space-y-6 text-center text-white">
          <div className="absolute left-1/2 top-8 -translate-x-1/2">
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
            We&apos;ve sent a one-time password (OTP) to your email. Please
            enter it below to complete the registration process.
          </p>
          <div>
            <ArrowDownScroll />
          </div>
        </div>
      </div>

      <div
        id="auth-section"
        className="flex flex-1 flex-col items-center justify-center space-y-12 bg-card px-6 py-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Enter Your OTP</h1>
          <p className="font-medium tracking-wider">
            Check your email and enter the OTP sent to your address.
          </p>
        </div>
        <div className="w-full max-w-md space-y-6">
          <VerifyOTPForm />
          <Divider />
          <ResendOTP />
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
