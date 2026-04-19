import { forwardRef } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const Heading = forwardRef(
  (
    {
      as = "h1",
      size = "xl",
      weight = "regular",
      italic = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Tag = as;
    const base = "font-serif tracking-tight text-[#141413]";

    const sizes = {
      sm: "text-xl leading-tight",
      md: "text-2xl leading-tight",
      lg: "text-3xl leading-[1.2]",
      xl: "text-[2.75rem] leading-[1.18]",
      "2xl": "text-[3.5rem] leading-[1.1]",
    };

    const weights = {
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      bold: "font-bold",
    };

    return (
      <Tag
        ref={ref}
        className={twMerge(
          clsx(
            base,
            sizes[size],
            weights[weight],
            italic && "italic",
            className,
          ),
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);

export const Label = forwardRef(
  ({ children, htmlFor, required, size = "md", className, ...props }, ref) => {
    const base = "block uppercase tracking-[0.26em] text-[#5e5d59]";

    const sizes = {
      sm: "text-[0.6rem]",
      md: "text-[0.68rem]",
      lg: "text-xs",
    };

    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={twMerge(clsx(base, sizes[size], className))}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-[#b53333]">*</span>}
      </label>
    );
  },
);

export const Text = forwardRef(
  (
    {
      as = "p",
      size = "md",
      tone = "default",
      weight = "regular",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const Tag = as;
    const base = "leading-[1.65]";

    const sizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const tones = {
      default: "text-[#5e5d59]",
      strong: "text-[#141413]",
      muted: "text-[#87867f]",
      danger: "text-[#b53333]",
    };

    const weights = {
      light: "font-light",
      regular: "font-normal",
      medium: "font-medium",
      bold: "font-semibold",
    };

    return (
      <Tag
        ref={ref}
        className={twMerge(
          clsx(base, sizes[size], tones[tone], weights[weight], className),
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
