import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function Section({ id, children, className, ...props }) {
    return (
        <section
            id={id}
            className={twMerge(clsx("py-24", className))}
            {...props}
        >
            {children}
        </section>
    );
}
