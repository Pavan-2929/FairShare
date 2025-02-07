"use client";

import { authClient } from "@/lib/auth-client";
import { Github, Globe } from "lucide-react";
import { useState } from "react";
import LoadingButton from "./controls/LoadingButton";
import { useToast } from "@/hooks/use-toast";

const SocialAuth = () => {
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [githubLoading, setGithubLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const GithubSignIn = async () => {
    setGithubLoading(true);
    await authClient.signIn.social(
      {
        provider: "github",
      },
      {
        onRequest: () => {
          setGithubLoading(true);
        },
        onSuccess: () => {
          setGithubLoading(false);
          toast({
            title: "Login Successful",
            description: "You have successfully logged in with GitHub.",
          });
        },
        onError: (ctx) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: ctx.error.message || "Something went wrong",
          });
          setGithubLoading(false);
        },
      },
    );
  };

  const GoogleSignIn = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social(
      {
        provider: "google",
      },
      {
        onRequest: () => {
          setGoogleLoading(true);
        },
        onSuccess: () => {
          setGoogleLoading(false);
          toast({
            title: "Login Successful",
            description: "You have successfully logged in with Google.",
          });
        },
        onError: (ctx) => {
          setGoogleLoading(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: ctx.error.message || "Something went wrong",
          });
        },
      },
    );
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4 lg:flex-row">
      <LoadingButton
        loading={googleLoading}
        onClick={GoogleSignIn}
        variant="outline"
        className="flex w-full items-center justify-center gap-3"
      >
        <Globe className="h-5 w-5 text-red-500" />
        <span>Continue with Google</span>
      </LoadingButton>
      <LoadingButton
        loading={githubLoading}
        onClick={GithubSignIn}
        variant="outline"
        className="flex w-full items-center justify-center gap-3"
      >
        <Github className="h-5 w-5 text-black" />
        <span>Continue with GitHub</span>
      </LoadingButton>
    </div>
  );
};

export default SocialAuth;
