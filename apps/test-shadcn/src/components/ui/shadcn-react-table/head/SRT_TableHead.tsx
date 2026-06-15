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
      layoutMode,
      positionToolbarAlertBanner,
      srtTableHeadProps,
    },
    refs: { tableHeadRef },
  } = table;
  const { isFullScreen, showAlertBanner } = getState();

  const stickyHeader = enableStickyHeader || isFullScreen;
  const isGrid = layoutMode?.startsWith('grid');

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
        stickyHeader ? 'sticky z-[2]' : 'relative',
        className,
        headProps?.className,
      )}
      // Grid layout + sticky offset mirror MRT_TableHead's sx: `display: grid`
      // when layoutMode is grid, and `top: 0` only in the grid+sticky case
      // (semantic sticky offset is handled by the `sticky top-0` classes).
      style={{
        display: isGrid ? 'grid' : undefined,
        top: stickyHeader ? 0 : undefined,
        ...headProps?.style,
      }}
    >
      {showHeadOverlay ? (
        <tr style={{ display: isGrid ? 'grid' : undefined }}>
          <th
            colSpan={table.getVisibleLeafColumns().length}
            style={{ display: isGrid ? 'grid' : undefined, padding: 0 }}
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
