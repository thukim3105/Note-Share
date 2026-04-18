export function Label({ children, htmlFor, className = '' }) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-[0.68rem] uppercase tracking-[0.24em] text-[#5e5d59] ${className}`}
        >
            {children}
        </label>
    )
}
