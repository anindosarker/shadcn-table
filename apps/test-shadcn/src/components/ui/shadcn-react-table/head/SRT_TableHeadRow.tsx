import type {
  SRT_ColumnVirtualizer,
  SRT_Header,
  SRT_HeaderGroup,
  SRT_RowData,
  SRT_TableInstance,
  SRT_VirtualItem,
} from 'shadcn-react-table-core';
import { parseSRT_HtmlProps } from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_TableHeadCell } from './SRT_TableHeadCell';

export interface SRT_TableHeadRowProps<TData extends SRT_RowData> {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  headerGroup: SRT_HeaderGroup<TData>;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Table head row - renders a single header row with all its cells.
 *
 * Ported 1:1 from MRT_TableHeadRow:
 * - Maps virtual columns when a column virtualizer is provided, resolving the
 *   real header by its virtual index; otherwise maps headerGroup.headers.
 * - Emits virtual left/right padding spacer cells.
 * - Sticky header positioning is handled by the parent thead.
 */

export const SRT_TableHeadRow = <TData extends SRT_RowData>({
  columnVirtualizer,
  headerGroup,
  table,
  className,
}: SRT_TableHeadRowProps<TData>) => {
  const {
    options: { enableStickyHeader, layoutMode, srtTableHeadRowProps },
  } = table;

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  const isGrid = layoutMode?.startsWith('grid');

  const rowProps = parseSRT_HtmlProps(srtTableHeadRowProps, {
    headerGroup,
    table,
  });

  return (
    <tr
      {...rowProps}
      className={cn(
        'border-b bg-background shadow-[4px_0_8px_rgba(0,0,0,0.1)]',
        // Grid layout renders the head row as a flexbox; semantic sticky
        // headers stay sticky, everything else is relative (mirrors MRT).
        isGrid ? 'flex' : '',
        enableStickyHeader && layoutMode === 'semantic'
          ? 'sticky top-0'
          : 'relative top-0',
        className,
        rowProps?.className,
      )}
    >
      {virtualPaddingLeft ? (
        <th style={{ display: 'flex', width: virtualPaddingLeft }} />
      ) : null}
      {(virtualColumns ?? headerGroup.headers).map(
        (headerOrVirtualHeader, staticColumnIndex) => {
          let header = headerOrVirtualHeader as SRT_Header<TData>;
          if (columnVirtualizer) {
            staticColumnIndex = (headerOrVirtualHeader as SRT_VirtualItem)
              .index;
            header = headerGroup.headers[staticColumnIndex];
          }

          return header ? (
            <SRT_TableHeadCell
              columnVirtualizer={columnVirtualizer}
              header={header}
              key={header.id}
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
