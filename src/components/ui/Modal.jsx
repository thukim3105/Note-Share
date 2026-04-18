export function Modal({ open, title, children, onClose, actions }) {
    if (!open) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/40 p-4">
            <div className="w-full max-w-2xl rounded-4xl border border-[#e8e6dc] bg-[#ffffff] p-6 shadow-[0_24px_48px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-lg font-semibold text-[#141413]">{title}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-[#e8e6dc] bg-[#faf9f5] px-4 py-2 text-sm font-semibold text-[#5e5d59] transition hover:bg-[#f0eee6]"
                    >
                        Close
                    </button>
                </div>
                <div className="mt-5 space-y-4 text-sm text-[#4d4c48]">{children}</div>
                {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
            </div>
        </div>
    )
}
