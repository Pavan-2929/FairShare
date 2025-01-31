import React from "react";
import AuthImage from "@/assets/auth.png";
import Image from "next/image";
import RegisterForm from "./SignInForm";
import Link from "next/link";
import SocialAuth from "@/components/SocialAuth";
import Divider from "@/components/Divider";
import SignInForm from "./SignInForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MagicLink from "./MagicLink";

const SignIn = () => {
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
          <p className="text-4xl font-bold text-white/95">Glad to see you!</p>
          <p className="font-medium leading-7 tracking-wide text-white/85">
            Welcome to Fair-Share, the simplest way to track and share expenses
            effortlessly. Let's get you set up!
          </p>
        </div>
      </div>

      <div className="flex flex-1 space-y-10 bg-card items-center justify-center py-8 px-6 flex-col">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Hello, Great to have you here!
          </h1>
          <p className="font-semibold tracking-wider">
            Create your Share-Flow account{" "}
          </p>
        </div>
        <div className="w-full max-w-md space-y-5">
          <Tabs defaultValue="OTP" className="space-y-5">
            <TabsList>
              <TabsTrigger value="OTP">Signin with OTP</TabsTrigger>
              <TabsTrigger value="Magic-Link">
                Signin with Magic Link
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
