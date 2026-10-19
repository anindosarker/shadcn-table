import { type KeyboardEvent } from 'react';
// import { useTheme } from '@mui/material/styles';
// Note: useTheme dropped. align->text-start (logical, rtl-safe).
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_Header,
  type ST_RowData,
  type ST_TableInstance,
  type TableCellProps,
} from '@/components/ui/shadcn-table/types';
import { cellKeyboardShortcuts } from '@/components/ui/shadcn-table/utils/cell.utils';
import { getCommonSRTCellStyles } from '@/components/ui/shadcn-table/utils/style.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';

export interface ST_TableFooterCellProps<TData extends ST_RowData>
  extends TableCellProps {
  footer: ST_Header<TData>;
  staticColumnIndex?: number;
  table: ST_TableInstance<TData>;
}

const footerCellVariants = cva(
  'border-b text-xs leading-[1.3125rem] text-muted-foreground font-bold align-top',
);

export const ST_TableFooterCell = <TData extends ST_RowData>({
  footer,
  staticColumnIndex,
  table,
  ...rest
}: ST_TableFooterCellProps<TData>) => {
  // const theme = useTheme();
  const {
    options: {
      enableColumnPinning,
      stTableFooterCellProps,
      enableKeyboardShortcuts,
    },
  } = table;
  const { density } = table.state;
  const { column } = footer;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const isColumnPinned =
    enableColumnPinning &&
    columnDef.columnDefType !== 'group' &&
    column.getIsPinned();

  const args = { column, table };
  const tableCellProps = {
    ...parseFromValuesOrFunc(stTableFooterCellProps, args),
    ...parseFromValuesOrFunc(columnDef.stTableFooterCellProps, args),
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
