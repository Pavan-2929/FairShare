import { Button } from "@/components/ui/button";
import { Download, Mail, Plus } from "lucide-react";
import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import AddTransaction from "./AddTransaction";

const PersonalBudget = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="font-bold text-2xl">Keep track of your budget</h1>

      <div className="flex gap-5">
        <button aria-label="Share on WhatsApp">
          <FaWhatsapp className="size-5 text-muted-foreground hover:text-primary transition" />
        </button>
        <button aria-label="Send Email">
          <Mail className="size-5 text-muted-foreground hover:text-primary transition" />
        </button>
        <button aria-label="Download Report">
          <Download className="size-5 text-muted-foreground hover:text-primary transition" />
        </button>
        <AddTransaction />
      </div>
    </div>
  );
};

export default PersonalBudget;
