import clsx from "clsx";
import { forwardRef, useMemo } from "react";
import { twMerge } from "tailwind-merge";

export const DataTable = forwardRef(
  (
    {
      columns = [],
      rows = [],
      getRowId = (row) => row.id,
      selectedIds = [],
      onToggleRow,
      renderRow,
      emptyMessage = "No records found.",
      variant = "default",
      density = "md",
      striped = false,
      hoverable = true,
      stickyHeader = false,
      className,
      containerClassName,
      tableClassName,
      headerClassName,
      bodyClassName,
      rowClassName,
      ...props
    },
    ref,
  ) => {
    const baseContainer = "overflow-x-auto rounded-3xl border bg-[#faf9f5]";

    const variants = {
      default: "border-[#f0eee6]",
      outlined: "border-[#dcd8cc]",
      elevated: "border-transparent shadow-sm",
    };

    const densities = {
      sm: "text-xs [&_th]:p-2 [&_td]:p-2",
      md: "text-sm [&_th]:p-3 [&_td]:p-3",
      lg: "text-base [&_th]:p-4 [&_td]:p-4",
    };

    const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(baseContainer, variants[variant], containerClassName, className),
        )}
        {...props}
      >
        <table
          className={twMerge(
            clsx(
              "min-w-full border-separate border-spacing-0 text-left",
              densities[density],
              tableClassName,
            ),
          )}
        >
          <thead
            className={twMerge(
              clsx(
                "text-[#5e5d59]",
                stickyHeader && "sticky top-0 z-10 bg-[#faf9f5]",
                headerClassName,
              ),
            )}
          >
            <tr className="border-b border-[#e8e6dc]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={twMerge(
                    clsx(
                      "font-medium",
                      column.headerClassName || column.className,
                    ),
                  )}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className={bodyClassName}>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="p-6 text-center text-[#5e5d59]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const id = getRowId(row);
                const selected = selectedSet.has(id);

                return (
                  <tr
                    key={id ?? index}
                    className={twMerge(
                      clsx(
                        "border-b border-[#e8e6dc]",
                        hoverable && "hover:bg-[#f7f4ee]",
                        striped && index % 2 === 1 && "bg-[#fcfbf8]",
                        selected && "bg-[#f0ede6]",
                        rowClassName,
                      ),
                    )}
                  >
                    {renderRow({
                      row,
                      index,
                      selected,
                      onToggleRow: () => onToggleRow?.(id, row),
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    );
  },
);
