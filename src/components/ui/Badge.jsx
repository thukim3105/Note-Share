export function Badge({ children, variant = 'default', className = '' }) {
    const base = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]'
    const variants = {
        default: 'bg-[#e8e6dc] text-[#4d6646]',
        success: 'bg-[#d9e8dd] text-[#356137]',
        info: 'bg-[#dbeefa] text-[#386fb3]',
        danger: 'bg-[#f7d4d4] text-[#9b2b2b]',
    }

    return <span className={`${base} ${variants[variant] ?? variants.default} ${className}`}>{children}</span>
}
