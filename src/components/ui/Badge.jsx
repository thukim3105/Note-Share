import clsx from "clsx";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Badge = forwardRef(
  (
    {
      children,
      variant = "default",
      size = "md",
      rounded = "full",
      className,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center font-semibold uppercase tracking-[0.18em]";

    const variants = {
      default: "bg-[#e8e6dc] text-[#4d6646]",
      success: "bg-[#d9e8dd] text-[#356137]",
      info: "bg-[#dbeefa] text-[#386fb3]",
      danger: "bg-[#f7d4d4] text-[#9b2b2b]",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[10px]",
      md: "px-3 py-1 text-xs",
      lg: "px-4 py-1.5 text-sm",
    };

    const radius = {
      full: "rounded-full",
      md: "rounded-md",
      sm: "rounded",
    };

    return (
      <span
        ref={ref}
        className={twMerge(
          clsx(
            base,
            variants[variant] ?? variants.default,
            sizes[size],
            radius[rounded],
            className,
          ),
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);
