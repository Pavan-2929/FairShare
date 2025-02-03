"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userOtherDetailsSchema,
  UserOtherDetailsValues,
} from "@/lib/validations";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useSession from "@/utils/useSession";
import { redirect, useRouter } from "next/navigation";
import { updateUserOtherDetails } from "./actions";
import LoadingButton from "@/components/controls/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

const UserOtherDetails: React.FC = () => {
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  if (!user) redirect("/sign-in");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UserOtherDetailsValues>({
    resolver: zodResolver(userOtherDetailsSchema),
    defaultValues: {
      age: user.age || 0,
      gender: (user.gender as "male" | "female" | "other") || undefined,
      city: user.city || "",
    },
  });

  const onSubmit = async (data: UserOtherDetailsValues) => {
    setLoading(true);
    setError(null);
    try {
      const newData = await updateUserOtherDetails(data);
      authClient.updateUser({
        name: newData.name,
        image: newData.image,
      });
      toast({
        title: "Success",
        description: "User details updated successfully!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user details.",
      });
      setError("Failed to update user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-card rounded-md">
      <h1 className="text-xl font-semibold mb-4">Other Details</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Age Field */}
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gender Field */}
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <span>{field.value || "Select Gender"}</span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Enter your city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full pt-3">
            <LoadingButton className="w-full" loading={loading} type="submit">
              Submit
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserOtherDetails;
