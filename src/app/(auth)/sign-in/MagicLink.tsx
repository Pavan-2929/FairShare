"use client";

import { signinSchema, SignInValues } from "@/lib/validations";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { FormInput } from "@/components/controls/FormInput";
import { Mail } from "lucide-react";
import LoadingButton from "@/components/controls/LoadingButton";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

const MagicLink = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    const { email } = values;

    await authClient.signIn.magicLink(
      {
        email,
        callbackURL: "/",
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          form.reset();
          setLoading(false);
          toast({
            title: "Magic Link Sent",
            description: "Check your email for the magic link to sign in.",
          });
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              ctx.error.message ||
              "Something went wrong | Try different method",
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <p className="text-medium text-center text-destructive">{error}</p>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <FormInput
                  placeholder="Email"
                  {...field}
                  icon={<Mail className="size-5 text-primary" />}
                />
              </FormControl>
              <FormDescription />
            </FormItem>
          )}
        />
        <div className="pt-3 w-full">
          <LoadingButton loading={loading} type="submit" className="w-full">
            Sign In with Magic Link
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default MagicLink;
