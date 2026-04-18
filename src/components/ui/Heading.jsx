export function Heading({ children, size = 'xl', className = '' }) {
    const sizeClasses = {
        xl: 'text-4xl sm:text-5xl md:text-6xl',
        lg: 'text-3xl sm:text-4xl md:text-5xl',
        md: 'text-2xl sm:text-3xl',
    }

    return (
        <h1 className={`font-serif font-medium tracking-tight text-[#141413] leading-[1.18] ${sizeClasses[size]} ${className}`}>
            {children}
        </h1>
    )
}
