import { type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { type ST_TooltipProps } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import {
  type ST_Column,
  type ST_GridLinesState,
  type ST_Header,
  type ST_RowData,
  type ST_CoreTableInstance,
  type TableCellProps,
} from '@/components/ui/shadcn-table/types';

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export const getCommonPinnedCellStyles = <TData extends ST_RowData>({
  column,
}: {
  column?: ST_Column<TData>;
  table: ST_CoreTableInstance<TData>;
}) => {
  const isPinned = column?.getIsPinned();

  return cn(
    "data-[pinned=true]:before:absolute data-[pinned=true]:before:top-0 data-[pinned=true]:before:inset-s-0 data-[pinned=true]:before:z-[-1] data-[pinned=true]:before:h-full data-[pinned=true]:before:w-full data-[pinned=true]:before:bg-background data-[pinned=true]:before:content-['']",
    column
      ? isPinned === 'start' && column.getIsLastColumn(isPinned)
        ? 'data-[pinned=true]:shadow-[4px_0_4px_-4px_color-mix(in_oklab,var(--foreground)_15%,transparent)] rtl:data-[pinned=true]:shadow-[-4px_0_4px_-4px_color-mix(in_oklab,var(--foreground)_15%,transparent)]'
        : isPinned === 'end' && column.getIsFirstColumn(isPinned)
          ? 'data-[pinned=true]:shadow-[-4px_0_4px_-4px_color-mix(in_oklab,var(--foreground)_15%,transparent)] rtl:data-[pinned=true]:shadow-[4px_0_4px_-4px_color-mix(in_oklab,var(--foreground)_15%,transparent)]'
          : undefined
      : undefined,
  );
};

/** The CSS variables the table tints read, declared on the table root. */
export const ST_TINT_VARS = {
  edgeShadow: '--st-edge-shadow',
  hover: '--st-hover',
  selected: '--st-selected',
  stripe: '--st-stripe',
} as const;

/**
 * The edge shadow of the inner pinned cell, the last visible start-pinned or
 * the first visible end-pinned column, clipped to fall on the unpinned side
 * only; `undefined` for every other cell.
 */
export const pinnedEdgeShadowClassName = <TData extends ST_RowData>(
  column: ST_Column<TData>,
): string | undefined => {
  const isPinned = column.getIsPinned();
  if (isPinned === 'start' && column.getIsLastColumn('start')) {
    return 'drop-shadow-sm drop-shadow-(color:--st-edge-shadow) [clip-path:inset(0_-8px_0_0)] rtl:[clip-path:inset(0_0_0_-8px)]';
  }
  if (isPinned === 'end' && column.getIsFirstColumn('end')) {
    return 'drop-shadow-sm drop-shadow-(color:--st-edge-shadow) [clip-path:inset(0_0_0_-8px)] rtl:[clip-path:inset(0_-8px_0_0)]';
  }
  return undefined;
};

/** The cell borders `gridLines` draws; the last column has no end border. */
export const gridLineClassName = (
  gridLines: ST_GridLinesState,
  isLastColumn: boolean,
) =>
  cn(
    'border-border',
    (gridLines === 'rows' || gridLines === 'all') && 'border-b',
    (gridLines === 'columns' || gridLines === 'all') &&
      !isLastColumn &&
      'border-e',
  );

export const getCommonSRTCellStyles = <TData extends ST_RowData>({
  column,
  header,
  table,
  tableCellProps,
}: {
  column: ST_Column<TData>;
  header?: ST_Header<TData>;
  table: ST_CoreTableInstance<TData>;
  tableCellProps: TableCellProps;
}) => {
  const {
    options: { enableColumnVirtualization, layoutMode },
  } = table;
  const draggingColumn = table.atoms.draggingColumn.get();
  const hoveredColumn = table.atoms.hoveredColumn.get();
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const isColumnPinned =
    columnDef.columnDefType !== 'group' && column.getIsPinned();

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px)`,
  };

  if (layoutMode === 'grid') {
    widthStyles.flex = `${
      [0, false].includes(columnDef.grow!)
        ? 0
        : `var(--${header ? 'header' : 'col'}-${parseCSSVarId(
            header?.id ?? column.id,
          )}-size)`
    } 0 auto`;
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${+(columnDef.grow || 0)} 0 auto`;
  }

  const pinnedStyles: { className?: string; style?: CSSProperties } =
    isColumnPinned
      ? {
          className: cn(getCommonPinnedCellStyles({ column, table }), 'sticky'),
          style: {
            insetInlineStart:
              isColumnPinned === 'start'
                ? `${column.getStart('start')}px`
                : undefined,
            insetInlineEnd:
              isColumnPinned === 'end'
                ? `${column.getAfter('end')}px`
                : undefined,
          },
        }
      : {};

  return {
    className: cn(
      'bg-inherit',
      layoutMode?.startsWith('grid') && 'flex',
      draggingColumn?.id === column.id || hoveredColumn?.id === column.id
        ? 'opacity-50'
        : 'opacity-100',
      'relative',
      enableColumnVirtualization
        ? 'transition-none'
        : 'transition-[padding] duration-150 ease-in-out',
      column.getIsResizing() || draggingColumn?.id === column.id
        ? 'z-2'
        : columnDefType !== 'group' && isColumnPinned
          ? 'z-1'
          : 'z-0',
      'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
      pinnedStyles.className,
      tableCellProps?.className,
    ),
    style: {
      justifyContent:
        columnDefType === 'group'
          ? 'center'
          : layoutMode?.startsWith('grid')
            ? tableCellProps.align
            : undefined,
      ...pinnedStyles.style,
      ...widthStyles,
      ...tableCellProps?.style,
    },
  };
};

export const getCommonTooltipProps = (
  side?: ST_TooltipProps['side'],
): Partial<ST_TooltipProps> => ({
  delayDuration: 1000,
  disableHoverableContent: true,
  side,
});
