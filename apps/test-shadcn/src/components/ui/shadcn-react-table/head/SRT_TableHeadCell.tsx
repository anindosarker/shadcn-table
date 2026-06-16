import { type CSSProperties, type DragEvent, type KeyboardEvent } from 'react';
import {
  type SRT_ColumnVirtualizer,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  cellKeyboardShortcuts,
  flexRender,
  mergeSRT_HtmlProps,
  parseFromValuesOrFunc,
  parseSRT_HtmlProps,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_ExpandAllButton } from '../buttons/SRT_ExpandAllButton';
import { SRT_SelectCheckbox } from '../inputs/SRT_SelectCheckbox';
import { SRT_TableHeadCellColumnActionsButton } from './SRT_TableHeadCellColumnActionsButton';
import { SRT_TableHeadCellFilterContainer } from './SRT_TableHeadCellFilterContainer';
import { SRT_TableHeadCellFilterLabel } from './SRT_TableHeadCellFilterLabel';
import { SRT_TableHeadCellGrabHandle } from './SRT_TableHeadCellGrabHandle';
import { SRT_TableHeadCellResizeHandle } from './SRT_TableHeadCellResizeHandle';
import { SRT_TableHeadCellSortLabel } from './SRT_TableHeadCellSortLabel';

export interface SRT_TableHeadCellProps<TData extends SRT_RowData> {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  header: SRT_Header<TData>;
  staticColumnIndex?: number;
  table: SRT_TableInstance<TData>;
  className?: string;
}

const headCellVariants = cva(
  'relative overflow-visible text-left align-top font-bold text-muted-foreground',
  {
    variants: {
      density: {
        compact: 'p-2',
        comfortable: 'p-4',
        spacious: 'px-6 py-5',
      },
    },
    defaultVariants: {
      density: 'comfortable',
    },
  },
);

export const SRT_TableHeadCell = <TData extends SRT_RowData>({
  columnVirtualizer,
  header,
  staticColumnIndex,
  table,
  className,
}: SRT_TableHeadCellProps<TData>) => {
  const {
    getState,
    options: {
      columnFilterDisplayMode,
      enableExpandAll,
      enableKeyboardShortcuts,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableMultiRowSelection,
      enableMultiSort,
      enableSelectAll,
      localization,
      srtTableHeadCellProps,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table;
  const { columnSizingInfo, density, draggingColumn, grouping, hoveredColumn } =
    getState();
  const { column } = header;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

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

  const isDragging = draggingColumn?.id === column.id;
  const isHovered = hoveredColumn?.id === column.id;
  const isResizingBorder =
    columnSizingInfo.isResizingColumn === column.id &&
    !header.subHeaders.length;

  const handleDragEnter = (_e: DragEvent) => {
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
    cellKeyboardShortcuts({
      event,
      cellValue: header.column.columnDef.header,
      table,
      header,
    });
  };

  const displayHeaderElement =
    columnDefType === 'display' ? (
      column.id === 'mrt-row-select' ? (
        enableSelectAll && enableMultiRowSelection ? (
          <SRT_SelectCheckbox table={table} />
        ) : null
      ) : column.id === 'mrt-row-expand' ? (
        enableExpandAll ? (
          <SRT_ExpandAllButton table={table} />
        ) : (
          localization.expand
        )
      ) : column.id === 'mrt-row-numbers' ? (
        localization.rowNumber
      ) : column.id === 'mrt-row-actions' ? (
        localization.actions
      ) : undefined
    ) : undefined;

  const HeaderElement =
    parseFromValuesOrFunc(columnDef.Header, {
      column,
      header,
      table,
    }) ??
    displayHeaderElement ??
    flexRender(columnDef.header, header.getContext());

  const align = columnDefType === 'group' ? 'center' : 'left';

  const pinnedStyle: CSSProperties = isColumnPinned
    ? {
        position: 'sticky',
        zIndex: 1,
        left:
          isColumnPinned === 'left'
            ? `${column.getStart('left')}px`
            : undefined,
        right:
          isColumnPinned === 'right'
            ? `${column.getAfter('right')}px`
            : undefined,
      }
    : {};

  const tableHeadCellProps = parseSRT_HtmlProps(srtTableHeadCellProps, {
    column,
    table,
  });
  const columnHeadCellProps = parseSRT_HtmlProps(
    columnDef.srtTableHeadCellProps,
    { column, table },
  );
  const userHeadCellProps = mergeSRT_HtmlProps(
    tableHeadCellProps,
    columnHeadCellProps,
  );

  const baseHeadCellProps = {
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onKeyDown: handleKeyDown,
    style: { textAlign: align, ...pinnedStyle } as CSSProperties,
  };
  const mergedHeadCellProps = mergeSRT_HtmlProps(
    baseHeadCellProps,
    userHeadCellProps,
  );

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
      ref={(node: HTMLTableCellElement | null) => {
        if (node) {
          tableHeadCellRefs.current![column.id] = node;
          if (columnDefType !== 'group') {
            columnVirtualizer?.measureElement?.(node);
          }
        }
      }}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      {...mergedHeadCellProps}
      className={cn(
        headCellVariants({ density }),
        'group',
        isResizingBorder && 'border-r-2 border-r-primary',
        !isResizingBorder &&
          isDragging &&
          'border border-dashed border-muted-foreground/50',
        !isResizingBorder &&
          isHovered &&
          'border-2 border-dashed border-primary',
        isColumnPinned && 'bg-muted/95',
        enableMultiSort && column.getCanSort() && 'select-none',
        className,
        mergedHeadCellProps?.className,
      )}
    >
      {header.isPlaceholder ? null : (
        <div
          className={cn(
            'flex w-full items-center',
            columnDefType === 'group' ? 'justify-center' : 'justify-between',
          )}
        >
          <div
            className={cn(
              'flex items-center',
              column.getCanSort() &&
                columnDefType !== 'group' &&
                'cursor-pointer',
              columnDefType === 'data' && 'overflow-hidden',
            )}
            onClick={column.getToggleSortingHandler()}
          >
            <div
              className={cn(
                'text-ellipsis',
                columnDefType === 'data' && 'overflow-hidden',
                (columnDef.header?.length ?? 0) < 20
                  ? 'whitespace-nowrap'
                  : 'whitespace-normal',
              )}
            >
              {HeaderElement}
            </div>
            {column.getCanFilter() && (
              <SRT_TableHeadCellFilterLabel header={header} table={table} />
            )}
            {column.getCanSort() && (
              <SRT_TableHeadCellSortLabel header={header} table={table} />
            )}
          </div>
          {columnDefType !== 'group' && (
            <div className="flex whitespace-nowrap">
              {showDragHandle && (
                <SRT_TableHeadCellGrabHandle
                  column={column}
                  table={table}
                  tableHeadCellRef={{
                    current: tableHeadCellRefs.current?.[column.id] ?? null,
                  }}
                />
              )}
              {showColumnActions && (
                <SRT_TableHeadCellColumnActionsButton
                  header={header}
                  table={table}
                />
              )}
            </div>
          )}
          {column.getCanResize() && (
            <SRT_TableHeadCellResizeHandle header={header} table={table} />
          )}
        </div>
      )}
      {columnFilterDisplayMode === 'subheader' && column.getCanFilter() && (
        <SRT_TableHeadCellFilterContainer header={header} table={table} />
      )}
    </th>
  );
};
