import type {
  SRT_ColumnVirtualizer,
  SRT_RowData,
  SRT_TableInstance,
} from 'shadcn-react-table-core';
import { parseSRT_HtmlProps } from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_ToolbarAlertBanner } from '../toolbar/SRT_ToolbarAlertBanner';
import { SRT_TableHeadRow } from './SRT_TableHeadRow';

export interface SRT_TableHeadProps<TData extends SRT_RowData> {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Table head - renders all header groups and rows.
 *
 * Ported 1:1 from MRT_TableHead:
 * - Sticky header when enableStickyHeader or full-screen.
 * - 'head-overlay' alert banner replaces the header rows when an alert is shown
 *   or rows are selected.
 * - Forwards the tableHeadRef and the column virtualizer to each head row.
 */

export const SRT_TableHead = <TData extends SRT_RowData>({
  columnVirtualizer,
  table,
  className,
}: SRT_TableHeadProps<TData>) => {
  const {
    getState,
    options: {
      enableStickyHeader,
      positionToolbarAlertBanner,
      srtTableHeadProps,
    },
    refs: { tableHeadRef },
  } = table;
  const { isFullScreen, showAlertBanner } = getState();

  const stickyHeader = enableStickyHeader || isFullScreen;

  const headProps = parseSRT_HtmlProps(srtTableHeadProps, { table });

  const showHeadOverlay =
    positionToolbarAlertBanner === 'head-overlay' &&
    (showAlertBanner || table.getSelectedRowModel().rows.length > 0);

  return (
    <thead
      ref={tableHeadRef}
      {...headProps}
      className={cn(
        'border-b bg-muted/50 opacity-[0.97]',
        stickyHeader ? 'sticky top-0 z-[2]' : 'relative',
        className,
        headProps?.className,
      )}
    >
      {showHeadOverlay ? (
        <tr>
          <th
            colSpan={table.getVisibleLeafColumns().length}
            style={{ padding: 0 }}
          >
            <SRT_ToolbarAlertBanner table={table} />
          </th>
        </tr>
      ) : (
        table
          .getHeaderGroups()
          .map((headerGroup) => (
            <SRT_TableHeadRow
              columnVirtualizer={columnVirtualizer}
              headerGroup={headerGroup}
              key={headerGroup.id}
              table={table}
            />
          ))
      )}
    </thead>
  );
};
