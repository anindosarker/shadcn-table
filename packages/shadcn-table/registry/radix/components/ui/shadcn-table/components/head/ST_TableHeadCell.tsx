import {
  type ComponentType,
  createElement,
  type DragEvent,
  isValidElement,
  type KeyboardEvent,
  type ReactNode,
  useState,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_ColumnVirtualizer,
  type ST_Header,
  type ST_IconProps,
  type ST_RowData,
  type TableCellProps,
} from '@/components/ui/shadcn-table/types';
import { cellKeyboardShortcuts } from '@/components/ui/shadcn-table/shared/utils/cell.utils';
import {
  getCommonSRTCellStyles,
  gridLineClassName,
} from '@/components/ui/shadcn-table/shared/utils/style.utils';
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
  'group/th border-b p-0 text-sm font-medium text-muted-foreground align-middle overflow-visible',
);

/** `columnDef.icon`: an element renders as is, anything else as a component. */
const renderColumnIcon = (icon: ReactNode | ComponentType<ST_IconProps>) => {
  if (icon == null || icon === false) return null;
  const className = 'size-3.5 shrink-0 opacity-70';
  if (
    typeof icon === 'function' ||
    (typeof icon === 'object' && !isValidElement(icon) && '$$typeof' in icon)
  ) {
    return createElement(icon as ComponentType<ST_IconProps>, {
      'aria-hidden': true,
      className,
    });
  }
  return icon as ReactNode;
};

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
      enableKeyboardShortcuts,
      enableColumnActions,
      enableColumnDragging,
      enableColumnOrdering,
      enableColumnPinning,
      enableGrouping,
      enableMultiSort,
      enableStickyHeader,
      layoutMode,
      localization,
      showColumnDragHandle,
      stTableHeadCellProps,
    },
    refs: { tableHeadCellRefs },
    setHoveredColumn,
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const [menuOpen, setMenuOpen] = useState(false);

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
    columnDef.enableColumnActions !== false &&
    columnDefType !== 'group';

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
    <ST_TableHeadCellColumnActionsButton
      header={header}
      onOpenChange={setMenuOpen}
      open={menuOpen}
    />
  );
  const resizeHandle = <ST_TableHeadCellResizeHandle header={header} />;
  const filterContainer = <ST_TableHeadCellFilterContainer header={header} />;
  const columnIcon = renderColumnIcon(columnDef.icon);

  return (
    <table.Subscribe
      selector={(state) => ({
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        density: state.density,
        draggingColumn: state.draggingColumn,
        gridLines: state.viewSettings.gridLines,
        grouping: state.grouping,
        hoveredColumn: state.hoveredColumn,
        isFullScreen: state.isFullScreen,
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
        stickyHeaderSetting: state.viewSettings.stickyHeader,
      })}
    >
      {({
        density,
        draggingColumn,
        gridLines,
        grouping,
        hoveredColumn,
        isFullScreen,
        showColumnFilters,
        stickyHeaderSetting,
      }) => {
        const isColumnPinned =
          enableColumnPinning &&
          columnDef.columnDefType !== 'group' &&
          column.getIsPinned();

        const showDragHandle =
          showColumnDragHandle &&
          enableColumnDragging !== false &&
          columnDef.enableColumnDragging !== false &&
          (enableColumnDragging ||
            (enableColumnOrdering &&
              columnDef.enableColumnOrdering !== false) ||
            (enableGrouping &&
              columnDef.enableGrouping !== false &&
              !grouping.includes(column.id)));

        const stickyHeader =
          enableStickyHeader || isFullScreen || stickyHeaderSetting;

        const showSubheaderFilter =
          columnFilterDisplayMode === 'subheader' && column.getCanFilter();

        const isLastColumn =
          header.headerGroup?.headers.at(-1)?.id === header.id;

        const borderStyle =
          draggingColumn?.id === column.id
            ? `1px dashed var(--color-muted-foreground)`
            : hoveredColumn?.id === column.id
              ? `2px dashed var(--color-primary)`
              : undefined;

        const draggingBorders = borderStyle
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

        const alignClassName =
          tableCellProps.align === 'center' || columnDefType === 'group'
            ? 'justify-center text-center'
            : tableCellProps.align === 'right'
              ? 'flex-row-reverse text-end'
              : 'text-start';

        // A plain text header is the second opener of the column menu; a
        // custom `Header` render keeps its own content and events.
        const label =
          showColumnActions && !columnDef.Header ? (
            <button
              aria-label={localization.columnMenu.replace(
                '{column}',
                String(columnDef.header),
              )}
              className="min-w-0 cursor-[inherit] truncate text-start text-sm hover:text-foreground"
              onClick={() => setMenuOpen(true)}
              type="button"
            >
              {HeaderElement}
            </button>
          ) : (
            <span
              className={cn('min-w-0', columnDefType === 'data' && 'truncate')}
            >
              {HeaderElement}
            </span>
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
              !(showSubheaderFilter && showColumnFilters) && 'h-10',
              layoutMode?.startsWith('grid') && 'flex-col',
              enableMultiSort && column.getCanSort() && 'select-none',
              stickyHeader && 'sticky top-0 z-2',
              (stickyHeader || isColumnPinned) && 'bg-background',
              commonCellStyles.className,
              'opacity-100',
              gridLineClassName(gridLines, isLastColumn),
              'border-b',
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
                      'flex w-full min-w-0 items-center gap-1.5',
                      showSubheaderFilter && showColumnFilters
                        ? 'h-10'
                        : 'h-full',
                      density === 'compact'
                        ? 'px-2'
                        : density === 'comfortable'
                          ? 'px-3'
                          : 'px-4',
                      alignClassName,
                    )}
                  >
                    {showDragHandle && grabHandle}
                    {columnIcon}
                    {label}
                    {column.getCanFilter() && filterLabel}
                    {column.getCanSort() && sortLabel}
                    {showColumnActions && columnActionsButton}
                  </div>
                ))}
            {showSubheaderFilter && filterContainer}
            {column.getCanResize() && resizeHandle}
          </th>
        );
      }}
    </table.Subscribe>
  );
};
