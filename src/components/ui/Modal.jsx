import clsx from "clsx";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

export function Modal({
  open,
  title,
  children,
  onClose,
  actions,
  closeOnOverlay = true,
  closeOnEsc = true,
  size = "md",
  className,
}) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "Escape" && closeOnEsc) {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, closeOnEsc, onClose]);

  useEffect(() => {
    if (open) {
      contentRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/40 p-4"
      onMouseDown={(e) => {
        if (e.target === overlayRef.current && closeOnOverlay) {
          onClose?.();
        }
      }}
    >
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={twMerge(
          clsx(
            "w-full rounded-3xl border border-[#e8e6dc] bg-white p-6 shadow-[0_24px_48px_rgba(0,0,0,0.08)] outline-none",
            sizes[size],
            className,
          ),
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="text-lg font-semibold text-[#141413]">{title}</div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e8e6dc] bg-[#faf9f5] px-3 py-1.5 text-sm font-medium text-[#5e5d59] transition hover:bg-[#f0eee6]"
          >
            Close
          </button>
        </div>

        <div className="mt-5 text-sm text-[#4d4c48]">{children}</div>

        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>,
    document.body,
  );
}
