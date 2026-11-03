import { type DragEvent, useRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_Cell,
  type ST_ColumnVirtualizer,
  type ST_Row,
  type ST_RowData,
  type ST_RowVirtualizer,
  type ST_VirtualItem,
  type TableRowProps,
} from '@/components/ui-radix/shadcn-table/types';
import { getIsRowSelected } from '@/components/ui-radix/shadcn-table/shared/utils/row.utils';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_TableBodyCell } from '@/components/ui-radix/shadcn-table/components/body/ST_TableBodyCell';
import { ST_TableDetailPanel } from '@/components/ui-radix/shadcn-table/components/body/ST_TableDetailPanel';

export interface ST_TableBodyRowProps<TData extends ST_RowData>
  extends TableRowProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
  /** false drops the hover background. Default true. */
  hover?: boolean;
  numRows?: number;
  pinnedRowIds?: string[];
  row: ST_Row<TData>;
  rowVirtualizer?: ST_RowVirtualizer;
  staticRowIndex: number;
  virtualRow?: ST_VirtualItem;
}

// The row paints its tint from the tokens the table root declares and every
// cell, pinned ones included, inherits it, so hover tints the row evenly.
// Strongest first: selection, pinning, stripe; hover beats the last two and a
// selected row has none.
const tableBodyRowVariants = cva('group/row box-border w-full', {
  variants: {
    hover: { false: '', true: 'hover:bg-(--st-hover)' },
    layout: { grid: 'flex', semantic: '' },
    tint: {
      none: 'bg-background',
      pinned: 'bg-[color-mix(in_srgb,var(--primary)_10%,var(--background))]',
      selected: 'bg-(--st-selected)',
      stripe: 'bg-(--st-stripe)',
    },
    position: {
      absolute: 'absolute',
      relative: 'relative',
      sticky: 'sticky',
    },
    zIndex: { base: 'z-0', high: 'z-2' },
  },
});

