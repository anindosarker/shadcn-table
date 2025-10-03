import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { SRT_TableBodyRow } from './SRT_TableBodyRow';

export interface SRT_TableBodyProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

/**
 * Table body component - renders all data rows or empty state
 *
 * Implemented:
 * - Basic row rendering
 * - Empty state with message
 * - No results found state
 *
 * TODO (Future enhancements):
 * - Row virtualization
 * - Pinned rows (top/bottom)
 * - Skeleton loading state
 * - Custom empty state component
 * - Layout mode support (grid vs semantic)
 * - Memoization options
 */

export const SRT_TableBody = <TData extends SRT_RowData>({
  table,
}: SRT_TableBodyProps<TData>) => {
  const {
    getRowModel,
    getState,
    getVisibleLeafColumns,
    options: { localization },
  } = table;

  const { columnFilters, globalFilter } = getState();
  const rows = getRowModel().rows;

  // Show empty state if no rows
  if (!rows.length) {
    return (
      <tbody>
        <tr>
          <td
            colSpan={getVisibleLeafColumns().length}
            className="h-24 text-center"
          >
            <div className="text-muted-foreground italic">
              {globalFilter || columnFilters.length
                ? localization.noResultsFound
                : localization.noRecordsToDisplay}
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="[&_tr:last-child]:border-0">
      {rows.map((row) => (
        <SRT_TableBodyRow key={row.id} row={row} table={table} />
      ))}
    </tbody>
  );
};
