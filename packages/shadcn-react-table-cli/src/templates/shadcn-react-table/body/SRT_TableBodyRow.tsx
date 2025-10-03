import type {
  SRT_Row,
  SRT_RowData,
  SRT_TableInstance,
} from 'shadcn-react-table-core';
import { SRT_TableBodyCell } from './SRT_TableBodyCell';
import { cn } from '@/lib/utils';

export interface SRT_TableBodyRowProps<TData extends SRT_RowData> {
  row: SRT_Row<TData>;
  table: SRT_TableInstance<TData>;
}

/**
 * Table body row component - renders a single data row with all its cells
 *
 * Implemented:
 * - Basic cell rendering
 * - Hover state
 *
 * TODO (Future enhancements):
 * - Row selection state styles
 * - Row pinning
 * - Row virtualization support
 * - Detail panel (expand/collapse)
 * - Custom row props
 * - Drag and drop support
 * - Row hover actions
 */

export const SRT_TableBodyRow = <TData extends SRT_RowData>({
  row,
  table,
}: SRT_TableBodyRowProps<TData>) => {
  const visibleCells = row.getVisibleCells();

  return (
    <tr
      data-state={row.getIsSelected() && 'selected'}
      className={cn(
        'border-b transition-colors hover:bg-muted/50',
        'data-[state=selected]:bg-muted',
      )}
    >
      {visibleCells.map((cell) => (
        <SRT_TableBodyCell key={cell.id} cell={cell} table={table} />
      ))}
    </tr>
  );
};
