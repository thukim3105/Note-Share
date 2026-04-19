import clsx from "clsx";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Divider = forwardRef(
  (
    {
      orientation = "horizontal",
      variant = "full",
      thickness = "thin",
      color = "default",
      className,
      ...props
    },
    ref,
  ) => {
    const base = "shrink-0";

    const orientations = {
      horizontal: "w-full",
      vertical: "h-full",
    };

    const variants = {
      full: "",
      inset: orientation === "horizontal" ? "mx-4" : "my-4",
      middle: orientation === "horizontal" ? "mx-auto w-1/2" : "my-auto h-1/2",
      short: orientation === "horizontal" ? "mx-auto w-10" : "my-auto h-10",
    };

    const thicknessMap = {
      thin: orientation === "horizontal" ? "h-px" : "w-px",
      medium: orientation === "horizontal" ? "h-[2px]" : "w-[2px]",
      thick: orientation === "horizontal" ? "h-[4px]" : "w-[4px]",
    };

    const colors = {
      default: "bg-[#f0eee6]",
      muted: "bg-[#e8e6dc]",
      strong: "bg-[#dcd8cc]",
    };

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={twMerge(
          clsx(
            base,
            orientations[orientation],
            variants[variant],
            thicknessMap[thickness],
            colors[color],
            className,
          ),
        )}
        {...props}
      />
    );
  },
);
