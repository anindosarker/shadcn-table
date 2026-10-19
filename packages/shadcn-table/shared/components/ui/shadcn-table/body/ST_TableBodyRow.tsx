import { type DragEvent, memo, useMemo, useRef } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_Cell,
  type ST_ColumnVirtualizer,
  type ST_Row,
  type ST_RowData,
  type ST_RowVirtualizer,
  type ST_TableInstance,
  type ST_VirtualItem,
  type TableRowProps,
} from '@/components/ui/shadcn-table/types';
import { getIsRowSelected } from '@/components/ui/shadcn-table/utils/row.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import {
  ST_TableBodyCell,
  Memo_ST_TableBodyCell,
} from '@/components/ui/shadcn-table/body/ST_TableBodyCell';
import { ST_TableDetailPanel } from '@/components/ui/shadcn-table/body/ST_TableDetailPanel';

export interface ST_TableBodyRowProps<TData extends ST_RowData>
  extends TableRowProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
  /** MUI TableRow `hover`: false drops the hover background. Default true. */
  hover?: boolean;
  numRows?: number;
  pinnedRowIds?: string[];
  row: ST_Row<TData>;
  rowVirtualizer?: ST_RowVirtualizer;
  staticRowIndex: number;
  table: ST_TableInstance<TData>;
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
  table,
  virtualRow,
  ...rest
}: ST_TableBodyRowProps<TData>) => {
  // const theme = useTheme();
  // Note: MUI useTheme dropped project-wide — shadcn CSS vars handle theming.

  const {
    options: {
      enableRowOrdering,
      enableRowPinning,
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      memoMode,
      // mrtTheme: {
      //   baseBackgroundColor,
      //   pinnedRowBackgroundColor,
      //   selectedRowBackgroundColor,
      // },
      // Note: mrtTheme registry dropped project-wide — bg-background / primary tokens.
      stTableBodyRowProps,
      renderDetailPanel,
      rowPinningDisplayMode,
    },
    refs: { tableFooterRef, tableHeadRef },
    setHoveredRow,
  } = table;
  const {
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    hoveredRow,
    isFullScreen,
    rowPinning,
  } = table.state;

  const visibleCells = row.getVisibleCells();

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  const isRowSelected = getIsRowSelected({ row, table });
  const isRowPinned = enableRowPinning && row.getIsPinned();
  const isDraggingRow = draggingRow?.id === row.id;
  const isHoveredRow = hoveredRow?.id === row.id;

  const { hover = true, ...tableRowProps } = {
    ...parseFromValuesOrFunc(stTableBodyRowProps, {
      row,
      staticRowIndex,
      table,
    }),
    ...rest,
  };

  const [bottomPinnedIndex, topPinnedIndex] = useMemo(() => {
    if (
      !enableRowPinning ||
      !rowPinningDisplayMode?.includes('sticky') ||
      !pinnedRowIds ||
      !row.getIsPinned()
    )
      return [];
    return [
      [...pinnedRowIds].reverse().indexOf(row.id),
      pinnedRowIds.indexOf(row.id),
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedRowIds, rowPinning]);

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0;
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

  // const sx = parseFromValuesOrFunc(tableRowProps?.sx, theme as any);
  // Note: no MUI sx in ST; customRowHeight drops MRT's `?? sx?.height` fallback.

  const defaultRowHeight =
    density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69;

  const customRowHeight =
    // @ts-expect-error style.height is string | number; parseInt expects a string
    parseInt(tableRowProps?.style?.height, 10) || undefined;

  const rowHeight = customRowHeight || defaultRowHeight;

  const handleDragEnter = () => {
    if (enableRowOrdering && draggingRow) {
      setHoveredRow(row);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const rowRef = useRef<HTMLTableRowElement | null>(null);

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
        data-index={renderDetailPanel ? staticRowIndex * 2 : staticRowIndex}
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
        // selected={isRowSelected}
        // Note: MUI TableRow prop; data-selected + the td:after overlay carry selection.
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
                  (enableStickyHeader || isFullScreen ? tableHeadHeight - 1 : 0)
                }px`
              : undefined,
          bottom:
            !virtualRow && bottomPinnedIndex !== undefined && isRowPinned
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
        {(virtualColumns ?? visibleCells).map(
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
              table,
            };
            const key = `${cell.id}-${staticRowIndex}`;
            return cell ? (
              memoMode === 'cells' &&
              cell.column.columnDef.columnDefType === 'data' &&
              !draggingColumn &&
              !draggingRow &&
              editingCell?.id !== cell.id &&
              editingRow?.id !== row.id ? (
                <Memo_ST_TableBodyCell key={key} {...props} />
              ) : (
                <ST_TableBodyCell key={key} {...props} />
              )
            ) : null;
          },
        )}
        {virtualPaddingRight ? (
          <td style={{ display: 'flex', width: virtualPaddingRight }} />
        ) : null}
      </tr>
      {renderDetailPanel && !row.getIsGrouped() && (
        <ST_TableDetailPanel
          parentRowRef={rowRef}
          row={row}
          rowVirtualizer={rowVirtualizer}
          staticRowIndex={staticRowIndex}
          table={table}
          virtualRow={virtualRow}
        />
      )}
    </>
  );
};

export const Memo_ST_TableBodyRow = memo(
  ST_TableBodyRow,
  (prev, next) =>
    prev.row === next.row && prev.staticRowIndex === next.staticRowIndex,
) as typeof ST_TableBodyRow;
