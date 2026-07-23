import {
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  useMemo,
} from 'react';
import {
  type SRT_ColumnVirtualizer,
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  type TableCellProps,
  cellKeyboardShortcuts,
  getSRTCellWidthStyles,
  getSRTPinnedCellStyles,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
// import { useTheme } from '@mui/material/styles';
// import { type Theme } from '@mui/material/styles';
// Note: useTheme/Theme dropped project-wide — logical CSS + shadcn tokens replace
// MUI's manual `theme.direction === 'rtl'` and palette lookups here.
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

export interface SRT_TableHeadCellProps<TData extends SRT_RowData>
  extends TableCellProps {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  header: SRT_Header<TData>;
  staticColumnIndex?: number;
  table: SRT_TableInstance<TData>;
}

// Base folds getCommonMRTCellStyles' static pieces (bg-inherit =
// backgroundColor:inherit only — getCommonMRTCellStyles' backgroundImage:inherit
// is dropped as moot now that no ancestor sets background-image with MUI
// Paper/mrtTheme gone; position relative, verticalAlign top, overflow visible,
// fontWeight bold), the `& :hover .MuiButtonBase-root { opacity: 1 }`
// hover-reveal, and the focus-visible outline (cellNavigationOutlineColor → ring
// token). Density paddings / opacity / zIndex / layout are runtime-conditional in
// cn() below.
const headCellVariants = cva(
  'relative bg-inherit align-top overflow-visible font-bold [&:hover_button]:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
);

export const SRT_TableHeadCell = <TData extends SRT_RowData>({
  columnVirtualizer,
  header,
  staticColumnIndex,
  table,
  ...rest
}: SRT_TableHeadCellProps<TData>) => {
  // const theme = useTheme();
  const {
    getState,
    options: {
      columnFilterDisplayMode,
      columnResizeDirection,
      columnResizeMode,
      enableColumnVirtualization,
      enableKeyboardShortcuts,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableExpandAll,
      enableGrouping,
      enableMultiRowSelection,
      enableMultiSort,
      enableSelectAll,
      enableStickyHeader,
      layoutMode,
      // mrtTheme: { draggingBorderColor },
      // Note: mrtTheme registry dropped — draggingBorderColor → var(--color-primary).
      srtTableHeadCellProps,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table;
  const {
    columnSizingInfo,
    density,
    draggingColumn,
    grouping,
    hoveredColumn,
    isFullScreen,
    showColumnFilters,
  } = getState();
  const { column } = header;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const tableCellProps = {
    ...parseFromValuesOrFunc(srtTableHeadCellProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.srtTableHeadCellProps, {
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

  // stickyHeader mirrors MUI Table's dropped stickyHeader flag (decided at the
  // SRT_Table pair): enableStickyHeader || full-screen → sticky th with own bg.
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
      columnSizingInfo.isResizingColumn === column.id &&
      columnResizeMode === 'onChange' &&
      !header.subHeaders.length;

    // Note: MRT appends `!important` here; React style objects can't express it,
    // so it is dropped — draggingBorders still render since they spread last.
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
  }, [draggingColumn, hoveredColumn, columnSizingInfo.isResizingColumn]);

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

  // SRT deviation: core display-column defs are headless (core cannot import
  // app components), so MRT's select-all/expand-all controls — which arrive via
  // columnDef.Header in MRT — must be dispatched here on column.id. Mirrors the
  // Header render logic of getMRT_RowSelectColumnDef / getMRT_RowExpandColumnDef.
  const displayHeaderElement =
    columnDefType === 'display' ? (
      column.id === 'mrt-row-select' ? (
        enableSelectAll && enableMultiRowSelection ? (
          // no `row` → select-all semantics; selectAllMode read internally.
          <SRT_SelectCheckbox table={table} />
        ) : undefined
      ) : column.id === 'mrt-row-expand' ? (
        enableExpandAll ? (
          // Note: MRT also appends grouped-column names when
          // groupedColumnMode === 'remove'; omitted until grouping parity.
          <SRT_ExpandAllButton table={table} />
        ) : undefined
      ) : undefined
    ) : undefined;

  // Precedence mirrors MRT's single Header slot: a user-supplied columnDef.Header
  // (displayColumnDefOptions override) wins first, then the id-based display
  // dispatch, then the localized columnDef.header string.
  const HeaderElement =
    parseFromValuesOrFunc(columnDef.Header, {
      column,
      header,
      table,
    }) ??
    displayHeaderElement ??
    columnDef.header;

  const isDraggingOrHovered =
    draggingColumn?.id === column.id || hoveredColumn?.id === column.id;

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
      ref={(node: HTMLTableCellElement | null) => {
        if (node) {
          tableHeadCellRefs.current![column.id] = node;
          if (columnDefType !== 'group') {
            columnVirtualizer?.measureElement?.(node);
          }
        }
      }}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      {...tableCellProps}
      className={cn(
        headCellVariants(),
        // align dropped → logical text-align; group also centers content.
        // Note: MRT's `theme.direction === 'rtl' ? 'right' : 'left'` branch is
        // replaced by logical `text-start`, which handles rtl without a theme.
        columnDefType === 'group' ? 'text-center justify-center' : 'text-start',
        layoutMode?.startsWith('grid') && 'flex flex-col',
        // density paddings — MRT's exact rem values (p, then pb/pt override).
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
        isDraggingOrHovered && 'opacity-50',
        !enableColumnVirtualization &&
          'transition-[padding] duration-150 ease-in-out',
        column.getIsResizing() || draggingColumn?.id === column.id
          ? 'z-[2]'
          : columnDefType !== 'group' && isColumnPinned
            ? 'z-[1]'
            : 'z-0',
        // Pinned th owns its bg (June deviation) — spread after opacity so its
        // 0.97 wins, matching getCommonMRTCellStyles' pinnedStyles order.
        isColumnPinned && 'bg-background opacity-[0.97]',
        // Sticky ordered AFTER the zIndex conditional so its z-[2] wins; with
        // getSRTPinnedCellStyles no longer emitting an inline zIndex, nothing
        // overrides this class.
        stickyHeader && 'sticky top-0 z-[2] bg-background',
        tableCellProps?.className,
      )}
      style={
        {
          ...getSRTCellWidthStyles({ column, header, table }),
          ...(isColumnPinned ? getSRTPinnedCellStyles({ column, table }) : {}),
          ...tableCellProps?.style,
          ...draggingBorders,
        } as CSSProperties
      }
      onKeyDown={handleKeyDown}
    >
      {header.isPlaceholder
        ? null
        : (tableCellProps.children ?? (
            <div
              className={cn(
                'relative flex w-full items-center',
                columnDefType === 'group'
                  ? 'justify-center'
                  : column.getCanResize()
                    ? 'justify-between'
                    : 'justify-start',
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
                // Note: MRT gates this pl on `tableCellProps.align === 'center'`;
                // with align dropped the equivalent gate is group columns.
                style={
                  columnDefType === 'group'
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
                  <SRT_TableHeadCellFilterLabel header={header} table={table} />
                )}
                {column.getCanSort() && (
                  <SRT_TableHeadCellSortLabel header={header} table={table} />
                )}
              </div>
              {columnDefType !== 'group' && (
                <div className="whitespace-nowrap">
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
          ))}
      {columnFilterDisplayMode === 'subheader' && column.getCanFilter() && (
        <SRT_TableHeadCellFilterContainer header={header} table={table} />
      )}
    </th>
  );
};
