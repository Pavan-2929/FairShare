"use client";

import { updateUserSchema, UpdateUserValues } from "@/lib/validations";
import useSession from "@/utils/useSession";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, Phone } from "lucide-react";
import LoadingButton from "@/components/controls/LoadingButton";
import { FormInput } from "@/components/controls/FormInput";
import { redirect } from "next/navigation";
import { updateUserDetails } from "./actions";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

const UserDetails = () => {
  const { user } = useSession();

  const { toast } = useToast();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });
  if (!user) return redirect("/sign-in");

  const onSubmit = async (data: UpdateUserValues) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await updateUserDetails(data);
      authClient.updateUser({
        name: newUser.name,
        image: newUser.image,
      });
      toast({
        title: "Success",
        description: "User details updated successfully!",
      });
    } catch (err) {
      console.error(err);
      setError("Failed to update user details.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user details.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      {user ? (
        <>
          <h1 className="mb-4 text-xl font-semibold">Update User Details</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <p className="text-medium text-center text-destructive">
                  {error}
                </p>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <FormInput
                        placeholder="Full Name"
                        {...field}
                        icon={<Mail className="size-5 text-primary" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <FormInput
                        icon={<Phone className="size-5 text-primary" />}
                        type="tel"
                        placeholder="Enter your phone number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full pt-3">
                <LoadingButton
                  loading={loading}
                  type="submit"
                  className="w-full"
                >
                  Update Details
                </LoadingButton>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default UserDetails;
