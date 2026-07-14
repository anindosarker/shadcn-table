import {
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  isCellEditable,
  cellKeyboardShortcuts,
  getSRTCellWidthStyles,
  getSRTPinnedCellStyles,
  openEditingCell,
  parseFromValuesOrFunc,
  type SRT_Cell,
  type SRT_RowData,
  type SRT_TableInstance,
  type TdProps,
} from 'shadcn-react-table-core';
// import { useTheme } from '@mui/material/styles';
// Note: useTheme/mrtTheme dropped project-wide. MRT reads `theme.direction` for
// the `align` prop → replaced by the logical `text-start` class (rtl-safe);
// `theme.palette.grey[500]` → `var(--color-muted-foreground)`; and
// `mrtTheme.draggingBorderColor` → `var(--color-primary)`.
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { SRT_Tooltip } from '../SRT_Tooltip';
import { SRT_TableBodyCellValue } from './SRT_TableBodyCellValue';
import { SRT_TableBodyRowGrabHandle } from './SRT_TableBodyRowGrabHandle';
import { SRT_TableBodyRowPinButton } from './SRT_TableBodyRowPinButton';
import { SRT_CopyButton } from '../buttons/SRT_CopyButton';
import { SRT_ExpandButton } from '../buttons/SRT_ExpandButton';
import { SRT_ToggleRowActionMenuButton } from '../buttons/SRT_ToggleRowActionMenuButton';
import { SRT_SelectCheckbox } from '../inputs/SRT_SelectCheckbox';
import { SRT_EditCellTextField } from '../inputs/SRT_EditCellTextField';

export interface SRT_TableBodyCellProps<TData extends SRT_RowData>
  extends TdProps {
  cell: SRT_Cell<TData>;
  numRows?: number;
  rowRef: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex: number;
  table: SRT_TableInstance<TData>;
}

// Base folds getCommonMRTCellStyles' static pieces (backgroundColor inherit →
// bg-inherit — MRT's backgroundImage:inherit is moot here and intentionally
// dropped; position relative; the focus-visible navigation outline → ring
// token) plus MRT's sx `overflow: hidden` and the `&:hover { textOverflow: clip
// }` reveal. Density paddings / opacity / zIndex / pinned / layout / cursor are
// runtime-conditional in cn() below.
const bodyCellVariants = cva(
  'relative bg-inherit overflow-hidden text-start hover:text-clip focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
);

