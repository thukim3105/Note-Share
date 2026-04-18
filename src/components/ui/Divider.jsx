export function Divider({ variant = 'full', className = '' }) {
    if (variant === 'short') {
        return <div className={`mx-auto mt-2 h-[2px] w-[40px] bg-[#f0eee6] ${className}`} />
    }

    return <div className={`h-px w-full bg-[#f0eee6] ${className}`} />
}
