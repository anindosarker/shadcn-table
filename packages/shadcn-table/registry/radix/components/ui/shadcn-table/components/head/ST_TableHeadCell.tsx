import { type DragEvent, type KeyboardEvent } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_Header,
  type ST_RowData,
  type TableCellProps,
} from '@/components/ui/shadcn-table/types';
import { cellKeyboardShortcuts } from '@/components/ui/shadcn-table/shared/utils/cell.utils';
import { getCommonSRTCellStyles } from '@/components/ui/shadcn-table/shared/utils/style.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_TableHeadCellColumnActionsButton } from '@/components/ui/shadcn-table/components/head/ST_TableHeadCellColumnActionsButton';
import { ST_TableHeadCellFilterContainer } from '@/components/ui/shadcn-table/components/head/ST_TableHeadCellFilterContainer';
import { ST_TableHeadCellFilterLabel } from '@/components/ui/shadcn-table/components/head/ST_TableHeadCellFilterLabel';
import { ST_TableHeadCellGrabHandle } from '@/components/ui/shadcn-table/components/head/ST_TableHeadCellGrabHandle';
import { ST_TableHeadCellResizeHandle } from '@/components/ui/shadcn-table/components/head/ST_TableHeadCellResizeHandle';
import { ST_TableHeadCellSortLabel } from '@/components/ui/shadcn-table/components/head/ST_TableHeadCellSortLabel';

export interface ST_TableHeadCellProps<TData extends ST_RowData>
  extends TableCellProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
  header: ST_Header<TData>;
  staticColumnIndex?: number;
}

const headCellVariants = cva(
  'border-b text-sm leading-6 align-top overflow-visible font-bold [&:hover_button]:opacity-100',
);

export const ST_TableHeadCell = <TData extends ST_RowData>({
  columnVirtualizer,
  header,
  staticColumnIndex,
  ...rest
}: ST_TableHeadCellProps<TData>) => {
  const table = header.table;
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
      stTableHeadCellProps,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table;
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

  const showColumnActions =
    (enableColumnActions || columnDef.enableColumnActions) &&
    columnDef.enableColumnActions !== false;

  const handleDragEnter = () => {
    const draggingColumn = table.atoms.draggingColumn.get();
    const hoveredColumn = table.atoms.hoveredColumn.get();
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

  // The children subscribe to what they render, so they are created outside
  // this cell's subscription. The drag image reads the cell node when the
  // drag starts, after this render.
  const filterLabel = <ST_TableHeadCellFilterLabel header={header} />;
  const sortLabel = <ST_TableHeadCellSortLabel header={header} />;
  const grabHandle = (
    <ST_TableHeadCellGrabHandle
      column={column}
      tableHeadCellRef={{
        get current() {
          return tableHeadCellRefs.current?.[column.id] ?? null;
        },
      }}
    />
  );
  const columnActionsButton = (
    <ST_TableHeadCellColumnActionsButton header={header} />
  );
  const resizeHandle = <ST_TableHeadCellResizeHandle header={header} />;
  const filterContainer = <ST_TableHeadCellFilterContainer header={header} />;

  return (
    <table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        density: state.density,
        draggingColumn: state.draggingColumn,
        grouping: state.grouping,
        hoveredColumn: state.hoveredColumn,
        isFullScreen: state.isFullScreen,
        isResizingColumn: state.columnResizing.isResizingColumn,
        // A pinned cell's offset follows the other columns' sizes; widths
        // come from the CSS vars ST_Table sets.
        pinnedColumnSizing:
          enableColumnPinning &&
          columnDef.columnDefType !== 'group' &&
          column.getIsPinned()
            ? state.columnSizing
            : undefined,
        showColumnFilters: state.showColumnFilters,
        sorting: state.sorting,
      })}
    >
      {({
        density,
        draggingColumn,
        grouping,
        hoveredColumn,
        isFullScreen,
        isResizingColumn,
        showColumnFilters,
      }) => {
        const isColumnPinned =
          enableColumnPinning &&
          columnDef.columnDefType !== 'group' &&
          column.getIsPinned();

        const showDragHandle =
          enableColumnDragging !== false &&
          columnDef.enableColumnDragging !== false &&
          (enableColumnDragging ||
            (enableColumnOrdering &&
              columnDef.enableColumnOrdering !== false) ||
            (enableGrouping &&
              columnDef.enableGrouping !== false &&
              !grouping.includes(column.id)));

        const stickyHeader = enableStickyHeader || isFullScreen;

        let headerPL = 0;
        if (column.getCanSort()) headerPL += 1;
        if (showColumnActions) headerPL += 1.75;
        if (showDragHandle) headerPL += 1.5;

        const showResizeBorder =
          isResizingColumn === column.id &&
          columnResizeMode === 'onChange' &&
          !header.subHeaders.length;

        const borderStyle = showResizeBorder
          ? `2px solid var(--color-primary)`
          : draggingColumn?.id === column.id
            ? `1px dashed var(--color-muted-foreground)`
            : hoveredColumn?.id === column.id
              ? `2px dashed var(--color-primary)`
              : undefined;

        const draggingBorders = showResizeBorder
          ? columnResizeDirection === 'ltr'
            ? { borderRight: borderStyle }
            : { borderLeft: borderStyle }
          : borderStyle
            ? {
                borderLeft: borderStyle,
                borderRight: borderStyle,
                borderTop: borderStyle,
              }
            : undefined;

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
                tableHeadCellRefs.current[column.id] = node;
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
                      columnDefType === 'group' ||
                        tableCellProps?.align === 'center'
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
                      {column.getCanFilter() && filterLabel}
                      {column.getCanSort() && sortLabel}
                    </div>
                    {columnDefType !== 'group' && (
                      <div className="flex items-center whitespace-nowrap">
                        {showDragHandle && grabHandle}
                        {showColumnActions && columnActionsButton}
                      </div>
                    )}
                    {column.getCanResize() && resizeHandle}
                  </div>
                ))}
            {columnFilterDisplayMode === 'subheader' &&
              column.getCanFilter() &&
              filterContainer}
          </th>
        );
      }}
    </table.Subscribe>
  );
};
