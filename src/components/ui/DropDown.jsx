import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button.jsx";
import { Text } from "./Typography.jsx";

export function DropDown({
  label = "Actions",
  items = [],
  placement = "bottom-end",
  offset = 8,
  className,
  menuClassName,
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const [coords, setCoords] = useState({
    top: 0,
    left: 0,
    minWidth: 0,
  });

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    let top = rect.bottom + offset;
    let left = rect.left;

    if (placement === "bottom-end") {
      left = rect.right;
    }

    if (placement === "top-start") {
      top = rect.top - offset;
    }

    if (placement === "top-end") {
      top = rect.top - offset;
      left = rect.right;
    }

    setCoords({
      top: top + window.scrollY,
      left: left + window.scrollX,
      minWidth: rect.width,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const handleClickOutside = (e) => {
      if (
        !triggerRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement, offset]);

  return (
    <>
      <div
        ref={triggerRef}
        className={twMerge(clsx("inline-block", className))}
      >
        <Button
          type="button"
          className="w-auto"
          onClick={() => setOpen((prev) => !prev)}
        >
          {label}
        </Button>
      </div>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: coords.top,
              left: placement.includes("end")
                ? coords.left - coords.minWidth
                : coords.left,
              minWidth: coords.minWidth,
            }}
            className={twMerge(
              clsx(
                "z-50 overflow-hidden rounded-3xl border border-[#e8e6dc] bg-white shadow-lg",
                menuClassName,
              ),
            )}
          >
            {items.map((item, index) => (
              <button
                key={`${item.label}-${index}`}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className="w-full px-4 py-3 text-left text-sm text-[#141413] hover:bg-[#f7f4ee] disabled:cursor-not-allowed disabled:text-[#999]"
              >
                <Text>{item.label}</Text>
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
