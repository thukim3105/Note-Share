export function Card({ children, className = '' }) {
    return (
        <div className={`mx-auto w-full rounded-[24px] border border-[#f0eee6] bg-[#faf9f5] px-8 py-10 space-y-8 ${className}`}>
            {children}
        </div>
    )
}
