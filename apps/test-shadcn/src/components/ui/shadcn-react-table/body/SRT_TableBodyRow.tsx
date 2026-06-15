import {
  type CSSProperties,
  type DragEvent,
  memo,
  useMemo,
  useRef,
} from 'react';
import {
  getIsRowSelected,
  mergeSRT_HtmlProps,
  parseSRT_HtmlProps,
  type SRT_Cell,
  type SRT_ColumnVirtualizer,
  type SRT_Row,
  type SRT_RowData,
  type SRT_RowVirtualizer,
  type SRT_TableInstance,
  type SRT_VirtualItem,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_TableBodyCell, Memo_SRT_TableBodyCell } from './SRT_TableBodyCell';
import { SRT_TableDetailPanel } from './SRT_TableDetailPanel';

export interface SRT_TableBodyRowProps<TData extends SRT_RowData> {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  numRows?: number;
  pinnedRowIds?: string[];
  row: SRT_Row<TData>;
  rowVirtualizer?: SRT_RowVirtualizer;
  staticRowIndex: number;
  table: SRT_TableInstance<TData>;
  virtualRow?: SRT_VirtualItem;
  className?: string;
}

/**
 * Table body row - renders a single data row plus its optional detail panel.
 *
 * Ports material-react-table's MRT_TableBodyRow:
 * - Selection (data-state=selected) and hover styling
 * - Row pinning (sticky top/bottom offsets, dimmed opacity)
 * - Row drag/reorder hover tracking (enableRowOrdering)
 * - Row + column virtualization (translateY, virtual padding spacers,
 *   measureElement)
 * - memoMode === 'cells' memoization dispatch
 * - Striped rows via data-static-index parity
 * - Detail panel rendering for non-grouped rows
 *
 * MUI's theme color math (alpha/lighten/darken backgrounds) is replaced with
 * Tailwind tokens (muted / accent) and data attributes for consumer styling.
 */
export const SRT_TableBodyRow = <TData extends SRT_RowData>({
  columnVirtualizer,
  numRows,
  pinnedRowIds,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
  className,
}: SRT_TableBodyRowProps<TData>) => {
  const {
    getState,
    options: {
      enableRowOrdering,
      enableRowPinning,
      enableStickyFooter,
      enableStickyHeader,
      memoMode,
      renderDetailPanel,
      rowPinningDisplayMode,
      srtTableBodyRowProps,
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
  } = getState();

  const visibleCells = row.getVisibleCells();

  const { virtualColumns, virtualPaddingLeft, virtualPaddingRight } =
    columnVirtualizer ?? {};

  const isRowSelected = getIsRowSelected({ row, table });
  const isRowPinned = enableRowPinning && row.getIsPinned();
  const isDraggingRow = draggingRow?.id === row.id;
  const isHoveredRow = hoveredRow?.id === row.id;

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
  }, [pinnedRowIds, rowPinning]);

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0;
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

  const defaultRowHeight =
    density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69;
  const rowHeight = defaultRowHeight;

  const handleDragEnter = (_e: DragEvent) => {
    if (enableRowOrdering && draggingRow) {
      setHoveredRow(row);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const rowRef = useRef<HTMLTableRowElement | null>(null);

  const rowStyle: CSSProperties = {
    transform: virtualRow ? `translateY(${virtualRow.start}px)` : undefined,
    position: virtualRow
      ? 'absolute'
      : rowPinningDisplayMode?.includes('sticky') && isRowPinned
        ? 'sticky'
        : 'relative',
    width: '100%',
    boxSizing: 'border-box',
    opacity: isRowPinned ? 0.97 : isDraggingRow || isHoveredRow ? 0.5 : 1,
    transition: virtualRow ? 'none' : 'all 150ms ease-in-out',
    zIndex: rowPinningDisplayMode?.includes('sticky') && isRowPinned ? 2 : 0,
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
  };

  // Compose the component's own row DOM attrs (library = `a`) with the
  // user-supplied `srtTableBodyRowProps` (`b`); handlers fire library-then-user,
  // style/className compose. className gets final tailwind dedup via cn() below.
  const userRowProps = parseSRT_HtmlProps(srtTableBodyRowProps, {
    row,
    staticRowIndex,
    table,
  });
  const rowProps = mergeSRT_HtmlProps(
    {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      style: rowStyle,
    },
    userRowProps,
  );

  return (
    <>
      <tr
        data-index={renderDetailPanel ? staticRowIndex * 2 : staticRowIndex}
        data-pinned={!!isRowPinned || undefined}
        data-selected={isRowSelected || undefined}
        data-state={isRowSelected ? 'selected' : undefined}
        {...rowProps}
        ref={(node: HTMLTableRowElement | null) => {
          if (node) {
            rowRef.current = node;
            rowVirtualizer?.measureElement(node);
          }
        }}
        className={cn(
          'border-b transition-colors hover:bg-muted/50',
          'data-[state=selected]:bg-muted',
          isRowPinned && 'bg-accent/40',
          className,
          rowProps?.className,
        )}
      >
        {virtualPaddingLeft ? (
          <td style={{ display: 'flex', width: virtualPaddingLeft }} />
        ) : null}
        {(virtualColumns ?? visibleCells).map(
          (cellOrVirtualCell, staticColumnIndex) => {
            let cell = cellOrVirtualCell as SRT_Cell<TData>;
            if (columnVirtualizer) {
              staticColumnIndex = (cellOrVirtualCell as SRT_VirtualItem).index;
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
                <Memo_SRT_TableBodyCell key={key} {...props} />
              ) : (
                <SRT_TableBodyCell key={key} {...props} />
              )
            ) : null;
          },
        )}
        {virtualPaddingRight ? (
          <td style={{ display: 'flex', width: virtualPaddingRight }} />
        ) : null}
      </tr>
      {renderDetailPanel && !row.getIsGrouped() && (
        <SRT_TableDetailPanel
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

export const Memo_SRT_TableBodyRow = memo(
  SRT_TableBodyRow,
  (prev, next) =>
    prev.row === next.row && prev.staticRowIndex === next.staticRowIndex,
) as typeof SRT_TableBodyRow;
