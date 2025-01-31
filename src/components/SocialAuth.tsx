"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Github, Globe } from "lucide-react";
import { useState } from "react";
import LoadingButton from "./controls/LoadingButton";

const SocialAuth = () => {
  const [error, setError] = useState<string>();
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [githubLoading, setGithubLoading] = useState<boolean>(false);

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
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setGithubLoading(false);
        },
      }
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
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setGoogleLoading(false);
        },
      }
    );
  };

  return (
    <div className="flex gap-4 w-full max-w-md">
      <LoadingButton
        loading={googleLoading}
        onClick={GoogleSignIn}
        variant="outline"
        className="flex items-center justify-center gap-3 w-full "
      >
        <Globe className="h-5 w-5 text-red-500" />
        <span>Continue with Google</span>
      </LoadingButton>
      <LoadingButton
        loading={githubLoading}
        onClick={GithubSignIn}
        variant="outline"
        className="flex items-center justify-center gap-3 w-full "
      >
        <Github className="h-5 w-5 text-black" />
        <span>Continue with GitHub</span>
      </LoadingButton>
    </div>
  );
};

export default SocialAuth;
