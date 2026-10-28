import { type KeyboardEvent } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_Header,
  type ST_RowData,
  type TableCellProps,
} from '@/components/ui-aria/shadcn-table/types';
import { cellKeyboardShortcuts } from '@/components/ui-aria/shadcn-table/shared/utils/cell.utils';
import { getCommonSRTCellStyles } from '@/components/ui-aria/shadcn-table/shared/utils/style.utils';
import { parseFromValuesOrFunc } from '@/components/ui-aria/shadcn-table/shared/utils/utils';

export interface ST_TableFooterCellProps<TData extends ST_RowData>
  extends TableCellProps {
  footer: ST_Header<TData>;
  staticColumnIndex?: number;
}

const footerCellVariants = cva(
  'border-b text-xs leading-[1.3125rem] text-muted-foreground font-bold align-top',
);

export const ST_TableFooterCell = <TData extends ST_RowData>({
  footer,
  staticColumnIndex,
  ...rest
}: ST_TableFooterCellProps<TData>) => {
  const table = footer.table;
  const {
    options: {
      enableColumnPinning,
      stTableFooterCellProps,
      enableKeyboardShortcuts,
    },
  } = table;
  const { column } = footer;
  const { columnDef } = column;
  const { columnDefType } = columnDef;

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

  return (
    // The pinned offsets and edge shadows follow the column sizing, order,
    // pinning and visibility; a custom `Footer` often totals the filtered,
    // grouped, paginated or selected rows.
    <Subscribe
      selector={(state) => ({
        columnFilters: state.columnFilters,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnVisibility: state.columnVisibility,
        density: state.density,
        draggingColumn: state.draggingColumn,
        expanded: state.expanded,
        globalFilter: state.globalFilter,
        grouping: state.grouping,
        hoveredColumn: state.hoveredColumn,
        isResizingColumn: state.columnResizing.isResizingColumn === column.id,
        pagination: state.pagination,
        // A pinned cell's offset follows the other columns' sizes; widths
        // come from the CSS vars ST_Table sets.
        pinnedColumnSizing:
          enableColumnPinning &&
          columnDef.columnDefType !== 'group' &&
          column.getIsPinned()
            ? state.columnSizing
            : undefined,
        rowSelection: state.rowSelection,
        sorting: state.sorting,
      })}
      source={table.store}
    >
      {({ density }) => {
        const isColumnPinned =
          enableColumnPinning &&
          columnDef.columnDefType !== 'group' &&
          column.getIsPinned();

        const commonCellStyles = getCommonSRTCellStyles({
          column,
          header: footer,
          table,
          tableCellProps,
        });

        return (
          <td
            colSpan={footer.colSpan}
            data-index={staticColumnIndex}
            data-pinned={!!isColumnPinned || undefined}
            tabIndex={enableKeyboardShortcuts ? 0 : undefined}
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
      }}
    </Subscribe>
  );
};
