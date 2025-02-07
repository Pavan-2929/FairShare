import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        <Input
          className={cn(
            "h-10 ps-12 text-[15px] placeholder:text-[15px]",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

FormInput.displayName = "FormInput";

export { FormInput };
