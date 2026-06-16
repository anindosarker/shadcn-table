import { type CSSProperties } from 'react';
import {
  mergeSRT_HtmlProps,
  parseFromValuesOrFunc,
  parseSRT_HtmlProps,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export interface SRT_TableFooterCellProps<TData extends SRT_RowData> {
  footer: SRT_Header<TData>;
  staticColumnIndex?: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

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
    options: {
      columnResizeDirection,
      enableColumnPinning,
      srtTableFooterCellProps,
    },
  } = table;
  const { density } = getState();
  const { column } = footer;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const align =
    columnDefType === 'group'
      ? 'center'
      : columnResizeDirection === 'rtl'
        ? 'right'
        : 'left';

  const pinnedStyle: CSSProperties = isColumnPinned
    ? {
        position: 'sticky',
        left:
          isColumnPinned === 'left'
            ? `${column.getStart('left')}px`
            : undefined,
        right:
          isColumnPinned === 'right'
            ? `${column.getAfter('right')}px`
            : undefined,
        zIndex: 1,
      }
    : {};

  const tableFooterCellProps = parseSRT_HtmlProps(srtTableFooterCellProps, {
    column,
    table,
  });
  const columnFooterCellProps = parseSRT_HtmlProps(
    columnDef.srtTableFooterCellProps,
    { column, table },
  );
  const userFooterCellProps = mergeSRT_HtmlProps(
    tableFooterCellProps,
    columnFooterCellProps,
  );
  const mergedFooterCellProps = mergeSRT_HtmlProps(
    { style: { textAlign: align, ...pinnedStyle } as CSSProperties },
    userFooterCellProps,
  );

  return (
    <th
      colSpan={footer.colSpan}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      {...mergedFooterCellProps}
      className={cn(
        footerCellVariants({ density }),
        isColumnPinned && 'bg-muted/95',
        className,
        mergedFooterCellProps?.className,
      )}
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
