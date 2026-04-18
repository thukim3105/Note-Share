export function Text({ children, className = '' }) {
    return <p className={`text-base leading-[1.65] text-[#5e5d59] ${className}`}>{children}</p>
}
