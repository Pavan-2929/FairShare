"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalSchema, GoalValues } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  BanknoteIcon,
  CalendarIcon,
  CoinsIcon,
  CreditCardIcon,
  Heading,
  Heading1Icon,
  PlusCircle,
  Text,
} from "lucide-react";
import WalletImageUpload from "./WalletImageUpload";
import { FormInput } from "@/components/controls/FormInput";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import createGoalAction from "./actions";
import { Input } from "@/components/ui/input";

const CreateGoal = () => {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<GoalValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "pavan",
      note: "this is note",
      category: "travel",
      image: "",
      priority: "medium",
      reminder: "biweekly",
      completionDate: new Date(new Date().setDate(new Date().getDate() + 4)),
      targetAmount: 25 as number,
    },
  });

  const handleSubmit = async (values: GoalValues) => {
    try {
      console.log("Submitting values:", values);
      await createGoalAction(values);
      setIsOpen(false);
    } catch (error) {
      console.error("Error submitting goal:", error);
      setError("Failed to create the goal. Please check your input.");
    }
  };

  const categories = [
    "travel",
    "education",
    "health",
    "emergency",
    "savings",
    "other",
  ];
  const priorities = ["low", "medium", "high"];
  const reminders = ["daily", "every_3_days", "weekly", "biweekly", "monthly"];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle />
          Add Goals
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="pb-5">
            {step === 1 ? "Create your Goal" : "Set-up your goal"}
          </DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-3"
            >
              {error && (
                <p className="text-medium text-center text-destructive">
                  {error}
                </p>
              )}
              {step === 1 && (
                <>
                  <WalletImageUpload control={form.control} name="image" />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Title</FormLabel>
                        <FormControl>
                          <FormInput
                            {...field}
                            icon={<Text className="size-4 text-primary" />}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Notes..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="targetAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal's Amount</FormLabel>
                        <FormControl>
                          <FormInput
                            type="number"
                            icon={
                              <CreditCardIcon className="size-4 text-primary" />
                            }
                            placeholder="Enter amount of your goal"
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              {step === 2 && (
                <>
                  <div className="flex items-end justify-between gap-x-3">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Goal's Category</FormLabel>
                          <Select
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((item) => (
                                <SelectItem key={item} value={item}>
                                  {item}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {form.getValues("category") === "other" && (
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="w-1/2">
                            <FormLabel></FormLabel>
                            <FormControl>
                              <Input placeholder="Category" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal's Priority</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reminder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal's Priority</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            {reminders.map((item) => (
                              <SelectItem key={item} value={item}>
                                {item}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="completionDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Goal's Priority</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>
                                    Pick Esitmated time to complete goal
                                  </span>
                                )}
                                <CalendarIcon className="ml-auto size-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date <=
                                new Date(
                                  new Date().setDate(new Date().getDate() + 3),
                                )
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <DialogFooter className="pt-5">
                {step === 2 ? (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit">Submit</Button>
                  </div>
                ) : (
                  <Button type="button" onClick={() => setStep(2)}>
                    Next
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGoal;
