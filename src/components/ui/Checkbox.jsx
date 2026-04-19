import clsx from "clsx";
import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export const Checkbox = forwardRef(
  (
    {
      checked,
      defaultChecked,
      onChange,
      label,
      disabled = false,
      indeterminate = false,
      id,
      className,
      inputClassName,
      ...props
    },
    ref,
  ) => {
    return (
      <label
        className={twMerge(
          clsx(
            "inline-flex items-center gap-2 cursor-pointer select-none",
            disabled && "cursor-not-allowed opacity-60",
            className,
          ),
        )}
      >
        <input
          ref={(el) => {
            if (el) el.indeterminate = indeterminate;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
          id={id}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          disabled={disabled}
          className={twMerge(
            clsx(
              "h-4 w-4 rounded border-[#d1cfc5] text-[#141413]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]",
              inputClassName,
            ),
          )}
          {...props}
        />

        {label && <span className="text-sm text-[#141413]">{label}</span>}
      </label>
    );
  },
);
