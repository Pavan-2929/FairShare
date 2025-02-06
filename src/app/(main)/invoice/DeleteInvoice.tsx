import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/controls/LoadingButton";
import { DeleteInvoiceAction } from "./actions";
import { InvoiceType } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
const DeleteInvoice = ({ invoiceData }: { invoiceData: InvoiceType }) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = () => {
    try {
      startTransition(async () => {
        await DeleteInvoiceAction(invoiceData.id);
      });
      toast({
        title: "Invoice deleted",
        description: "The invoice has been successfully deleted.",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the invoice.",
      });
      console.error("Deletion failed:", error);
    } finally {
      setOpen(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-2 w-full flex justify-start">
          <Trash2Icon className="mr-3" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Invoice?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to delete this
          Invoice?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="secondary">
            Cancel
          </Button>
          <LoadingButton
            loading={isPending}
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvoice;
