import {
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
  useEffect,
  useState,
} from 'react';
import { Subscribe } from '@tanstack/react-table';
import { useST_Atom } from '@/components/ui-base/shadcn-table/hooks/stTableHook';
// import { useTheme } from '@mui/material/styles';
// Note: useTheme dropped — align->text-start, grey[500]->muted-foreground, draggingBorderColor->primary.
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui-base/skeleton';
import {
  type ST_Cell,
  type ST_RowData,
  type ST_TableInstance,
  type TableCellProps,
} from '@/components/ui-base/shadcn-table/types';
import {
  isCellEditable,
  cellKeyboardShortcuts,
  openEditingCell,
} from '@/components/ui-base/shadcn-table/shared/utils/cell.utils';
import { getCommonSRTCellStyles } from '@/components/ui-base/shadcn-table/shared/utils/style.utils';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_TableBodyCellValue } from '@/components/ui-base/shadcn-table/components/body/ST_TableBodyCellValue';
import { ST_CopyButton } from '@/components/ui-base/shadcn-table/components/buttons/ST_CopyButton';
import { ST_EditCellTextField } from '@/components/ui-base/shadcn-table/components/inputs/ST_EditCellTextField';

export interface ST_TableBodyCellProps<TData extends ST_RowData>
  extends TableCellProps {
  cell: ST_Cell<TData>;
  numRows?: number;
  rowRef: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex: number;
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
  ...rest
}: ST_TableBodyCellProps<TData>) => {
  // The cell carries the core table; the ST wrapper types re-type its getters.
  const table = cell.table as unknown as ST_TableInstance<TData>;
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
  // These feed the skeleton width effect, so they are hook subscriptions.
  const isLoading = useST_Atom(table.atoms.isLoading);
  const showSkeletons = useST_Atom(table.atoms.showSkeletons);
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

  const isEditable = isCellEditable({ cell, table });

  const showClickToCopyButton =
    (parseFromValuesOrFunc(enableClickToCopy, cell) === true ||
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell) === true) &&
    !['context-menu', false].includes(
      // @ts-expect-error enableClickToCopy may resolve to a string/false union
      parseFromValuesOrFunc(columnDef.enableClickToCopy, cell),
    );

  const isRightClickable = parseFromValuesOrFunc(enableCellActions, cell);

  const handleDoubleClick = (event: MouseEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDoubleClick?.(event);
    openEditingCell({ cell, table });
  };

  const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDragEnter?.(e);
    if (enableGrouping && table.atoms.hoveredColumn.get()?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
    if (enableColumnOrdering && table.atoms.draggingColumn.get()) {
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

  // Created outside the cell's state subscription, so a density, editing or
  // dragging change re-renders the td, not the value.
  const cellValue = (
    <ST_TableBodyCellValue
      cell={cell}
      staticColumnIndex={staticColumnIndex}
      staticRowIndex={staticRowIndex}
    />
  );

  return (
    <Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        density: state.density,
        grouping: state.grouping,
        // Per cell, so an action, edit, drag or hover change re-renders only
        // the cells it concerns.
        isActionCell: state.actionCell?.id === cell.id,
        isCreatingRow: state.creatingRow?.id === row.id,
        isDraggingColumn: state.draggingColumn?.id === column.id,
        isDraggingRow: state.draggingRow?.id === row.id,
        isEditingCell: state.editingCell?.id === cell.id,
        isEditingRow: state.editingRow?.id === row.id,
        isHoveredColumn: state.hoveredColumn?.id === column.id,
        isHoveredRow: state.hoveredRow?.id === row.id,
        isResizingColumn: state.columnResizing.isResizingColumn === column.id,
        // A pinned cell's offset follows the other columns' sizes.
        pinnedColumnSizing: column.getIsPinned()
          ? state.columnSizing
          : undefined,
        rowPinning: state.rowPinning,
      })}
      source={table.store}
    >
      {({
        density,
        isActionCell,
        isCreatingRow,
        isDraggingColumn,
        isDraggingRow,
        isEditingCell,
        isEditingRow,
        isHoveredColumn,
        isHoveredRow,
        isResizingColumn,
      }) => {
        const isFirstColumn = column.getIsFirstColumn();
        const isLastColumn = column.getIsLastColumn();
        const isLastRow = numRows && staticRowIndex === numRows - 1;
        const showResizeBorder =
          isResizingColumn && columnResizeMode === 'onChange';

        // Note: MRT's `!important` dropped; React style objects can't express it; draggingBorders spread last anyway.
        const borderStyle = showResizeBorder
          ? `2px solid var(--color-primary)`
          : isDraggingColumn || isDraggingRow
            ? `1px dashed var(--color-muted-foreground)`
            : isHoveredColumn || isHoveredRow || isResizingColumn
              ? `2px dashed var(--color-primary)`
              : undefined;

        const draggingBorders = showResizeBorder
          ? columnResizeDirection === 'ltr'
            ? { borderRight: borderStyle }
            : { borderLeft: borderStyle }
          : borderStyle
            ? {
                borderBottom:
                  isDraggingRow ||
                  isHoveredRow ||
                  (isLastRow && !isResizingColumn)
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
                borderTop:
                  isDraggingRow || isHoveredRow ? borderStyle : undefined,
              }
            : undefined;

        const isColumnPinned =
          enableColumnPinning &&
          columnDef.columnDefType !== 'group' &&
          column.getIsPinned();

        const isEditing =
          isEditable &&
          !['custom', 'modal'].includes(editDisplayMode as string) &&
          (editDisplayMode === 'table' || isEditingRow || isEditingCell) &&
          !row.getIsGrouped();

        const isCreating =
          isEditable && createDisplayMode === 'row' && isCreatingRow;

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
              isActionCell && 'outline outline-1 outline-muted-foreground',
              (isActionCell ||
                (editDisplayMode === 'cell' && isEditable) ||
                (editDisplayMode === 'table' && (isCreating || isEditing))) &&
                'hover:outline hover:outline-1 hover:outline-muted-foreground',
              commonCellStyles.className,
            )}
          >
            {tableCellProps.children ?? (
              <>
                {cell.getIsPlaceholder() ? (
                  (columnDef.PlaceholderCell?.({ cell, column, row, table }) ??
                  null)
                ) : showSkeletons !== false && (isLoading || showSkeletons) ? (
                  // Note: MUI Skeleton animation="wave" dropped; ui/skeleton's animate-pulse is the stand-in.
                  <Skeleton
                    {...skeletonProps}
                    style={{
                      height: 20,
                      width: skeletonWidth,
                      ...skeletonProps?.style,
                    }}
                  />
                ) : columnDefType === 'display' &&
                  ([
                    'st-row-expand',
                    'st-row-numbers',
                    'st-row-select',
                  ].includes(column.id) ||
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
                  <ST_EditCellTextField cell={cell} />
                ) : showClickToCopyButton &&
                  columnDef.enableClickToCopy !== false ? (
                  <ST_CopyButton cell={cell}>{cellValue}</ST_CopyButton>
                ) : (
                  cellValue
                )}
                {cell.getIsGrouped() && !columnDef.GroupedCell && (
                  <> ({row.subRows?.length})</>
                )}
              </>
            )}
          </td>
        );
      }}
    </Subscribe>
  );
};
