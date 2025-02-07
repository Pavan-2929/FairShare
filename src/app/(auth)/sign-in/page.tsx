import React from "react";
import AuthImage from "@/assets/auth.png";
import Image from "next/image";
import SocialAuth from "@/components/SocialAuth";
import Divider from "@/components/Divider";
import SignInForm from "./SignInForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MagicLink from "./MagicLink";
import ArrowDownScroll from "@/components/controls/ArrowDownScroll";

const SignIn = () => {
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
          <p className="text-4xl font-bold text-white/95">Glad to see you!</p>
          <p className="font-medium leading-7 tracking-wide text-white/85">
            Welcome to Fair-Share, the simplest way to track and share expenses
            effortlessly. Let&apos;s get you set up!
          </p>
          <div>
            <ArrowDownScroll />
          </div>
        </div>
      </div>

      <div
        id="auth-section"
        className="flex flex-col items-center justify-center space-y-10 bg-card px-6 py-8 lg:flex-1"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Hello, Great to have you here!
          </h1>
          <p className="font-semibold tracking-wider">
            Create your Share-Flow account{" "}
          </p>
        </div>
        <div className="w-full max-w-md space-y-5">
          <Tabs defaultValue="OTP" className="space-y-5">
            <TabsList>
              <TabsTrigger value="OTP">
                <span className="hidden md:block">Signin with OTP</span>
                <span className="block md:hidden">OTP</span>
              </TabsTrigger>
              <TabsTrigger value="Magic-Link">
                <span className="hidden md:block">Signin with Magic-Link</span>
                <span className="block md:hidden">Magic-Link</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="OTP">
              <SignInForm />
            </TabsContent>
            <TabsContent value="Magic-Link">
              <MagicLink />
            </TabsContent>
          </Tabs>
          <Divider />
          <div className="space-y-5">
            <SocialAuth />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
