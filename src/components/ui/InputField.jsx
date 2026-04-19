import { forwardRef, useId } from "react";
import { Label } from "./Typography.jsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const InputField = forwardRef(
  (
    {
      label,
      id,
      name,
      type = "text",
      placeholder,
      value,
      defaultValue,
      onChange,
      leftAddon,
      rightAddon,
      error,
      hint,
      size = "md",
      fullWidth = true,
      disabled = false,
      required = false,
      className,
      inputClassName,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    const baseInput =
      "block w-full rounded-[12px] border bg-[#fbf7f2] text-[#141413] placeholder:text-[#87867f] transition focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60";

    const sizes = {
      sm: "px-3 py-2 text-xs",
      md: "px-4 py-3 text-sm",
      lg: "px-5 py-4 text-base",
    };

    const states = {
      default:
        "border-[#f0eee6] focus:border-[#3898ec] focus:ring-[#3898ec]/20",
      error: "border-[#b53333] focus:border-[#b53333] focus:ring-[#b53333]/20",
    };

    return (
      <div
        className={twMerge(
          clsx(
            "space-y-2",
            fullWidth && "w-full",
            containerClassName,
            className,
          ),
        )}
      >
        {label && (
          <Label htmlFor={inputId}>
            {label}
            {required && <span className="ml-1 text-[#b53333]">*</span>}
          </Label>
        )}

        <div className="relative">
          {leftAddon && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name || inputId}
            type={type}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={twMerge(clsx(errorId, hintId))}
            className={twMerge(
              clsx(
                baseInput,
                sizes[size],
                error ? states.error : states.default,
                leftAddon && "pl-10",
                rightAddon && "pr-10",
              ),
              inputClassName,
            )}
            {...props}
          />

          {rightAddon && (
            <div className="absolute inset-y-0 right-3 flex items-center">
              {rightAddon}
            </div>
          )}
        </div>

        {error && (
          <p id={errorId} className="text-sm text-[#b53333]">
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={hintId} className="text-sm text-[#87867f]">
            {hint}
          </p>
        )}
      </div>
    );
  },
);
