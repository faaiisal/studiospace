import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E76F51] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#E76F51] text-white hover:bg-[#d55f42] hover:-translate-y-[1px] shadow-sm",
        secondary: "bg-[#202124] text-white hover:bg-black",
        outline: "border border-[#E7E5E0] bg-white text-[#202124] hover:bg-[#F1F0EC]",
        ghost: "text-[#202124] hover:bg-[#F1F0EC] hover:text-[#202124]",
        destructive: "bg-[#E63946] text-white hover:bg-[#c9303c]",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

