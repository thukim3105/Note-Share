export function Heading({ children, className = '' }) {
    return (
        <h1 className={`font-serif italic text-[2.75rem] leading-[1.18] tracking-tight text-[#141413] ${className}`}>
            {children}
        </h1>
    )
}

export function Label({ children, htmlFor, className = '' }) {
    return (
        <label
            htmlFor={htmlFor}
            className={`block text-[0.68rem] uppercase tracking-[0.26em] text-[#5e5d59] ${className}`}
        >
            {children}
        </label>
    )
}

export function Text({ children, className = '' }) {
    return <p className={`text-sm leading-[1.65] text-[#5e5d59] ${className}`}>{children}</p>
}
