import clsx from "clsx";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Tabs = forwardRef(
  (
    {
      tabs = [],
      value,
      defaultValue,
      onChange,
      size = "md",
      variant = "default",
      fullWidth = false,
      className,
      tabClassName,
      ...props
    },
    ref,
  ) => {
    const activeValue = value ?? defaultValue;

    const base = "inline-flex overflow-hidden rounded-3xl border bg-white p-1";

    const variants = {
      default: "border-[#e8e6dc]",
      soft: "border-transparent bg-[#f7f4ee]",
    };

    const sizes = {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    };

    const tabBase =
      "rounded-3xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]";

    const tabSizes = {
      sm: "px-3 py-1.5",
      md: "px-4 py-2",
      lg: "px-5 py-2.5",
    };

    return (
      <div
        ref={ref}
        role="tablist"
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
        {tabs.map((tab) => {
          const active = tab.id === activeValue;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange?.(tab.id)}
              className={twMerge(
                clsx(
                  tabBase,
                  tabSizes[size],
                  fullWidth && "flex-1 text-center",
                  active
                    ? "bg-[#141413] text-white shadow-sm"
                    : "text-[#5e5d59] hover:bg-[#f0eee6] hover:text-[#141413]",
                  tab.disabled && "cursor-not-allowed opacity-50",
                  tabClassName,
                ),
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  },
);