export const SRT_TableBodyCell = <TData extends SRT_RowData>({
  cell,
  numRows,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
  ...rest
}: SRT_TableBodyCellProps<TData>) => {
  // const theme = useTheme();
  const {
    getState,
    options: {
      columnResizeDirection,
      columnResizeMode,
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableClickToCopy,
      enableColumnOrdering,
      enableColumnPinning,
      enableColumnVirtualization,
      enableGrouping,
      enableKeyboardShortcuts,
      groupedColumnMode,
      layoutMode,
      // mrtTheme: { draggingBorderColor },
      // Note: mrtTheme registry dropped — draggingBorderColor → var(--color-primary).
      rowNumberDisplayMode,
      srtSkeletonProps,
      srtTableBodyCellProps,
    },
    setHoveredColumn,
  } = table;
  const {
    actionCell,
    columnSizingInfo,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    hoveredColumn,
    hoveredRow,
    isLoading,
    pagination,
    showSkeletons,
  } = getState();
  const { column, row } = cell;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const args = { cell, column, row, table };
  const tableCellProps = {
    ...parseFromValuesOrFunc(srtTableBodyCellProps, args),
    ...parseFromValuesOrFunc(columnDef.srtTableBodyCellProps, args),
    ...rest,
  };

  const skeletonProps = parseFromValuesOrFunc(srtSkeletonProps, {
    cell,
    column,
    row,
    table,
  });

  const [skeletonWidth, setSkeletonWidth] = useState(100);
  useEffect(() => {
    if ((!isLoading && !showSkeletons) || skeletonWidth !== 100) return;
    const size = column.getSize();
    setSkeletonWidth(
      columnDefType === 'display'
        ? size / 2
        : Math.round(Math.random() * (size - size / 3) + size / 3),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, showSkeletons]);

  const draggingBorders = useMemo(() => {
    const isDraggingColumn = draggingColumn?.id === column.id;
    const isHoveredColumn = hoveredColumn?.id === column.id;
    const isDraggingRow = draggingRow?.id === row.id;
    const isHoveredRow = hoveredRow?.id === row.id;
    const isFirstColumn = column.getIsFirstColumn();
    const isLastColumn = column.getIsLastColumn();
    const isLastRow = numRows && staticRowIndex === numRows - 1;
    const isResizingColumn = columnSizingInfo.isResizingColumn === column.id;
    const showResizeBorder =
      isResizingColumn && columnResizeMode === 'onChange';

    // Note: MRT appends `!important` to each border; React style objects can't
    // express it, so it is dropped — draggingBorders still win since they spread
    // last in the inline style.
    const borderStyle = showResizeBorder
      ? `2px solid var(--color-primary)`
      : isDraggingColumn || isDraggingRow
        ? `1px dashed var(--color-muted-foreground)`
        : isHoveredColumn || isHoveredRow || isResizingColumn
          ? `2px dashed var(--color-primary)`
          : undefined;

    if (showResizeBorder) {
      return columnResizeDirection === 'ltr'
        ? { borderRight: borderStyle }
        : { borderLeft: borderStyle };
    }

    return borderStyle
      ? {
          borderBottom:
            isDraggingRow || isHoveredRow || (isLastRow && !isResizingColumn)
              ? borderStyle
              : undefined,
          borderLeft:
            isDraggingColumn ||
            isHoveredColumn ||
            ((isDraggingRow || isHoveredRow) && isFirstColumn)
              ? borderStyle
              : undefined,
          borderRight:
            isDraggingColumn ||
            isHoveredColumn ||
            ((isDraggingRow || isHoveredRow) && isLastColumn)
              ? borderStyle
              : undefined,
          borderTop: isDraggingRow || isHoveredRow ? borderStyle : undefined,
        }
      : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    columnSizingInfo.isResizingColumn,
    draggingColumn,
    draggingRow,
    hoveredColumn,
    hoveredRow,
    staticRowIndex,
  ]);

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const isEditable = isCellEditable({ cell, table });

  const isEditing =
    isEditable &&
    !['custom', 'modal'].includes(editDisplayMode as string) &&
    (editDisplayMode === 'table' ||
      editingRow?.id === row.id ||
      editingCell?.id === cell.id) &&
    !row.getIsGrouped();

  const isCreating =
    isEditable && createDisplayMode === 'row' && creatingRow?.id === row.id;

  const showClickToCopyButton =
    (parseFromValuesOrFunc(enableClickToCopy, cell) === true ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === true) &&
    !['context-menu', false].includes(
      // @ts-expect-error enableClickToCopy may resolve to a string/false union
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell),
    );

  const isRightClickable = parseFromValuesOrFunc(enableCellActions, cell);

  const cellValueProps = {
    cell,
    table,
    staticColumnIndex,
    staticRowIndex,
  };

  const handleDoubleClick = (event: MouseEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDoubleClick?.(event);
    openEditingCell({ cell, table });
  };

  const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDragEnter?.(e);
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
    if (enableColumnOrdering && draggingColumn) {
      setHoveredColumn(
        columnDef.enableColumnOrdering !== false ? column : null,
      );
    }
  };

  const handleDragOver = (e: DragEvent<HTMLTableCellElement>) => {
    if (columnDef.enableColumnOrdering !== false) {
      e.preventDefault();
    }
  };

  const handleContextMenu = (e: MouseEvent<HTMLTableCellElement>) => {
    tableCellProps?.onContextMenu?.(e);
    if (isRightClickable) {
      e.preventDefault();
      table.setActionCell(cell);
      table.refs.actionCellRef.current = e.currentTarget;
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableCellElement>) => {
    tableCellProps?.onKeyDown?.(event);
    cellKeyboardShortcuts({
      cell,
      cellValue: cell.getValue<string>(),
      event,
      table,
    });
  };

  // SRT display-column body dispatch: core display defs are headless (core
  // cannot import app components), so the body controls MRT supplies via each
  // columnDef.Cell are dispatched here on column.id. Precedence — a user
  // columnDef.Cell wins first (handled by the caller's `?? this`), then id.
  const renderDisplayColumnCell = (): ReactNode => {
    switch (column.id) {
      case 'mrt-row-select':
        return (
          <SRT_SelectCheckbox
            row={row}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        );
      case 'mrt-row-expand': {
        const expandButton = (
          <SRT_ExpandButton
            row={row}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        );
        const subRowsLength = row.subRows?.length;
        if (groupedColumnMode === 'remove' && row.groupingColumnId) {
          return (
            <div className="flex flex-row items-center gap-1">
              {expandButton}
              <SRT_Tooltip
                side="right"
                title={
                  table.getColumn(row.groupingColumnId).columnDef
                    .header as ReactNode
                }
              >
                <span>{row.groupingValue as ReactNode}</span>
              </SRT_Tooltip>
              {!!subRowsLength && <span>({subRowsLength})</span>}
            </div>
          );
        }
        return (
          <>
            {expandButton}
            {columnDef.GroupedCell?.({ cell, column, row, table })}
          </>
        );
      }
      case 'mrt-row-numbers':
        return (
          ((rowNumberDisplayMode === 'static'
            ? (staticRowIndex || 0) +
              (pagination?.pageSize || 0) * (pagination?.pageIndex || 0)
            : row.index) ?? 0) + 1
        );
      case 'mrt-row-actions':
        return (
          <SRT_ToggleRowActionMenuButton
            cell={cell}
            row={row}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        );
      case 'mrt-row-drag':
        return (
          <SRT_TableBodyRowGrabHandle row={row} rowRef={rowRef} table={table} />
        );
      case 'mrt-row-pin':
        return <SRT_TableBodyRowPinButton row={row} table={table} />;
      case 'mrt-row-spacer':
        return null;
      default:
        return null;
    }
  };

  return (
    <td
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      {...tableCellProps}
      onKeyDown={handleKeyDown}
      onContextMenu={handleContextMenu}
      onDoubleClick={handleDoubleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      style={
        {
          ...getSRTCellWidthStyles({ column, table }),
          ...(isColumnPinned ? getSRTPinnedCellStyles({ column, table }) : {}),
          ...tableCellProps?.style,
          ...draggingBorders,
        } as CSSProperties
      }
      className={cn(
        bodyCellVariants(),
        layoutMode?.startsWith('grid') && 'flex items-center',
        // Density paddings — MRT's exact rem values, display vs data/group.
        density === 'compact'
          ? columnDefType === 'display'
            ? 'px-2 py-0'
            : 'p-2'
          : density === 'comfortable'
            ? columnDefType === 'display'
              ? 'px-3 py-2'
              : 'p-4'
            : columnDefType === 'display'
              ? 'px-5 py-4'
              : 'p-6',
        columnDefType !== 'display' && 'text-ellipsis',
        row.getIsPinned() || density === 'compact'
          ? 'whitespace-nowrap'
          : 'whitespace-normal',
        isRightClickable
          ? 'cursor-context-menu'
          : isEditable && editDisplayMode === 'cell'
            ? 'cursor-pointer'
            : undefined,
        // getCommonMRTCellStyles: dragging/hovered column → opacity-50. Ordered
        // before pinned so twMerge lets pinned opacity-[0.97] win when both hold.
        (draggingColumn?.id === column.id || hoveredColumn?.id === column.id) &&
          'opacity-50',
        !enableColumnVirtualization &&
          'transition-[padding] duration-150 ease-in-out',
        column.getIsResizing() || draggingColumn?.id === column.id
          ? 'z-[2]'
          : columnDefType !== 'group' && isColumnPinned
            ? 'z-[1]'
            : 'z-0',
        // Pinned cell owns its bg (June deviation); 0.97 opacity spread after so
        // it wins, matching getCommonMRTCellStyles' pinnedStyles order.
        isColumnPinned && 'bg-background opacity-[0.97]',
        actionCell?.id === cell.id &&
          'outline outline-1 -outline-offset-1 outline-muted-foreground',
        (actionCell?.id === cell.id ||
          (editDisplayMode === 'cell' && isEditable) ||
          (editDisplayMode === 'table' && (isCreating || isEditing))) &&
          'hover:outline hover:outline-1 hover:outline-muted-foreground',
        tableCellProps?.className,
      )}
    >
      {tableCellProps.children ?? (
        <>
          {cell.getIsPlaceholder() ? (
            (columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null)
          ) : showSkeletons !== false && (isLoading || showSkeletons) ? (
            // Note: MUI Skeleton's animation="wave" has no Tailwind analogue —
            // Skeleton's default animate-pulse is the accepted stand-in.
            // Note: dropped bg-muted — Skeleton's default bg-accent wins.
            <Skeleton
              {...skeletonProps}
              style={{
                height: 20,
                width: skeletonWidth,
                ...skeletonProps?.style,
              }}
            />
          ) : columnDefType === 'display' &&
            (['mrt-row-expand', 'mrt-row-numbers', 'mrt-row-select'].includes(
              column.id,
            ) ||
              !row.getIsGrouped()) ? (
            (columnDef.Cell?.({
              cell,
              column,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderedCellValue: cell.renderValue() as any,
              row,
              rowRef,
              staticColumnIndex,
              staticRowIndex,
              table,
            }) ?? renderDisplayColumnCell())
          ) : isCreating || isEditing ? (
            <SRT_EditCellTextField cell={cell} table={table} />
          ) : showClickToCopyButton && columnDef.enableClickToCopy !== false ? (
            <SRT_CopyButton cell={cell} table={table}>
              <SRT_TableBodyCellValue {...cellValueProps} />
            </SRT_CopyButton>
          ) : (
            <SRT_TableBodyCellValue {...cellValueProps} />
          )}
          {cell.getIsGrouped() && !columnDef.GroupedCell && (
            <> ({row.subRows?.length})</>
          )}
        </>
      )}
    </td>
  );
};

export const Memo_SRT_TableBodyCell = memo(
  SRT_TableBodyCell,
  (prev, next) => next.cell === prev.cell,
) as typeof SRT_TableBodyCell;
