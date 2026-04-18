export function Button({ children, className = '', ...props }) {
    return (
        <button
            className={`w-full h-12 rounded-xl bg-[#c96442] px-5 text-sm font-medium uppercase tracking-[0.12em] text-[#faf9f5] transition-colors duration-150 hover:bg-[#b24f31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f4ed] ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
