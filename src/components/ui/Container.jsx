import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function Container({ children, className, ...props }) {
    return (
        <div
            className={twMerge(
                clsx("mx-auto w-full max-w-screen-2xl px-6 sm:px-8", className),
            )}
            {...props}
        >
            {children}
        </div>
    );
}
