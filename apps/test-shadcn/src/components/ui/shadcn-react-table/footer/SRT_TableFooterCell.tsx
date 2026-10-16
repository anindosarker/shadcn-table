import { type KeyboardEvent } from 'react';
// import { useTheme } from '@mui/material/styles';
// Note: useTheme dropped. align->text-start (logical, rtl-safe).
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type SRT_Header,
  type SRT_RowData,
  type SRT_TableInstance,
  type TableCellProps,
} from '../types';
import { cellKeyboardShortcuts } from '../utils/cell.utils';
import { getCommonSRTCellStyles } from '../utils/style.utils';
import { parseFromValuesOrFunc } from '../utils/utils';

export interface SRT_TableFooterCellProps<TData extends SRT_RowData>
  extends TableCellProps {
  footer: SRT_Header<TData>;
  staticColumnIndex?: number;
  table: SRT_TableInstance<TData>;
}

const footerCellVariants = cva(
  'border-b text-xs leading-[1.3125rem] text-muted-foreground font-bold align-top',
);

export const SRT_TableFooterCell = <TData extends SRT_RowData>({
  footer,
  staticColumnIndex,
  table,
  ...rest
}: SRT_TableFooterCellProps<TData>) => {
  // const theme = useTheme();
  const {
    getState,
    options: {
      enableColumnPinning,
      srtTableFooterCellProps,
      enableKeyboardShortcuts,
    },
  } = table;
  const { density } = getState();
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

  const commonCellStyles = getCommonSRTCellStyles({
    column,
    header: footer,
    table,
    tableCellProps,
  });

  return (
    <td
      // align={columnDefType === 'group' ? 'center' : theme.direction === 'rtl' ? 'right' : 'left'}
      // Note: MUI align classes mapped in className below; user `align` wins like the MRT spread.
      colSpan={footer.colSpan}
      data-index={staticColumnIndex}
      data-pinned={!!isColumnPinned || undefined}
      tabIndex={enableKeyboardShortcuts ? 0 : undefined}
      // variant="footer"
      // Note: no td analogue. MUI footer-variant defaults folded into footerCellVariants.
      {...tableCellProps}
      onKeyDown={handleKeyDown}
      className={cn(
        footerCellVariants(),
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
        density === 'compact'
          ? 'p-2'
          : density === 'comfortable'
            ? 'p-4'
            : 'p-6',
        commonCellStyles.className,
      )}
      style={commonCellStyles.style}
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