export const ST_TableBodyRow = <TData extends ST_RowData>({
  columnVirtualizer,
  numRows,
  pinnedRowIds,
  row,
  rowVirtualizer,
  staticRowIndex,
  virtualRow,
  ...rest
}: ST_TableBodyRowProps<TData>) => {
  const table = row.table;

  const {
    options: {
      enableRowOrdering,
      enableRowPinning,
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      stTableBodyRowProps,
      renderDetailPanel,
      rowPinningDisplayMode,
    },
    refs: { tableContainerRef, tableFooterRef, tableHeadRef },
    setHoveredRow,
  } = table;

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  const { hover = true, ...tableRowProps } = {
    ...parseFromValuesOrFunc(stTableBodyRowProps, {
      row,
      staticRowIndex,
      table,
    }),
    ...rest,
  };

  const customRowHeight =
    // @ts-expect-error style.height is string | number; parseInt expects a string
    parseInt(tableRowProps?.style?.height, 10) || undefined;

  const handleDragEnter = () => {
    if (enableRowOrdering && table.atoms.draggingRow.get()) {
      setHoveredRow(row);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const rowRef = useRef<HTMLTableRowElement | null>(null);

  // The cells and the detail panel are created outside the row's state
  // subscription, so a selection, hover or pinning change re-renders the row
  // element only. The cells follow the column layout slices themselves.
  const cells = (
    <table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        grouping: state.grouping,
      })}
    >
      {() => {
        const visibleCells = row.getVisibleCells();
        return (virtualColumns ?? visibleCells).map(
          (cellOrVirtualCell, staticColumnIndex) => {
            let cell = cellOrVirtualCell as ST_Cell<TData>;
            if (columnVirtualizer) {
              staticColumnIndex = (cellOrVirtualCell as ST_VirtualItem).index;
              cell = visibleCells[staticColumnIndex];
            }
            const props = {
              cell,
              numRows,
              rowRef,
              staticColumnIndex,
              staticRowIndex,
            };
            const key = `${cell.id}-${staticRowIndex}`;
            return cell ? <ST_TableBodyCell key={key} {...props} /> : null;
          },
        );
      }}
    </table.Subscribe>
  );

  const detailPanel = renderDetailPanel && !row.getIsGrouped() && (
    <ST_TableDetailPanel
      parentRowRef={rowRef}
      row={row}
      rowVirtualizer={rowVirtualizer}
      staticRowIndex={staticRowIndex}
      virtualRow={virtualRow}
    />
  );

  return (
    <table.Subscribe
      selector={(state) => ({
        density: state.density,
        isFullScreen: state.isFullScreen,
        // Reads the live selection, so only this row's own change re-renders it.
        isRowSelected: getIsRowSelected({ row, table }),
        rowPinning: state.rowPinning,
        stickyHeader: state.viewSettings.stickyHeader,
        striped: state.viewSettings.striped,
      })}
    >
      {({ density, isFullScreen, isRowSelected, stickyHeader, striped }) => {
        const isRowPinned = enableRowPinning && row.getIsPinned();

        const [bottomPinnedIndex, topPinnedIndex] =
          !enableRowPinning ||
          !rowPinningDisplayMode?.includes('sticky') ||
          !pinnedRowIds ||
          !row.getIsPinned()
            ? []
            : [
                [...pinnedRowIds].reverse().indexOf(row.id),
                pinnedRowIds.indexOf(row.id),
              ];

        const isStickyHeader = enableStickyHeader || stickyHeader;
        const tableHeadHeight =
          ((isStickyHeader || isFullScreen) &&
            tableHeadRef.current?.clientHeight) ||
          0;
        const tableFooterHeight =
          (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

        const defaultRowHeight =
          density === 'compact' ? 40 : density === 'comfortable' ? 48 : 56;

        const rowHeight = customRowHeight || defaultRowHeight;

        // With more sticky pinned rows than the scrollport holds, the bottom
        // inset pulls a row up over the head. Dropping it keeps the row at its
        // flow position below the head, sticking at the top inset on scroll.
        const pinnedStackOverflows =
          !!pinnedRowIds &&
          pinnedRowIds.length * rowHeight +
            (tableHeadRef.current?.clientHeight || 0) +
            tableFooterHeight >
            (tableContainerRef.current?.clientHeight ?? Infinity);

        const tint = isRowSelected
          ? 'selected'
          : isRowPinned
            ? 'pinned'
            : striped && staticRowIndex % 2 === 1
              ? 'stripe'
              : 'none';

        return (
          <>
            <tr
              data-index={
                renderDetailPanel ? staticRowIndex * 2 : staticRowIndex
              }
              data-pinned={!!isRowPinned || undefined}
              data-selected={isRowSelected || undefined}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              ref={(node: HTMLTableRowElement | null) => {
                if (node) {
                  rowRef.current = node;
                  rowVirtualizer?.measureElement(node);
                }
              }}
              {...tableRowProps}
              style={{
                transform: virtualRow
                  ? `translateY(${virtualRow.start}px)`
                  : undefined,
                top: virtualRow
                  ? 0
                  : topPinnedIndex !== undefined && isRowPinned
                    ? `${
                        topPinnedIndex * rowHeight +
                        (isStickyHeader || isFullScreen
                          ? tableHeadHeight - 1
                          : 0)
                      }px`
                    : undefined,
                bottom:
                  !virtualRow &&
                  !pinnedStackOverflows &&
                  bottomPinnedIndex !== undefined &&
                  isRowPinned
                    ? `${
                        bottomPinnedIndex * rowHeight +
                        (enableStickyFooter ? tableFooterHeight - 1 : 0)
                      }px`
                    : undefined,
                ...tableRowProps?.style,
              }}
              className={cn(
                tableBodyRowVariants({
                  hover: hover && !isRowSelected,
                  layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
                  position: virtualRow
                    ? 'absolute'
                    : rowPinningDisplayMode?.includes('sticky') && isRowPinned
                      ? 'sticky'
                      : 'relative',
                  tint,
                  zIndex:
                    rowPinningDisplayMode?.includes('sticky') && isRowPinned
                      ? 'high'
                      : 'base',
                }),
                tableRowProps?.className,
              )}
            >
              {virtualPaddingLeft ? (
                <td style={{ display: 'flex', width: virtualPaddingLeft }} />
              ) : null}
              {cells}
              {virtualPaddingRight ? (
                <td style={{ display: 'flex', width: virtualPaddingRight }} />
              ) : null}
            </tr>
            {detailPanel}
          </>
        );
      }}
    </table.Subscribe>
  );
};
