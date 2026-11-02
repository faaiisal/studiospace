import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[8px] border border-[#E7E5E0] bg-white px-4 py-3 text-[0.9375rem] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#A3A29E] focus-visible:outline-none focus-visible:border-[#202124] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FAF9F6] focus-visible:ring-offset-[#202124] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

