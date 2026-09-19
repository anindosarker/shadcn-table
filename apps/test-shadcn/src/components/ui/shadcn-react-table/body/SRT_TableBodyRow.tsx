import { type DragEvent, memo, useMemo, useRef } from 'react';
import {
  getIsRowSelected,
  parseFromValuesOrFunc,
  type SRT_Cell,
  type SRT_ColumnVirtualizer,
  type SRT_Row,
  type SRT_RowData,
  type SRT_RowVirtualizer,
  type SRT_TableInstance,
  type SRT_VirtualItem,
  type TableRowProps,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_TableBodyCell, Memo_SRT_TableBodyCell } from './SRT_TableBodyCell';
import { SRT_TableDetailPanel } from './SRT_TableDetailPanel';

export interface SRT_TableBodyRowProps<TData extends SRT_RowData>
  extends TableRowProps {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  numRows?: number;
  pinnedRowIds?: string[];
  row: SRT_Row<TData>;
  rowVirtualizer?: SRT_RowVirtualizer;
  staticRowIndex: number;
  table: SRT_TableInstance<TData>;
  virtualRow?: SRT_VirtualItem;
}

const tableBodyRowVariants = cva(
  'box-border w-full bg-background hover:bg-muted/50',
  {
    variants: {
      layout: { grid: 'flex', semantic: '' },
      opacity: { dimmed: 'opacity-50', normal: '', pinned: 'opacity-[0.97]' },
      position: {
        absolute: 'absolute',
        relative: 'relative',
        sticky: 'sticky',
      },
      selected: { false: '', true: 'bg-muted' },
      transition: {
        animated: 'transition-all duration-150 ease-in-out',
        none: '',
      },
      zIndex: { base: 'z-0', high: 'z-[2]' },
    },
  },
);

export const SRT_TableBodyRow = <TData extends SRT_RowData>({
  columnVirtualizer,
  numRows,
  pinnedRowIds,
  row,
  rowVirtualizer,
  staticRowIndex,
  table,
  virtualRow,
  ...rest
}: SRT_TableBodyRowProps<TData>) => {
  // const theme = useTheme();
  // Note: MUI useTheme dropped project-wide — shadcn CSS vars handle theming.

  const {
    getState,
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
      // Note: mrtTheme registry dropped project-wide — bg-background / bg-muted
      // handle theming.
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

  const tableRowProps = {
    ...parseFromValuesOrFunc(srtTableBodyRowProps, {
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
  // Note: no MUI sx in SRT; customRowHeight drops MRT's `?? sx?.height` fallback.

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

  // Note: td:after highlight overlays → solid row classes (bg-background / bg-muted / hover:bg-muted/50); see SRT_TableBodyRow.plan.md "Row highlight system".
  // const cellHighlightColor = isRowSelected
  //   ? selectedRowBackgroundColor
  //   : isRowPinned
  //     ? pinnedRowBackgroundColor
  //     : undefined;
  // const cellHighlightColorHover =
  //   tableRowProps?.hover !== false
  //     ? isRowSelected
  //       ? cellHighlightColor
  //       : theme.palette.mode === 'dark'
  //         ? `${lighten(baseBackgroundColor, 0.3)}`
  //         : `${darken(baseBackgroundColor, 0.3)}`
  //     : undefined;

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
        // Note: MUI TableRow prop; data-selected + the bg-muted variant carry selection.
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
            selected: isRowSelected,
            transition: virtualRow ? 'none' : 'animated',
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
