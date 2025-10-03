import type {
  SRT_Cell,
  SRT_RowData,
  SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface SRT_TableBodyCellProps<TData extends SRT_RowData> {
  cell: SRT_Cell<TData>;
  table: SRT_TableInstance<TData>;
}

/**
 * Table body cell component - renders individual data cell
 *
 * Implemented:
 * - Basic cell rendering with cell value
 * - Renders cell.renderValue() directly
 *
 * TODO (Future enhancements):
 * - Custom Cell component support (columnDef.Cell)
 * - Editing mode (inline text field)
 * - Click to copy functionality
 * - Cell actions menu (right-click)
 * - Skeleton loading state
 * - Filter match highlighting
 * - Column pinning styles
 * - Custom cell props
 * - Keyboard shortcuts
 * - Density variations (compact/comfortable/spacious)
 */

export const SRT_TableBodyCell = <TData extends SRT_RowData>({
  cell,
}: SRT_TableBodyCellProps<TData>) => {
  return (
    <td className={cn('p-4 align-middle', '[&:has([role=checkbox])]:pr-0')}>
      {cell.renderValue() as ReactNode}
    </td>
  );
};
