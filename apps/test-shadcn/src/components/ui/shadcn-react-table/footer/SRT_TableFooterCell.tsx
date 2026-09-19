import { type KeyboardEvent } from 'react';
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
// Note: useTheme/Theme dropped project-wide — shadcn tokens + logical CSS replace it.
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export interface SRT_TableFooterCellProps<TData extends SRT_RowData>
  extends TdProps {
  footer: SRT_Header<TData>;
  staticColumnIndex?: number;
  table: SRT_TableInstance<TData>;
}

// Note: getCommonMRTCellStyles' backgroundImage:inherit dropped — no MUI Paper/mrtTheme ancestor sets one.
const footerCellVariants = cva(
  'relative bg-inherit font-bold align-top text-xs leading-[1.3125rem] text-muted-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring',
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

  const args = { column, table };
  const tableCellProps = {
    ...parseFromValuesOrFunc(srtTableFooterCellProps, args),
    ...parseFromValuesOrFunc(columnDef.srtTableFooterCellProps, args),
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

  return (
    <td
      // align={columnDefType === 'group' ? 'center' : theme.direction === 'rtl' ? 'right' : 'left'}
      // Note: → text-center / logical text-start classes below (rtl-safe without theme).
      colSpan={footer.colSpan}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      // variant="footer"
      // Note: no td analogue — MUI footer-variant defaults folded into footerCellVariants.
      {...tableCellProps}
      className={cn(
        footerCellVariants(),
        columnDefType === 'group' ? 'text-center justify-center' : 'text-start',
        layoutMode?.startsWith('grid') && 'flex',
        density === 'compact'
          ? 'p-2'
          : density === 'comfortable'
            ? 'p-4'
            : 'p-6',
        (draggingColumn?.id === column.id || hoveredColumn?.id === column.id) &&
          'opacity-50',
        !enableColumnVirtualization &&
          'transition-[padding] duration-150 ease-in-out',
        column.getIsResizing() || draggingColumn?.id === column.id
          ? 'z-[2]'
          : columnDefType !== 'group' && isColumnPinned
            ? 'z-[1]'
            : 'z-0',
        // Note: getCommonPinnedCellStyles' :before bg/edge-shadow → td owns bg (plan); placed after opacity-50 so 0.97 wins.
        isColumnPinned && 'bg-background opacity-[0.97]',
        tableCellProps?.className,
      )}
      style={{
        ...getSRTCellWidthStyles({ column, header: footer, table }),
        ...getSRTPinnedCellStyles({ column, table }),
        ...tableCellProps?.style,
      }}
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
