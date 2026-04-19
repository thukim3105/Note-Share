export function Tab({ tabs = [], activeTab, onChange, className = '' }) {
    return (
        <div className={`inline-flex overflow-hidden rounded-3xl border border-[#e8e6dc] bg-[#ffffff] p-1 ${className}`}>
            {tabs.map((tab) => {
                const active = tab.id === activeTab
                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChange(tab.id)}
                        className={`rounded-3xl px-4 py-2 text-sm font-medium transition ${
                            active
                                ? 'bg-[#141413] text-white shadow-sm'
                                : 'text-[#5e5d59] hover:bg-[#f0eee6] hover:text-[#141413]'
                        }`}
                    >
                        {tab.label}
                    </button>
                )
            })}
        </div>
    )
}
