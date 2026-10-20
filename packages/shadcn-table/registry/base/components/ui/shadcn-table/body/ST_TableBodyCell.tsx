import {
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react';
// import { useTheme } from '@mui/material/styles';
// Note: useTheme dropped — align->text-start, grey[500]->muted-foreground, draggingBorderColor->primary.
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  type ST_Cell,
  type ST_RowData,
  type ST_TableInstance,
  type TableCellProps,
} from '@/components/ui/shadcn-table/types';
import {
  isCellEditable,
  cellKeyboardShortcuts,
  openEditingCell,
} from '@/components/ui/shadcn-table/utils/cell.utils';
import { getCommonSRTCellStyles } from '@/components/ui/shadcn-table/utils/style.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_TableBodyCellValue } from '@/components/ui/shadcn-table/body/ST_TableBodyCellValue';
import { ST_CopyButton } from '@/components/ui/shadcn-table/buttons/ST_CopyButton';
import { ST_EditCellTextField } from '@/components/ui/shadcn-table/inputs/ST_EditCellTextField';

export interface ST_TableBodyCellProps<TData extends ST_RowData>
  extends TableCellProps {
  cell: ST_Cell<TData>;
  numRows?: number;
  rowRef: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex: number;
  table: ST_TableInstance<TData>;
}

const bodyCellVariants = cva(
  'border-b text-sm overflow-hidden -outline-offset-1 hover:text-clip',
);

export const ST_TableBodyCell = <TData extends ST_RowData>({
  cell,
  numRows,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  table,
  ...rest
}: ST_TableBodyCellProps<TData>) => {
  // const theme = useTheme();
  const {
    options: {
      columnResizeDirection,
      columnResizeMode,
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableClickToCopy,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableKeyboardShortcuts,
      layoutMode,
      // mrtTheme: { draggingBorderColor },
      // Note: mrtTheme registry dropped — draggingBorderColor → var(--color-primary).
      stSkeletonProps,
      stTableBodyCellProps,
    },
    setHoveredColumn,
  } = table;
  const {
    actionCell,
    columnResizing,
    creatingRow,
    density,
    draggingColumn,
    draggingRow,
    editingCell,
    editingRow,
    hoveredColumn,
    hoveredRow,
    isLoading,
    showSkeletons,
  } = table.state;
  const { column, row } = cell;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const args = { cell, column, row, table };
  const tableCellProps = {
    ...parseFromValuesOrFunc(stTableBodyCellProps, args),
    ...parseFromValuesOrFunc(columnDef.stTableBodyCellProps, args),
    ...rest,
  };

  const skeletonProps = parseFromValuesOrFunc(stSkeletonProps, {
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
    const isResizingColumn = columnResizing.isResizingColumn === column.id;
    const showResizeBorder =
      isResizingColumn && columnResizeMode === 'onChange';

    // Note: MRT's `!important` dropped — React style objects can't express it; draggingBorders spread last anyway.
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
    columnResizing.isResizingColumn,
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

  const commonCellStyles = getCommonSRTCellStyles({
    column,
    table,
    tableCellProps,
  });

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
      style={{
        ...commonCellStyles.style,
        ...draggingBorders,
      }}
      className={cn(
        bodyCellVariants(),
        tableCellProps.align === 'center'
          ? 'text-center'
          : tableCellProps.align === 'right'
            ? 'text-right flex-row-reverse'
            : tableCellProps.align === 'left'
              ? 'text-left'
              : tableCellProps.align === 'justify'
                ? 'text-justify'
                : 'text-start',
        layoutMode?.startsWith('grid') && 'items-center',
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
        actionCell?.id === cell.id &&
          'outline outline-1 outline-muted-foreground',
        (actionCell?.id === cell.id ||
          (editDisplayMode === 'cell' && isEditable) ||
          (editDisplayMode === 'table' && (isCreating || isEditing))) &&
          'hover:outline hover:outline-1 hover:outline-muted-foreground',
        commonCellStyles.className,
      )}
    >
      {tableCellProps.children ?? (
        <>
          {cell.getIsPlaceholder() ? (
            (columnDef.PlaceholderCell?.({ cell, column, row, table }) ?? null)
          ) : showSkeletons !== false && (isLoading || showSkeletons) ? (
            // Note: MUI Skeleton animation="wave" dropped — ui/skeleton's animate-pulse is the stand-in.
            <Skeleton
              {...skeletonProps}
              style={{
                height: 20,
                width: skeletonWidth,
                ...skeletonProps?.style,
              }}
            />
          ) : columnDefType === 'display' &&
            (['st-row-expand', 'st-row-numbers', 'st-row-select'].includes(
              column.id,
            ) ||
              !row.getIsGrouped()) ? (
            columnDef.Cell?.({
              cell,
              column,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              renderedCellValue: cell.renderValue() as any,
              row,
              rowRef,
              staticColumnIndex,
              staticRowIndex,
              table,
            })
          ) : isCreating || isEditing ? (
            <ST_EditCellTextField cell={cell} table={table} />
          ) : showClickToCopyButton && columnDef.enableClickToCopy !== false ? (
            <ST_CopyButton cell={cell} table={table}>
              <ST_TableBodyCellValue {...cellValueProps} />
            </ST_CopyButton>
          ) : (
            <ST_TableBodyCellValue {...cellValueProps} />
          )}
          {cell.getIsGrouped() && !columnDef.GroupedCell && (
            <> ({row.subRows?.length})</>
          )}
        </>
      )}
    </td>
  );
};

export const Memo_ST_TableBodyCell = memo(
  ST_TableBodyCell,
  (prev, next) => next.cell === prev.cell,
) as typeof ST_TableBodyCell;
