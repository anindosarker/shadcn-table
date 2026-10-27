import { type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { type ST_TooltipProps } from '@/components/ui/shadcn-table/ST_Tooltip';
import {
  type ST_Column,
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
  type TableCellProps,
} from '@/components/ui/shadcn-table/types';

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

// export const getSRTTheme = (...) => { ... };
// Note: mrtTheme dropped project-wide; shadcn theme tokens replace it.

// export const commonCellBeforeAfterStyles = { ... };
// Note: Tailwind prefixes each class with its pseudo variant, so the fill is written literally at each use.

export const getCommonPinnedCellStyles = <TData extends ST_RowData>({
  column,
}: {
  column?: ST_Column<TData>;
  table: ST_TableInstance<TData>;
}) => {
  const isPinned = column?.getIsPinned();

  return cn(
    "data-[pinned=true]:before:absolute data-[pinned=true]:before:top-0 data-[pinned=true]:before:left-0 data-[pinned=true]:before:-z-[1] data-[pinned=true]:before:h-full data-[pinned=true]:before:w-full data-[pinned=true]:before:bg-background/97 data-[pinned=true]:before:content-['']",
    column
      ? isPinned === 'start' && column.getIsLastColumn(isPinned)
        ? 'data-[pinned=true]:before:shadow-[-4px_0_4px_-4px_rgba(97,97,97,0.5)_inset]'
        : isPinned === 'end' && column.getIsFirstColumn(isPinned)
          ? 'data-[pinned=true]:before:shadow-[4px_0_4px_-4px_rgba(97,97,97,0.5)_inset]'
          : undefined
      : undefined,
  );
};

export const getCommonSRTCellStyles = <TData extends ST_RowData>({
  column,
  header,
  table,
  tableCellProps,
}: {
  column: ST_Column<TData>;
  header?: ST_Header<TData>;
  table: ST_TableInstance<TData>;
  tableCellProps: TableCellProps;
}) => {
  const {
    options: { enableColumnVirtualization, layoutMode },
    state: { draggingColumn, hoveredColumn },
  } = table;
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
          className: cn(
            getCommonPinnedCellStyles({ column, table }),
            'sticky opacity-[0.97]',
          ),
          style: {
            left:
              isColumnPinned === 'start'
                ? `${column.getStart('start')}px`
                : undefined,
            right:
              isColumnPinned === 'end'
                ? `${column.getAfter('end')}px`
                : undefined,
          },
        }
      : {};

  return {
    className: cn(
      'bg-inherit',
      // backgroundImage: 'inherit',
      // Note: no ancestor sets a background-image without MUI Paper.
      layoutMode?.startsWith('grid') && 'flex',
      draggingColumn?.id === column.id || hoveredColumn?.id === column.id
        ? 'opacity-50'
        : 'opacity-100',
      'relative',
      enableColumnVirtualization
        ? 'transition-none'
        : 'transition-[padding] duration-150 ease-in-out',
      column.getIsResizing() || draggingColumn?.id === column.id
        ? 'z-[2]'
        : columnDefType !== 'group' && isColumnPinned
          ? 'z-[1]'
          : 'z-0',
      'focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
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

export const getCommonToolbarStyles = () =>
  'relative z-[1] grid min-h-14 flex-wrap-reverse items-start overflow-hidden bg-background transition-all duration-150 ease-in-out';

export const flipIconStyles = () => ({ className: 'rtl:-scale-x-100' });

export const getCommonTooltipProps = (
  side?: ST_TooltipProps['side'],
): Partial<ST_TooltipProps> => ({
  delayDuration: 1000,
  disableHoverableContent: true,
  // enterNextDelay: 1000,
  // Note: Base UI keeps the skip window on TooltipProvider (`timeout`); the
  // delay applies through the TooltipProvider that ST_Tooltip wraps around
  // each tooltip.
  side,
});
