import clsx from "clsx";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth,
      className,
      ...props
    },
    ref,
  ) => {
    const base =
      "rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2";

    const variants = {
      primary: "bg-[#c96442] text-[#faf9f5] hover:bg-[#b24f31]",
      secondary: "bg-gray-200 text-black hover:bg-gray-300",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs",
      md: "h-12 px-5 text-sm",
      lg: "h-14 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        type="button"
        className={twMerge(
          clsx(
            base,
            variants[variant],
            sizes[size],
            fullWidth && "w-full",
            className,
          ),
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
