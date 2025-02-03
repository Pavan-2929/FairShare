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
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete account. Please try again",
      });
      setError("Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2Icon className="mr-3" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Transaction?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This action cannot be undone. Are you sure you want to delete this
          transaction?
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
