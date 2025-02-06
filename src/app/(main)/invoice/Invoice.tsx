import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  CalendarDays,
  Mail,
  Phone,
  User2Icon,
  Wallet,
  TimerIcon,
  Notebook,
  CoinsIcon,
  FileTextIcon,
} from "lucide-react";
import InvoiceMore from "./InvoiceMore";
import PaymentStatus from "./PaymentStatus";

interface InvoiceProps {
  invoiceData: InvoiceType;
}

const Invoice = ({ invoiceData }: InvoiceProps) => {
  const getDateProgress = (
    startDate: string | Date,
    endDate: string | Date,
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
        <CardTitle className="flex flex-col flex-wrap items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="hidden items-center gap-2 sm:flex">
            <FileTextIcon className="size-12 pt-1" />
            <h1 className="min-w-fit pr-3 text-xl font-bold">
              {invoiceData.draftName}
            </h1>
            <PaymentStatus invoiceData={invoiceData} />
          </div>
          <div className="hidden items-center gap-2 sm:flex md:gap-4">
            <Badge variant="outline" className="text-muted-foreground">
              #{invoiceData.id}
            </Badge>
            <InvoiceMore invoiceData={invoiceData} />
          </div>

          {/* Mobile */}
          <div className="flex w-full flex-col items-start justify-start sm:hidden">
            <div className="flex w-full items-center justify-between pb-4">
              <div className="flex gap-2">
                <FileTextIcon className="size-6 pt-1" />
                <h1 className="min-w-fit pr-3 text-xl font-bold">
                  {invoiceData.draftName}
                </h1>
              </div>
              <InvoiceMore invoiceData={invoiceData} />
            </div>
            <div className="pb-4 sm:hidden">
              <Badge
                variant="outline"
                className="text-xs text-muted-foreground"
              >
                #{invoiceData.id}
              </Badge>
            </div>
            <div className="w-fit min-w-44">
              <PaymentStatus invoiceData={invoiceData} />
            </div>
          </div>
        </CardTitle>
        <CardContent className="p-0 sm:p-0">
          <div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 flex-wrap items-center gap-4 pb-6 md:grid-cols-3 md:gap-x-20">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <User2Icon className="size-4 text-muted-foreground" />
                  <p className="text-[15px] tracking-wide">
                    {invoiceData.clientName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <p className="text-[15px] tracking-wide">
                    {invoiceData.clientEmail}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <p className="text-[15px] tracking-wide">
                    {invoiceData.clientNumber}
                  </p>
                </div>
              </div>
              <div className="col-span-2 flex w-full items-center justify-between pt-4 sm:pt-0">
                <div className="z-10 flex min-w-fit flex-col items-center space-y-2 p-1">
                  <div className="flex w-fit flex-col items-center space-y-1 rounded-md border border-border p-3">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    <p className="text-[15px]">
                      {new Date(invoiceData.issueDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <Badge variant="secondary">Issue Date</Badge>
                </div>
                <div className="h-2 w-full rounded-full bg-border">
                  <div
                    style={{
                      width: `${getDateProgress(
                        invoiceData.issueDate,
                        invoiceData.dueDate,
                      )}%`,
                    }}
                    className="h-full rounded-full bg-primary transition-all duration-500"
                  ></div>
                </div>
                <div className="z-10 flex min-w-fit flex-col items-center space-y-2 p-2">
                  <div className="flex w-fit flex-col items-center space-y-1 rounded-md border border-border p-3">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    <p className="text-[15px]">
                      {new Date(invoiceData.dueDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "2-digit",
                        },
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
                  <TableHead className="text-sm md:text-base">ID</TableHead>
                  <TableHead className="min-w-40 text-sm md:text-base">
                    Product Name
                  </TableHead>
                  <TableHead className="min-w-28 text-sm md:text-base">
                    Quantity
                  </TableHead>
                  <TableHead className="min-w-28 text-sm md:text-base">
                    Unit Price
                  </TableHead>
                  <TableHead className="min-w-28 text-sm md:text-base">
                    Total Price
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceData.products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="h-20">{product.id}</TableCell>
                    <TableCell className="w-24">{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>₹{product.unitPrice}</TableCell>
                    <TableCell>₹{product.totalPrice}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 items-start gap-12 sm:grid-cols-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2 text-[15px]">
                  <CoinsIcon className="size-4" />
                  <p>Total Amount: ₹{invoiceData.totalAmount}</p>
                </div>
                <div className="flex items-center gap-2 text-[15px]">
                  <Wallet className="size-4" />
                  <p>Payment Method: {invoiceData.paymentMethod}</p>
                </div>
                <div className="flex items-center gap-2 text-[15px]">
                  <TimerIcon className="size-4" />
                  <p>Created At: {format(invoiceData.createdAt, "PPP")}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <Label className="flex items-center gap-2 text-[15px]">
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
