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
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingButton from "@/components/controls/LoadingButton";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";

const DeleteAccount = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const onSubmit = async () => {
    setLoading(true);
    await authClient.deleteUser({
      callbackURL: "/sign-in",
    });
    toast({
      title: "Delete Account",
      description: "Your account has been deleted",
    });
    try {
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please try again",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon className="mr-1 md:mr-3" />
          <span className="hidden md:inline-flex">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to delete this
          Account?
        </DialogDescription>
        <DialogFooter>
          <Button onClick={() => setOpen(false)} variant="secondary">
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            variant="destructive"
            onClick={onSubmit}
          >
            Delete
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccount;
