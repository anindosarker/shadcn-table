import {
  type SRT_ColumnVirtualizer,
  type SRT_Header,
  type SRT_HeaderGroup,
  type SRT_RowData,
  type SRT_TableInstance,
  type SRT_VirtualItem,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_TableFooterCell } from './SRT_TableFooterCell';

export interface SRT_TableFooterRowProps<TData extends SRT_RowData> {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  footerGroup: SRT_HeaderGroup<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Table footer row component - renders a row of footer cells
 *
 * Barebones implementation:
 * - Renders footer cells
 * - Skips row if no content
 * - Border styling
 *
 * TODO (Future enhancements):
 * - Add column virtualization support
 * - Add srtTableFooterRowProps support
 * - Add custom styling options
 * - Add hover effects
 */

export const SRT_TableFooterRow = <TData extends SRT_RowData>({
  columnVirtualizer,
  footerGroup,
  table,
  className,
}: SRT_TableFooterRowProps<TData>) => {
  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  // If no content in row, skip row
  if (
    !footerGroup.headers?.some(
      (header) =>
        (typeof header.column.columnDef.footer === 'string' &&
          !!header.column.columnDef.footer) ||
        header.column.columnDef.Footer,
    )
  ) {
    return null;
  }

  return (
    <tr className={cn('relative border-b', className)}>
      {virtualPaddingLeft ? (
        <th style={{ display: 'flex', width: virtualPaddingLeft }} />
      ) : null}
      {(virtualColumns ?? footerGroup.headers).map(
        (footerOrVirtualFooter, staticColumnIndex) => {
          let footer = footerOrVirtualFooter as SRT_Header<TData>;
          if (columnVirtualizer) {
            staticColumnIndex = (footerOrVirtualFooter as SRT_VirtualItem)
              .index;
            footer = footerGroup.headers[staticColumnIndex];
          }

          return footer ? (
            <SRT_TableFooterCell
              footer={footer}
              key={footer.id}
              staticColumnIndex={staticColumnIndex}
              table={table}
            />
          ) : null;
        },
      )}
      {virtualPaddingRight ? (
        <th style={{ display: 'flex', width: virtualPaddingRight }} />
      ) : null}
    </tr>
  );
};
