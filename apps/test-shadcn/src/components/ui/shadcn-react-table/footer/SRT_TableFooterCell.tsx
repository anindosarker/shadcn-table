import { type CSSProperties, type KeyboardEvent } from 'react';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  type TdProps,
  cellKeyboardShortcuts,
  getSRTCellWidthStyles,
  getSRTPinnedCellStyles,
  parseFromValuesOrFunc,
} from 'shadcn-react-table-core';
// import { useTheme } from '@mui/material/styles';
// Note: useTheme/Theme dropped project-wide — logical CSS + shadcn tokens replace
// MUI's manual `theme.direction === 'rtl'` alignment branch here.
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export interface SRT_TableFooterCellProps<TData extends SRT_RowData>
  extends TdProps {
  footer: SRT_Header<TData>;
  staticColumnIndex?: number;
  table: SRT_TableInstance<TData>;
}

// Base folds getCommonMRTCellStyles' static pieces (backgroundColor inherit →
// bg-inherit; MRT's backgroundImage:inherit is moot here and intentionally
// dropped), position relative, verticalAlign top, fontWeight bold, and the
// focus-visible cell-navigation outline (cellNavigationOutlineColor → ring
// token) since footer cells are keyboard-focusable. Density paddings / opacity
// / zIndex / layout are runtime-conditional in cn().
const footerCellVariants = cva(
  'relative bg-inherit font-bold align-top focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
);

export const SRT_TableFooterCell = <TData extends SRT_RowData>({
  footer,
  staticColumnIndex,
  table,
  ...rest
}: SRT_TableFooterCellProps<TData>) => {
  const {
    getState,
    options: {
      enableColumnPinning,
      enableColumnVirtualization,
      enableKeyboardShortcuts,
      layoutMode,
      srtTableFooterCellProps,
    },
  } = table;
  const { density, draggingColumn, hoveredColumn } = getState();
  const { column } = footer;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const tableCellProps = {
    ...parseFromValuesOrFunc(srtTableFooterCellProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.srtTableFooterCellProps, {
      column,
      table,
    }),
    ...rest,
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTableCellElement>) => {
    tableCellProps?.onKeyDown?.(event);
    cellKeyboardShortcuts({
      event,
      cellValue: footer.column.columnDef.footer,
      table,
    });
  };

  const isDraggingOrHovered =
    draggingColumn?.id === column.id || hoveredColumn?.id === column.id;

  return (
    // MUI `variant="footer"` dropped — no native <td> analogue; the footer's
    // visual treatment lives in the classes below.
    <td
      colSpan={footer.colSpan}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      {...tableCellProps}
      className={cn(
        footerCellVariants(),
        // align dropped → logical text-align; group also centers content.
        // Note: MRT's `theme.direction === 'rtl' ? 'right' : 'left'` branch is
        // replaced by logical `text-start`, which handles rtl without a theme.
        columnDefType === 'group' ? 'text-center justify-center' : 'text-start',
        layoutMode?.startsWith('grid') && 'flex',
        // density paddings — MRT's exact rem values (0.5/1/1.5rem).
        density === 'compact'
          ? 'p-2'
          : density === 'comfortable'
            ? 'p-4'
            : 'p-6',
        isDraggingOrHovered && 'opacity-50',
        !enableColumnVirtualization &&
          'transition-[padding] duration-150 ease-in-out',
        column.getIsResizing() || draggingColumn?.id === column.id
          ? 'z-[2]'
          : columnDefType !== 'group' && isColumnPinned
            ? 'z-[1]'
            : 'z-0',
        // Pinned td owns its bg (June deviation) — spread after opacity so its
        // 0.97 wins, matching getCommonMRTCellStyles' pinnedStyles order.
        isColumnPinned && 'bg-background opacity-[0.97]',
        tableCellProps?.className,
      )}
      style={
        {
          ...getSRTCellWidthStyles({ column, header: footer, table }),
          ...(isColumnPinned ? getSRTPinnedCellStyles({ column, table }) : {}),
          ...tableCellProps?.style,
        } as CSSProperties
      }
      onKeyDown={handleKeyDown}
    >
      {tableCellProps.children ??
        (footer.isPlaceholder
          ? null
          : (parseFromValuesOrFunc(columnDef.Footer, {
              column,
              footer,
              table,
            }) ??
            columnDef.footer ??
            null))}
    </td>
  );
};
