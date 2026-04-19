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
    sm: "max-w-sm",
    md: "max-w-xl",
    lg: "max-w-4xl",
  };

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
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
            "w-full rounded-xl border border-[#e8e6dc] bg-[#faf9f5] p-8 shadow-[rgba(0,0,0,0.05)_0px_4px_24px] outline-none",
            sizes[size],
            className,
          ),
        )}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2
            className="font-serif text-2xl font-medium text-[#141413]"
            style={{ fontFamily: "Georgia, serif", lineHeight: 1.2 }}
          >
            {title}
          </h2>

          {/* Close Button - Minimal X Icon */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8e6dc] bg-white text-[#5e5d59] transition hover:bg-[#f0eee6] hover:text-[#4d4c48] active:ring-1 active:ring-[#d1cfc5]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4L4 12M4 4l8 8" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div
          className="text-base leading-relaxed text-[#4d4c48]"
          style={{ fontFamily: "system-ui, -apple-system, Arial, sans-serif" }}
        >
          {children}
        </div>

        {/* Actions */}
        {actions && (
          <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
