import { type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { type ST_TooltipProps } from '@/components/ui-base/shadcn-table/components/buttons/ST_Tooltip';
import {
  type ST_Column,
  type ST_Header,
  type ST_RowData,
  type ST_CoreTableInstance,
  type TableCellProps,
} from '@/components/ui-base/shadcn-table/types';

// Collapse keyframes. tw-animate-css ships only the height pair and reads the
// Radix variable, which Base UI never sets; Collapsible.Panel measures itself
// into --collapsible-panel-height and --collapsible-panel-width, so both pairs
// live here. overflow: hidden sits inside the width keyframes so the panel
// clips only while it animates. Rendered as a hoisted
// <style href="st-base-collapsible"> by the components that animate with it.
export const stCollapsibleKeyframes = `@keyframes st-base-collapsible-down {
  from {
    height: 0;
  }
  to {
    height: var(--collapsible-panel-height);
  }
}

@keyframes st-base-collapsible-up {
  from {
    height: var(--collapsible-panel-height);
  }
  to {
    height: 0;
  }
}

@keyframes st-base-collapsible-right {
  from {
    width: 0;
    overflow: hidden;
  }
  to {
    width: var(--collapsible-panel-width);
    overflow: hidden;
  }
}

@keyframes st-base-collapsible-left {
  from {
    width: var(--collapsible-panel-width);
    overflow: hidden;
  }
  to {
    width: 0;
    overflow: hidden;
  }
}
`;

export const parseCSSVarId = (id: string) => id.replace(/[^a-zA-Z0-9]/g, '_');

export const getCommonPinnedCellStyles = <TData extends ST_RowData>({
  column,
}: {
  column?: ST_Column<TData>;
  table: ST_CoreTableInstance<TData>;
}) => {
  const isPinned = column?.getIsPinned();

  return cn(
    "data-[pinned=true]:before:absolute data-[pinned=true]:before:top-0 data-[pinned=true]:before:inset-s-0 data-[pinned=true]:before:z-[-1] data-[pinned=true]:before:h-full data-[pinned=true]:before:w-full data-[pinned=true]:before:bg-background/97 data-[pinned=true]:before:content-['']",
    column
      ? isPinned === 'start' && column.getIsLastColumn(isPinned)
        ? 'data-[pinned=true]:before:shadow-[-4px_0_4px_-4px_color-mix(in_oklab,var(--foreground)_15%,transparent)_inset]'
        : isPinned === 'end' && column.getIsFirstColumn(isPinned)
          ? 'data-[pinned=true]:before:shadow-[4px_0_4px_-4px_color-mix(in_oklab,var(--foreground)_15%,transparent)_inset]'
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
          className: cn(
            getCommonPinnedCellStyles({ column, table }),
            'sticky opacity-[0.97]',
          ),
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
  // Base UI applies the delay through the TooltipProvider that ST_Tooltip
  // wraps around each tooltip.
  side,
});
