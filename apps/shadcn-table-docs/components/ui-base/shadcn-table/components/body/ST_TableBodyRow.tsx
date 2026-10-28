import { type DragEvent, useRef } from 'react';
import { Subscribe } from '@tanstack/react-table';
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
} from '@/components/ui-base/shadcn-table/types';
import { getIsRowSelected } from '@/components/ui-base/shadcn-table/shared/utils/row.utils';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_TableBodyCell } from '@/components/ui-base/shadcn-table/components/body/ST_TableBodyCell';
import { ST_TableDetailPanel } from '@/components/ui-base/shadcn-table/components/body/ST_TableDetailPanel';

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

const tableBodyRowVariants = cva(
  "box-border w-full bg-background [&>td]:after:absolute [&>td]:after:inset-0 [&>td]:after:-z-10 [&>td]:after:content-['']",
  {
    variants: {
      layout: { grid: 'flex', semantic: '' },
      opacity: { dimmed: 'opacity-50', normal: '', pinned: 'opacity-[0.97]' },
      position: {
        absolute: 'absolute',
        relative: 'relative',
        sticky: 'sticky',
      },
      transition: {
        animated: 'transition-all duration-150 ease-in-out',
        none: '',
      },
      zIndex: { base: 'z-0', high: 'z-[2]' },
    },
  },
);

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
    <Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        grouping: state.grouping,
      })}
      source={table.store}
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
    </Subscribe>
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
    <Subscribe
      selector={(state) => ({
        density: state.density,
        isDraggingRow: state.draggingRow?.id === row.id,
        isFullScreen: state.isFullScreen,
        isHoveredRow: state.hoveredRow?.id === row.id,
        // Reads the live selection, so only this row's own change re-renders it.
        isRowSelected: getIsRowSelected({ row, table }),
        rowPinning: state.rowPinning,
      })}
      source={table.store}
    >
      {({
        density,
        isDraggingRow,
        isFullScreen,
        isHoveredRow,
        isRowSelected,
      }) => {
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

        const tableHeadHeight =
          ((enableStickyHeader || isFullScreen) &&
            tableHeadRef.current?.clientHeight) ||
          0;
        const tableFooterHeight =
          (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

        const defaultRowHeight =
          density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69;

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

        const cellHighlightClass = isRowSelected
          ? '[&>td]:after:bg-primary/20'
          : isRowPinned
            ? '[&>td]:after:bg-primary/10'
            : undefined;

        const cellHighlightClassHover = !hover
          ? undefined
          : isRowSelected
            ? 'hover:[&>td]:after:bg-primary/20'
            : 'hover:[&>td]:after:bg-foreground/10';

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
                        (enableStickyHeader || isFullScreen
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
                  layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
                  opacity: isRowPinned
                    ? 'pinned'
                    : isDraggingRow || isHoveredRow
                      ? 'dimmed'
                      : 'normal',
                  position: virtualRow
                    ? 'absolute'
                    : rowPinningDisplayMode?.includes('sticky') && isRowPinned
                      ? 'sticky'
                      : 'relative',
                  transition: virtualRow ? 'none' : 'animated',
                  zIndex:
                    rowPinningDisplayMode?.includes('sticky') && isRowPinned
                      ? 'high'
                      : 'base',
                }),
                cellHighlightClass,
                cellHighlightClassHover,
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
    </Subscribe>
  );
};
