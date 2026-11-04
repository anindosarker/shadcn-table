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

/**
 * The edge shadow of a pinned cell; its background is the row's, inherited,
 * and every row tint is opaque, so scrolled content never shows through.
 */
export const getCommonPinnedCellStyles = <TData extends ST_RowData>({
  column,
}: {
  column?: ST_Column<TData>;
  table: ST_CoreTableInstance<TData>;
}) => (column ? pinnedEdgeShadowClassName(column) : undefined);

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

/** The leaf headers under a header; a leaf header is its own. */
const getLeafHeaders = <TData extends ST_RowData>(
  header: ST_Header<TData>,
): ST_Header<TData>[] =>
  (header.getLeafHeaders() as unknown as ST_Header<TData>[]).filter(
    (leaf) => !leaf.subHeaders.length,
  );

/**
 * The side a cell sticks to: a column's pin, or for a group header the side
 * every leaf below it is pinned to. Core reports a group as pinned when any
 * leaf is, so a group with unpinned leaves would stick away from them.
 */
export const getCellPinning = <TData extends ST_RowData>({
  column,
  header,
}: {
  column: ST_Column<TData>;
  header?: ST_Header<TData>;
}): 'end' | 'start' | false => {
  if (column.columnDef.columnDefType !== 'group') return column.getIsPinned();
  if (!header) return false;
  const sides = getLeafHeaders(header).map((leaf) => leaf.column.getIsPinned());
  return sides.length && sides.every((side) => side && side === sides[0])
    ? sides[0]
    : false;
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

  const isColumnPinned = getCellPinning({ column, header });
  // A group header spans its leaves, so it grows as they do together.
  const leafHeaders =
    header && columnDefType === 'group' ? getLeafHeaders(header) : undefined;
  const edgeColumn =
    leafHeaders && isColumnPinned
      ? (isColumnPinned === 'start' ? leafHeaders.at(-1) : leafHeaders[0])
          ?.column
      : column;

  const widthStyles: CSSProperties = {
    minWidth: `max(calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px), ${columnDef.minSize ?? 30}px)`,
    width: `calc(var(--${header ? 'header' : 'col'}-${parseCSSVarId(
      header?.id ?? column.id,
    )}-size) * 1px)`,
  };

  if (layoutMode === 'grid') {
    // A pinned column keeps its width, so the sticky offsets stay exact.
    const growOf = (
      cell: ST_Header<TData> | undefined,
      of: ST_Column<TData>,
    ) =>
      of.getIsPinned() || [0, false].includes(of.columnDef.grow!)
        ? []
        : [
            `var(--${cell ? 'header' : 'col'}-${parseCSSVarId(
              cell?.id ?? of.id,
            )}-size)`,
          ];
    const grows = leafHeaders
      ? leafHeaders.flatMap((leaf) => growOf(leaf, leaf.column))
      : isColumnPinned
        ? []
        : growOf(header, column);
    widthStyles.flex = `${
      !grows.length
        ? 0
        : grows.length === 1
          ? grows[0]
          : `calc(${grows.join(' + ')})`
    } 0 auto`;
  } else if (layoutMode === 'grid-no-grow') {
    widthStyles.flex = `${
      leafHeaders
        ? leafHeaders.reduce(
            (sum, leaf) => sum + +(leaf.column.columnDef.grow || 0),
            0,
          )
        : +(columnDef.grow || 0)
    } 0 auto`;
  }

  const pinnedStyles: { className?: string; style?: CSSProperties } =
    isColumnPinned
      ? {
          className: cn(
            getCommonPinnedCellStyles({ column: edgeColumn, table }),
            'sticky',
          ),
          style: {
            insetInlineStart:
              isColumnPinned === 'start'
                ? `${(leafHeaders?.[0]?.column ?? column).getStart('start')}px`
                : undefined,
            insetInlineEnd:
              isColumnPinned === 'end'
                ? `${(leafHeaders?.at(-1)?.column ?? column).getAfter('end')}px`
                : undefined,
          },
        }
      : {};

  return {
    className: cn(
      'bg-inherit',
      layoutMode?.startsWith('grid') && 'flex',
      // Head and footer cells fade with a column drag; body cells do not.
      header &&
        (draggingColumn?.id === column.id || hoveredColumn?.id === column.id)
        ? 'opacity-50'
        : 'opacity-100',
      'relative',
      enableColumnVirtualization
        ? 'transition-none'
        : 'transition-[padding] duration-150 ease-in-out',
      column.getIsResizing() || draggingColumn?.id === column.id
        ? 'z-2'
        : isColumnPinned
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
