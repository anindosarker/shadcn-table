import { type DragEvent, type KeyboardEvent, useMemo } from 'react';
// import { useTheme } from '@mui/material/styles';
// import { type Theme } from '@mui/material/styles';
// Note: useTheme dropped — align->text-start, grey[500]->muted-foreground.
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
  type TableCellProps,
} from '@/components/ui/shadcn-table/types';
import { cellKeyboardShortcuts } from '@/components/ui/shadcn-table/utils/cell.utils';
import { getCommonSRTCellStyles } from '@/components/ui/shadcn-table/utils/style.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_TableHeadCellColumnActionsButton } from '@/components/ui/shadcn-table/head/ST_TableHeadCellColumnActionsButton';
import { ST_TableHeadCellFilterContainer } from '@/components/ui/shadcn-table/head/ST_TableHeadCellFilterContainer';
import { ST_TableHeadCellFilterLabel } from '@/components/ui/shadcn-table/head/ST_TableHeadCellFilterLabel';
import { ST_TableHeadCellGrabHandle } from '@/components/ui/shadcn-table/head/ST_TableHeadCellGrabHandle';
import { ST_TableHeadCellResizeHandle } from '@/components/ui/shadcn-table/head/ST_TableHeadCellResizeHandle';
import { ST_TableHeadCellSortLabel } from '@/components/ui/shadcn-table/head/ST_TableHeadCellSortLabel';

export interface ST_TableHeadCellProps<TData extends ST_RowData>
  extends TableCellProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
  header: ST_Header<TData>;
  staticColumnIndex?: number;
  table: ST_TableInstance<TData>;
}

const headCellVariants = cva(
  'border-b text-sm leading-6 align-top overflow-visible font-bold [&:hover_button]:opacity-100',
);

