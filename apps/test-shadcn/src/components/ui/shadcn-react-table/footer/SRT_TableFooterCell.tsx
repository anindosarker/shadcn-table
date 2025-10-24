import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export interface SRT_TableFooterCellProps<TData extends SRT_RowData> {
  footer: SRT_Header<TData>;
  staticColumnIndex?: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Table footer cell component - renders individual footer cell
 *
 * Barebones implementation:
 * - Renders footer content from columnDef
 * - Supports Footer component or string footer
 * - Density-based padding
 * - Bold text styling
 * - Column pinning styles
 *
 * TODO (Future enhancements):
 * - Add keyboard shortcuts for copy
 * - Add srtTableFooterCellProps support
 * - Add hover effects
 * - Add click to copy
 * - Better pinning styles
 */

const footerCellVariants = cva(
  'text-left align-top font-bold text-muted-foreground',
  {
    variants: {
      density: {
        compact: 'p-2',
        comfortable: 'p-4',
        spacious: 'p-6',
      },
    },
    defaultVariants: {
      density: 'comfortable',
    },
  },
);

export const SRT_TableFooterCell = <TData extends SRT_RowData>({
  footer,
  staticColumnIndex,
  table,
  className,
}: SRT_TableFooterCellProps<TData>) => {
  const {
    getState,
    options: { enableColumnPinning },
  } = table;
  const { density } = getState();
  const { column } = footer;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  // TODO: Add keyboard shortcuts
  // const handleKeyDown = (event: React.KeyboardEvent<HTMLTableCellElement>) => {
  //   cellKeyboardShortcuts({
  //     event,
  //     cellValue: footer.column.columnDef.footer,
  //     table,
  //   });
  // };

  const align = columnDefType === 'group' ? 'center' : 'left';

  return (
    <th
      colSpan={footer.colSpan}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      style={{ textAlign: align }}
      className={cn(footerCellVariants({ density }), className)}
      // onKeyDown={handleKeyDown}
      // tabIndex={enableKeyboardShortcuts ? 0 : undefined}
    >
      {footer.isPlaceholder
        ? null
        : (parseFromValuesOrFunc(columnDef.Footer, {
            column,
            footer,
            table,
          }) ??
          columnDef.footer ??
          null)}
    </th>
  );
};
