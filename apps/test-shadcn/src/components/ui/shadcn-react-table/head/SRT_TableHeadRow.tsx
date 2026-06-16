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
