import {
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui-aria/skeleton';
import {
  type ST_Cell,
  type ST_RowData,
  type TableCellProps,
} from '@/components/ui-aria/shadcn-table/types';
import {
  isCellEditable,
  cellKeyboardShortcuts,
  openEditingCell,
} from '@/components/ui-aria/shadcn-table/shared/utils/cell.utils';
import {
  getST_ColumnDropTargetProps,
  lockedCellClassName,
} from '@/components/ui-aria/shadcn-table/shared/utils/drag.utils';
import {
  getCommonSRTCellStyles,
  gridLineClassName,
} from '@/components/ui-aria/shadcn-table/shared/utils/style.utils';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';
import { ST_OverflowText } from '@/components/ui-aria/shadcn-table/components/body/ST_OverflowText';
import { ST_TableBodyCellValue } from '@/components/ui-aria/shadcn-table/components/body/ST_TableBodyCellValue';
import { ST_CopyButton } from '@/components/ui-aria/shadcn-table/components/buttons/ST_CopyButton';
import { ST_EditCellTextField } from '@/components/ui-aria/shadcn-table/components/inputs/ST_EditCellTextField';

export interface ST_TableBodyCellProps<TData extends ST_RowData>
  extends TableCellProps {
  cell: ST_Cell<TData>;
  numRows?: number;
  rowRef: RefObject<HTMLTableRowElement | null>;
  staticColumnIndex?: number;
  staticRowIndex: number;
}

const bodyCellVariants = cva(
  'content-center overflow-hidden text-sm -outline-offset-1',
  {
    variants: {
      density: {
        compact: 'h-10 px-2',
        comfortable: 'h-12 px-3',
        spacious: 'h-14 px-4',
      },
      wrap: {
        false: 'truncate',
        true: 'whitespace-normal wrap-break-word py-1',
      },
      // A flex (grid) cell keeps a fixed height; a semantic table cell treats
      // it as a minimum and grows with its content.
      grid: { false: '', true: '' },
    },
    // Wrapped text in a grid row shows in full: the density height becomes
    // the minimum.
    compoundVariants: [
      {
        className: 'h-auto min-h-10',
        density: 'compact',
        grid: true,
        wrap: true,
      },
      {
        className: 'h-auto min-h-12',
        density: 'comfortable',
        grid: true,
        wrap: true,
      },
      {
        className: 'h-auto min-h-14',
        density: 'spacious',
        grid: true,
        wrap: true,
      },
    ],
  },
);

export const ST_TableBodyCell = <TData extends ST_RowData>({
  cell,
  numRows,
  rowRef,
  staticColumnIndex,
  staticRowIndex,
  ...rest
}: ST_TableBodyCellProps<TData>) => {
  const table = cell.table;
  const {
    options: {
      columnResizeMode,
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableCellOverflowTooltip,
      enableClickToCopy,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableKeyboardShortcuts,
      layoutMode,
      stSkeletonProps,
      stTableBodyCellProps,
    },
    setHoveredColumn,
  } = table;
  const isLoading = useSelector(table.atoms.isLoading);
  const showSkeletons = useSelector(table.atoms.showSkeletons);
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

  // Same value on the server and the client: stepped by the row index.
  const skeletonSize = column.getSize();
  const skeletonWidth =
    columnDefType === 'display'
      ? skeletonSize / 2
      : Math.round(
          skeletonSize / 3 +
            (((row.index * 37) % 67) / 100) * (skeletonSize - skeletonSize / 3),
        );

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

  const dropTargetProps = getST_ColumnDropTargetProps(column);

  const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDragEnter?.(e);
    if (enableGrouping && table.atoms.hoveredColumn.get()?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
    if (enableColumnOrdering) dropTargetProps.onDragEnter();
  };

  const handleDragOver = (e: DragEvent<HTMLTableCellElement>) => {
    tableCellProps?.onDragOver?.(e);
    if (table.atoms.draggingColumn.get()) dropTargetProps.onDragOver(e);
    else e.preventDefault();
  };

  const handleContextMenu = (e: MouseEvent<HTMLTableCellElement>) => {
    tableCellProps?.onContextMenu?.(e);
    if (isRightClickable) {
      e.preventDefault();
      table.setActionCell(cell);
      // eslint-disable-next-line react-hooks/immutability -- runs in handleContextMenu, not render; table.refs is the table's mutable ref bag
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

  const isLocked =
    enableColumnOrdering !== false && columnDef.enableColumnOrdering === false;

  // Skeleton rows hold placeholder data, so their value is never read.
  const isSkeleton = showSkeletons !== false && (isLoading || showSkeletons);

  // Plain text cells show a tooltip when cut off; display columns never.
  const overflowTooltip =
    enableCellOverflowTooltip === true &&
    !isSkeleton &&
    columnDefType !== 'display' &&
    columnDef.overflowTooltip !== false
      ? typeof columnDef.overflowTooltip === 'function'
        ? columnDef.overflowTooltip({ cell, column, row, table })
        : String(cell.getValue() ?? '')
      : null;

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
    <table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        density: state.density,
        // Only a locked column follows a column drag, for its overlay.
        dragActive: isLocked && !!state.draggingColumn,
        gridLines: state.viewSettings.gridLines,
        grouping: state.grouping,
        // Per cell, so an action, edit, drag or hover change re-renders only
        // the cells it concerns.
        isActionCell: state.actionCell?.id === cell.id,
        isCreatingRow: state.creatingRow?.id === row.id,
        isDraggingRow: state.draggingRow?.id === row.id,
        isEditingCell: state.editingCell?.id === cell.id,
        isEditingRow: state.editingRow?.id === row.id,
        isHoveredRow: state.hoveredRow?.id === row.id,
        isResizingColumn: state.columnResizing.isResizingColumn === column.id,
        // A pinned cell's offset follows the other columns' sizes.
        pinnedColumnSizing: column.getIsPinned()
          ? state.columnSizing
          : undefined,
        rowPinning: state.rowPinning,
        wrapText: state.viewSettings.wrapText,
      })}
    >
      {({
        density,
        dragActive,
        gridLines,
        isActionCell,
        isCreatingRow,
        isDraggingRow,
        isEditingCell,
        isEditingRow,
        isHoveredRow,
        isResizingColumn,
        wrapText,
      }) => {
        const isFirstColumn = column.getIsFirstColumn();
        const isLastColumn = column.getIsLastColumn();
        // By index, not :last-child: a virtualized body's last DOM row is not
        // the last row.
        const isLastRow = !!numRows && staticRowIndex === numRows - 1;
        const showResizeBorder =
          isResizingColumn && columnResizeMode === 'onChange';

        // Row drags keep their dashed outline; column drags show nothing on
        // the body.
        const rowDragBorder = isDraggingRow
          ? '1px dashed var(--color-muted-foreground)'
          : isHoveredRow
            ? '2px dashed var(--color-primary)'
            : undefined;

        const draggingBorders = showResizeBorder
          ? { borderInlineEnd: '2px solid var(--color-primary)' }
          : rowDragBorder
            ? {
                borderBottom: rowDragBorder,
                borderInlineEnd: isLastColumn ? rowDragBorder : undefined,
                borderInlineStart: isFirstColumn ? rowDragBorder : undefined,
                borderTop: rowDragBorder,
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
            data-flip-column={column.id}
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
              bodyCellVariants({
                density: density ?? 'comfortable',
                grid: !!layoutMode?.startsWith('grid'),
                wrap: !!wrapText,
              }),
              gridLineClassName(gridLines, isLastColumn),
              isLastRow && 'border-b-0',
              columnDefType === 'display' && 'px-0',
              tableCellProps.align === 'center'
                ? 'text-center'
                : tableCellProps.align === 'right'
                  ? 'text-end flex-row-reverse'
                  : tableCellProps.align === 'left'
                    ? 'text-start'
                    : tableCellProps.align === 'justify'
                      ? 'text-justify'
                      : 'text-start',
              layoutMode?.startsWith('grid') && 'items-center',
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
              isLocked && lockedCellClassName(dragActive),
              commonCellStyles.className,
            )}
          >
            {tableCellProps.children ?? (
              <>
                {cell.getIsPlaceholder() ? (
                  (columnDef.PlaceholderCell?.({ cell, column, row, table }) ??
                  null)
                ) : isSkeleton ? (
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
                    renderedCellValue: cell.renderValue() as ReactNode,
                    row,
                    rowRef,
                    staticColumnIndex,
                    staticRowIndex,
                    table,
                  })
                ) : isCreating || isEditing ? (
                  <ST_EditCellTextField cell={cell} />
                ) : overflowTooltip !== null ? (
                  <ST_OverflowText tooltip={overflowTooltip} wrap={wrapText}>
                    {showClickToCopyButton &&
                    columnDef.enableClickToCopy !== false ? (
                      <ST_CopyButton cell={cell}>{cellValue}</ST_CopyButton>
                    ) : (
                      cellValue
                    )}
                  </ST_OverflowText>
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
    </table.Subscribe>
  );
};
