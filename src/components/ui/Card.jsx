import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function Card({
  children,
  variant = "default",
  padding = "md",
  className,
  ...props
}) {
  const base = "rounded-[24px] border bg-[#faf9f5]";

  const variants = {
    default: "border-[#f0eee6]",
    elevated: "border-transparent shadow-md",
    outlined: "border-[#dcd8cc]",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-8",
    lg: "p-10",
  };

  return (
    <div
      className={twMerge(
        clsx(base, variants[variant], paddings[padding], className),
      )}
      {...props}
    >
      {children}
    </div>
  );
}
