import type {
  SRT_Cell,
  SRT_RowData,
  SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
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
 * - Density variations (compact/comfortable/spacious)
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
 */

const cellVariants = cva('align-middle [&:has([role=checkbox])]:pr-0', {
  variants: {
    density: {
      compact: 'px-2 py-1',
      comfortable: 'px-4 py-2',
      spacious: 'px-6 py-4',
    },
  },
  defaultVariants: {
    density: 'comfortable',
  },
});

export const SRT_TableBodyCell = <TData extends SRT_RowData>({
  cell,
  table,
}: SRT_TableBodyCellProps<TData>) => {
  const { density } = table.getState();

  return (
    <td className={cn(cellVariants({ density }))}>
      {cell.renderValue() as ReactNode}
    </td>
  );
};
