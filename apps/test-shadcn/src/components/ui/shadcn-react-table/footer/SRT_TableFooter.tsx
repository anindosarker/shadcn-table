import {
  parseSRT_HtmlProps,
  type SRT_ColumnVirtualizer,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_TableFooterRow } from './SRT_TableFooterRow';

export interface SRT_TableFooterProps<TData extends SRT_RowData> {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  table: SRT_TableInstance<TData>;
  className?: string;
}

export const SRT_TableFooter = <TData extends SRT_RowData>({
  columnVirtualizer,
  table,
  className,
}: SRT_TableFooterProps<TData>) => {
  const {
    getState,
    options: { enableStickyFooter, srtTableFooterProps },
    refs: { tableFooterRef },
  } = table;
  const { isFullScreen } = getState();

  const footerProps = parseSRT_HtmlProps(srtTableFooterProps, { table });

  const stickFooter =
    (isFullScreen || enableStickyFooter) && enableStickyFooter !== false;

  const footerGroups = table.getFooterGroups();

  //if no footer cells at all, skip footer
  if (
    !footerGroups.some((footerGroup) =>
      footerGroup.headers?.some(
        (header) =>
          (typeof header.column.columnDef.footer === 'string' &&
            !!header.column.columnDef.footer) ||
          header.column.columnDef.Footer,
      ),
    )
  ) {
    return null;
  }

  return (
    <tfoot
      ref={tableFooterRef}
      {...footerProps}
      className={cn(
        'relative border-t',
        stickFooter && 'sticky bottom-0 z-[1] opacity-97 bg-background',
        className,
        footerProps?.className,
      )}
    >
      {footerGroups.map((footerGroup) => (
        <SRT_TableFooterRow
          columnVirtualizer={columnVirtualizer}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          footerGroup={footerGroup as any}
          key={footerGroup.id}
          table={table}
        />
      ))}
    </tfoot>
  );
};
