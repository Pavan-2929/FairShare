import React, { useState } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, User2Icon } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ icon, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
      setShowPassword(!showPassword);
        };
        
    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        <Input
          className={cn(
            "ps-12 pe-12 h-10 text-[15px] placeholder:text-[15px]",
            className
          )}
          type={showPassword ? "text" : "password"}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {showPassword ? (
            <EyeOff className="size-5 text-muted-foreground/50" />
          ) : (
            <Eye className="size-5 text-muted-foreground/50" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
