export function DataTable({
    columns = [],
    rows = [],
    selectedIds = [],
    onToggleRow,
    renderRow,
    emptyMessage = 'No records found.',
    className = '',
}) {
    return (
        <div className={`overflow-x-auto rounded-3xl border border-[#f0eee6] bg-[#faf9f5] p-3 ${className}`}>
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead>
                    <tr className="border-b border-[#e8e6dc] text-[#5e5d59]">
                        {columns.map((column) => (
                            <th key={column.key} className={`p-3 ${column.className ?? ''}`}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="p-6 text-center text-[#5e5d59]">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => (
                            <tr key={row.id ?? row.key ?? row.email} className="border-b border-[#e8e6dc] hover:bg-[#f7f4ee]">
                                {renderRow({ row, selected: selectedIds.includes(row.id), onToggleRow })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}