export const ST_TableHeadCell = <TData extends ST_RowData>({
  columnVirtualizer,
  header,
  staticColumnIndex,
  table,
  ...rest
}: ST_TableHeadCellProps<TData>) => {
  // const theme = useTheme();
  const {
    options: {
      columnFilterDisplayMode,
      columnResizeDirection,
      columnResizeMode,
      enableKeyboardShortcuts,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableMultiSort,
      enableStickyHeader,
      layoutMode,
      // mrtTheme: { draggingBorderColor },
      // Note: mrtTheme registry dropped — draggingBorderColor → var(--color-primary).
      stTableHeadCellProps,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table;
  const {
    columnResizing,
    density,
    draggingColumn,
    grouping,
    hoveredColumn,
    isFullScreen,
    showColumnFilters,
  } = table.state;
  const { column } = header;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const tableCellProps = {
    ...parseFromValuesOrFunc(stTableHeadCellProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.stTableHeadCellProps, {
      column,
      table,
    }),
    ...rest,
  };

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const showColumnActions =
    (enableColumnActions || columnDef.enableColumnActions) &&
    columnDef.enableColumnActions !== false;

  const showDragHandle =
    enableColumnDragging !== false &&
    columnDef.enableColumnDragging !== false &&
    (enableColumnDragging ||
      (enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
      (enableGrouping &&
        columnDef.enableGrouping !== false &&
        !grouping.includes(column.id)));

  const stickyHeader = enableStickyHeader || isFullScreen;

  const headerPL = useMemo(() => {
    let pl = 0;
    if (column.getCanSort()) pl += 1;
    if (showColumnActions) pl += 1.75;
    if (showDragHandle) pl += 1.5;
    return pl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showColumnActions, showDragHandle]);

  const draggingBorders = useMemo(() => {
    const showResizeBorder =
      columnResizing.isResizingColumn === column.id &&
      columnResizeMode === 'onChange' &&
      !header.subHeaders.length;

    // Note: MRT's `!important` dropped — inline style objects can't express it; draggingBorders spreads last anyway.
    const borderStyle = showResizeBorder
      ? `2px solid var(--color-primary)`
      : draggingColumn?.id === column.id
        ? `1px dashed var(--color-muted-foreground)`
        : hoveredColumn?.id === column.id
          ? `2px dashed var(--color-primary)`
          : undefined;

    if (showResizeBorder) {
      return columnResizeDirection === 'ltr'
        ? { borderRight: borderStyle }
        : { borderLeft: borderStyle };
    }
    const draggingBorders = borderStyle
      ? {
          borderLeft: borderStyle,
          borderRight: borderStyle,
          borderTop: borderStyle,
        }
      : undefined;

    return draggingBorders;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingColumn, hoveredColumn, columnResizing.isResizingColumn]);

  const handleDragEnter = () => {
    if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
      setHoveredColumn(null);
    }
    if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
      setHoveredColumn(
        columnDef.enableColumnOrdering !== false ? column : null,
      );
    }
  };

  const handleDragOver = (e: DragEvent) => {
    if (columnDef.enableColumnOrdering !== false) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableCellElement>) => {
    tableCellProps?.onKeyDown?.(event);
    cellKeyboardShortcuts({
      event,
      cellValue: header.column.columnDef.header,
      table,
      header,
    });
  };

  const HeaderElement =
    parseFromValuesOrFunc(columnDef.Header, {
      column,
      header,
      table,
    }) ?? columnDef.header;

  const commonCellStyles = getCommonSRTCellStyles({
    column,
    header,
    table,
    tableCellProps,
  });

  return (
    <th
      aria-sort={
        column.getIsSorted()
          ? column.getIsSorted() === 'asc'
            ? 'ascending'
            : 'descending'
          : 'none'
      }
      colSpan={header.colSpan}
      data-can-sort={column.getCanSort() || undefined}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      data-sort={column.getIsSorted() || undefined}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      ref={(node: HTMLTableCellElement) => {
        if (node) {
          tableHeadCellRefs.current![column.id] = node;
          if (columnDefType !== 'group') {
            columnVirtualizer?.measureElement?.(node);
          }
        }
      }}
      scope="col"
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      {...tableCellProps}
      onKeyDown={handleKeyDown}
      className={cn(
        headCellVariants(),
        tableCellProps.align === 'center'
          ? 'text-center'
          : tableCellProps.align === 'right'
            ? 'text-right flex-row-reverse'
            : tableCellProps.align === 'left'
              ? 'text-left'
              : tableCellProps.align === 'justify'
                ? 'text-justify'
                : columnDefType === 'group'
                  ? 'text-center'
                  : 'text-start',
        layoutMode?.startsWith('grid') && 'flex-col',
        density === 'compact'
          ? 'p-2'
          : density === 'comfortable'
            ? columnDefType === 'display'
              ? 'p-3'
              : 'p-4'
            : columnDefType === 'display'
              ? 'px-5 py-4'
              : 'p-6',
        columnDefType === 'display'
          ? 'pb-0'
          : showColumnFilters || density === 'compact'
            ? 'pb-[0.4rem]'
            : 'pb-[0.6rem]',
        columnDefType === 'group' || density === 'compact'
          ? 'pt-1'
          : density === 'comfortable'
            ? 'pt-3'
            : 'pt-5',
        enableMultiSort && column.getCanSort() && 'select-none',
        stickyHeader && 'sticky top-0 z-[2] bg-background',
        commonCellStyles.className,
      )}
      style={{
        ...commonCellStyles.style,
        ...draggingBorders,
      }}
    >
      {header.isPlaceholder
        ? null
        : (tableCellProps.children ?? (
            <div
              className={cn(
                'relative flex w-full items-center',
                tableCellProps?.align === 'right' && 'flex-row-reverse',
                columnDefType === 'group' || tableCellProps?.align === 'center'
                  ? 'justify-center'
                  : column.getCanResize()
                    ? 'justify-between'
                    : 'justify-start',
              )}
            >
              <div
                className={cn(
                  'flex items-center',
                  tableCellProps?.align === 'right' && 'flex-row-reverse',
                  column.getCanSort() &&
                    columnDefType !== 'group' &&
                    'cursor-pointer',
                  columnDefType === 'data' && 'overflow-hidden',
                )}
                onClick={column.getToggleSortingHandler()}
                style={
                  tableCellProps?.align === 'center'
                    ? { paddingLeft: `${headerPL}rem` }
                    : undefined
                }
              >
                <div
                  className={cn(
                    'text-ellipsis hover:text-clip',
                    columnDefType === 'data' && 'overflow-hidden',
                    (columnDef.header?.length ?? 0) < 20
                      ? 'whitespace-nowrap'
                      : 'whitespace-normal',
                  )}
                  style={{
                    minWidth: `${Math.min(columnDef.header?.length ?? 0, 4)}ch`,
                  }}
                >
                  {HeaderElement}
                </div>
                {column.getCanFilter() && (
                  <ST_TableHeadCellFilterLabel header={header} table={table} />
                )}
                {column.getCanSort() && (
                  <ST_TableHeadCellSortLabel header={header} table={table} />
                )}
              </div>
              {columnDefType !== 'group' && (
                <div className="flex items-center whitespace-nowrap">
                  {showDragHandle && (
                    <ST_TableHeadCellGrabHandle
                      column={column}
                      table={table}
                      tableHeadCellRef={{
                        current: tableHeadCellRefs.current?.[column.id] ?? null,
                      }}
                    />
                  )}
                  {showColumnActions && (
                    <ST_TableHeadCellColumnActionsButton
                      header={header}
                      table={table}
                    />
                  )}
                </div>
              )}
              {column.getCanResize() && (
                <ST_TableHeadCellResizeHandle header={header} table={table} />
              )}
            </div>
          ))}
      {columnFilterDisplayMode === 'subheader' && column.getCanFilter() && (
        <ST_TableHeadCellFilterContainer header={header} table={table} />
      )}
    </th>
  );
};
