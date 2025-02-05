import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceType } from "@/lib/types";
import { format } from "date-fns";
import {
  Calendar,
  Calendar1Icon,
  CalendarDays,
  CalendarX2Icon,
  ChevronRight,
  Clock,
  CoinsIcon,
  FileTextIcon,
  Mail,
  MoreVerticalIcon,
  Notebook,
  Phone,
  TimerIcon,
  User2Icon,
  Wallet,
  WholeWord,
} from "lucide-react";
import React from "react";
import { FaFileInvoice, FaMoneyBill } from "react-icons/fa";
import InvoiceMore from "./create/InvoiceMore";
import PaymentStatus from "./PaymentStatus";

interface InvoiceProps {
  invoiceData: InvoiceType;
}

const Invoice = ({ invoiceData }: InvoiceProps) => {
  const getDateProgress = (
    startDate: string | Date,
    endDate: string | Date
  ) => {
    const totalDays =
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 3600 * 24);

    const dayPassed =
      (Date.now() - new Date(startDate).getTime()) / (1000 * 3600 * 24);

    return Math.min(100, Math.max(0, (dayPassed / totalDays) * 100));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileTextIcon className="size-12 pt-1" />
            <h1 className="text-xl font-bold pr-3 w-[500px]">
              {invoiceData.draftName}
            </h1>
            <PaymentStatus invoiceData={invoiceData} />
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-muted-foreground">
              #{invoiceData.id}
            </Badge>
            <InvoiceMore invoiceData={invoiceData} />
          </div>
        </CardTitle>
        <CardContent className="p-0">
          <div>
            <Separator className="my-4" />
            <div className="grid grid-cols-3 items-center pb-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <User2Icon className="text-muted-foreground size-4" />
                  <p className="text-[15px] tracking-wide">
                    {invoiceData.clientName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="text-muted-foreground size-4" />
                  <p className="text-[15px] tracking-wide">
                    {invoiceData.clientEmail}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-muted-foreground size-4" />
                  <p className="text-[15px] tracking-wide">
                    {invoiceData.clientNumber}
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex justify-between items-center w-full">
                <div className="min-w-fit p-1 z-10 space-y-2 flex flex-col items-center">
                  <div className="flex flex-col space-y-1 items-center w-fit p-3 border border-border rounded-md">
                    <CalendarDays className="text-muted-foreground size-4" />
                    <p className="text-[15px]">
                      {new Date(invoiceData.issueDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <Badge variant="secondary">Issue Date</Badge>
                </div>
                <div className="h-2 bg-border rounded-full w-full">
                  <div
                    style={{
                      width: `${getDateProgress(
                        invoiceData.issueDate,
                        invoiceData.dueDate
                      )}%`,
                    }}
                    className="h-full bg-primary rounded-full transition-all duration-500"
                  ></div>
                </div>
                <div className="min-w-fit p-2 z-10 space-y-2 flex flex-col items-center">
                  <div className="flex flex-col space-y-1 items-center w-fit p-3 border border-border rounded-md">
                    <CalendarDays className="text-muted-foreground size-4" />
                    <p className="text-[15px]">
                      {new Date(invoiceData.dueDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <Badge variant="secondary">Due Date</Badge>
                </div>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="h-20">{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>₹{product.unitPrice}</TableCell>
                    <TableCell>₹{product.totalPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <div className="grid grid-cols-2 items-start gap-12">
              <div className="flex flex-col space-y-2">
                <div className="flex gap-2 items-center text-[15px]">
                  <CoinsIcon className="size-4" />
                  <p>Total Amount: ₹{invoiceData.totalAmount}</p>
                </div>
                <div className="flex gap-2 items-center text-[15px]">
                  <Wallet className="size-4" />
                  <p>Payment Method: {invoiceData.paymentMethod}</p>
                </div>
                <div className="flex gap-2 items-center text-[15px]">
                  <TimerIcon className="size-4" />
                  <p>Created At: {format(invoiceData.createdAt, "PPP")}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Label className="flex gap-2 items-center text-[15px]">
                  <Notebook className="size-4" /> Addition Notes
                </Label>
                <p>{invoiceData.notes}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default Invoice;
