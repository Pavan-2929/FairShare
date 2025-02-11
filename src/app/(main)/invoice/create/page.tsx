"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { invoiceSchema, InvoiceValues } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Info,
  Mail,
  Phone,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import React, { useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormInput } from "@/components/controls/FormInput";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CreateInvoiceAction } from "./actions";
import LoadingButton from "@/components/controls/LoadingButton";
import { useToast } from "@/hooks/use-toast";

const CreateTransactionPage = () => {
  const [isPending, startTransition] = useTransition();

  const { toast } = useToast();

  const form = useForm<InvoiceValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      notes: "",
      draftName: "",
      clientName: "",
      clientEmail: "",
      clientNumber: "",
      issueDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: "pending",
      paymentMethod: "cash",
      products: [
        {
          name: "",
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
      totalAmount: 0 as number,
    },
  });

  const { register, control, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const calculateTotalPriceOfProduct = (index: number) => {
    const quantity = Number(watch(`products.${index}.quantity`)) || 0;
    const unitPrice = Number(watch(`products.${index}.unitPrice`)) || 0;
    const totalPrice = quantity * unitPrice;

    setValue(`products.${index}.totalPrice`, totalPrice, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const caluclateTotalAmount = () => {
    const products = watch("products");
    const total = products.reduce((sum, acc) => sum + acc.totalPrice || 0, 0);
    setValue("totalAmount", total);
    return total;
  };

  const onSubmit = async (data: InvoiceValues) => {
    try {
      startTransition(async () => {
        await CreateInvoiceAction(data);
      });
      toast({
        title: "Success",
        description: "Invoice created successfully!",
      });
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create invoice. Please try again later.",
      });
    }
  };

  return (
    <div className="pb-12 pt-6 md:pt-0">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">Create invoice</h1>
          </CardTitle>
          <CardDescription className="text-sm">
            Fill the below details to create new invoice
          </CardDescription>
        </CardHeader>
        <CardContent >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              <div className="pt-8 md:w-1/2 md:py-0 md:pr-4">
                <FormField
                  control={form.control}
                  name="draftName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Draft Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Draft Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
              </div>

              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Client Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="clientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <FormInput
                              icon={<User className="size-5 text-primary" />}
                              placeholder="Client Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Email</FormLabel>
                          <FormControl>
                            <FormInput
                              icon={<Mail className="size-5 text-primary" />}
                              placeholder="Client Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clientNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Number</FormLabel>
                          <FormControl>
                            <FormInput
                              icon={<Phone className="size-5 text-primary" />}
                              placeholder="Client Number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-6">
                    <div className="text-xl">
                      <p>Invoice Details</p>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="">
                          <Info className="size-5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            By default durations is 30 days | You can customize
                            it.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="issueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Issue Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild className="p-5">
                              <FormControl>
                                <Button
                                  className={cn(
                                    "flex justify-start gap-4 pl-3 font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                  variant="outline"
                                >
                                  <CalendarIcon className="size-4 text-muted-foreground" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick Issue-Date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild className="p-5">
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "flex justify-start gap-4 font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  <CalendarIcon className="size-5 text-muted-foreground" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a due date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < form.getValues("issueDate")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Invoice Status</FormLabel>
                          <Select
                            defaultValue={field.value}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Invoice Status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select
                            defaultValue={field.value}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Payment Method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="creditCard">
                                Credit Card
                              </SelectItem>
                              <SelectItem value="bankTransfer">
                                Bank Transfer
                              </SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Product Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Products Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="text-sm">
                        <TableHead className="text-[13px]">
                          <span className="hidden md:inline-flex">Product</span>{" "}
                          Name
                        </TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>
                          <span className="hidden md:inline-flex">Unit</span>{" "}
                          Price (₹)
                        </TableHead>
                        <TableHead>
                          Total
                          <span className="inline-flex md:hidden">(₹)</span>
                          <span className="hidden md:inline-flex">
                            Price (₹)
                          </span>
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((product, index) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Input
                              className="w-32"
                              required
                              placeholder="Product Name"
                              {...register(`products.${index}.name`)}
                            />
                          </TableCell>
                          <TableCell className="h-20">
                            <Input
                              required
                              className="w-24"
                              type="number"
                              {...register(`products.${index}.quantity`, {
                                valueAsNumber: true,
                              })}
                              onChange={(e) => {
                                register(`products.${index}.quantity`).onChange(
                                  e,
                                );
                                calculateTotalPriceOfProduct(index);
                              }}
                            />
                          </TableCell>
                          <TableCell className="h-20">
                            <Input
                              required
                              className="w-24"
                              type="number"
                              {...register(`products.${index}.unitPrice`, {
                                valueAsNumber: true,
                              })}
                              onChange={(e) => {
                                register(
                                  `products.${index}.unitPrice`,
                                ).onChange(e);
                                calculateTotalPriceOfProduct(index);
                              }}
                            />
                          </TableCell>
                          <TableCell className="h-20">
                            <Input
                              type="number"
                              className="w-24"
                              readOnly
                              {...register(`products.${index}.totalPrice`, {
                                valueAsNumber: true,
                              })}
                            />
                          </TableCell>
                          <TableCell className="h-20">
                            <Trash2
                              className="size-5 cursor-pointer text-destructive"
                              onClick={() => remove(index)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex flex-col justify-between gap-4 px-4 pt-8 md:flex-row">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        append({
                          name: "",
                          quantity: 1,
                          unitPrice: 0,
                          totalPrice: 0,
                        })
                      }
                    >
                      <Plus className="size-5" />
                      Add Product
                    </Button>
                    <div>
                      <Label>
                        Total Amount: ₹{caluclateTotalAmount().toFixed(2)}
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Addition Notes */}
              <Card>
                <CardHeader className="text-xl">
                  <CardTitle>Additions Note</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="h-32 resize-y"
                            placeholder="Addition Notes..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <LoadingButton loading={isPending} type="submit">
                  Create Invoice
                </LoadingButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTransactionPage;
