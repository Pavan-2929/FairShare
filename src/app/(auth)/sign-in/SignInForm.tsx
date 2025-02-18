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
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

const SignInForm = () => {
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: SignInValues) => {
    const { email } = values;

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
            title: "OTP send",
            description: "A OTP has been sent to your email address.",
          });
          form.reset();
          router.push(`/verify-otp?email=${encodedEmail}`);
          setLoading(false);
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
      },
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
        <div className="w-full pt-3">
          <LoadingButton loading={loading} type="submit" className="w-full">
            Sign In with OTP
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
