import { memo, useMemo } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useST_Rows } from '@/components/ui/shadcn-table/hooks/useST_Rows';
import { useST_RowVirtualizer } from '@/components/ui/shadcn-table/hooks/useST_RowVirtualizer';
import {
  type ST_ColumnVirtualizer,
  type ST_Row,
  type ST_RowData,
  type ST_TableInstance,
  type ST_VirtualItem,
  type TableBodyProps,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import {
  ST_TableBodyRow,
  Memo_ST_TableBodyRow,
} from '@/components/ui/shadcn-table/body/ST_TableBodyRow';

export interface ST_TableBodyProps<TData extends ST_RowData>
  extends TableBodyProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
  table: ST_TableInstance<TData>;
}

const tableBodyVariants = cva('', {
  variants: {
    layout: { grid: 'grid', semantic: '' },
  },
});

export const ST_TableBody = <TData extends ST_RowData>({
  columnVirtualizer,
  table,
  ...rest
}: ST_TableBodyProps<TData>) => {
  const {
    getBottomRows,
    getIsSomeRowsPinned,
    getRowModel,
    getTopRows,
    options: {
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      localization,
      memoMode,
      renderDetailPanel,
      renderEmptyRowsFallback,
      rowPinningDisplayMode,
      stTableBodyProps,
    },
    refs: { tableFooterRef, tableHeadRef, tableLayoutRef },
  } = table;
  const { columnFilters, globalFilter, isFullScreen, rowPinning } = table.state;

  const tableBodyProps = {
    ...parseFromValuesOrFunc(stTableBodyProps, { table }),
    ...rest,
  };

  const tableHeadHeight =
    ((enableStickyHeader || isFullScreen) &&
      tableHeadRef.current?.clientHeight) ||
    0;
  const tableFooterHeight =
    (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

  const pinnedRowIds = useMemo(() => {
    if (!rowPinning.bottom?.length && !rowPinning.top?.length) return [];
    return getRowModel()
      .rows.filter((row) => row.getIsPinned())
      .map((r) => r.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowPinning, getRowModel().rows]);

  const rows = useST_Rows(table);

  const rowVirtualizer = useST_RowVirtualizer(table, rows);

  const { virtualRows } = rowVirtualizer ?? {};

  const commonRowProps = {
    columnVirtualizer,
    numRows: rows.length,
    table,
  };

  return (
    <>
      {!rowPinningDisplayMode?.includes('sticky') &&
        getIsSomeRowsPinned('top') && (
          <tbody
            {...tableBodyProps}
            className={cn(
              tableBodyVariants({
                layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
              }),
              'sticky z-[1]',
              tableBodyProps?.className,
            )}
            style={{ top: tableHeadHeight - 1, ...tableBodyProps?.style }}
          >
            {getTopRows().map((row, staticRowIndex) => {
              const props = {
                ...commonRowProps,
                row,
                staticRowIndex,
              };
              return memoMode === 'rows' ? (
                <Memo_ST_TableBodyRow key={row.id} {...props} />
              ) : (
                <ST_TableBodyRow key={row.id} {...props} />
              );
            })}
          </tbody>
        )}
      <tbody
        {...tableBodyProps}
        className={cn(
          tableBodyVariants({
            layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
          }),
          'relative',
          !rows.length && 'min-h-[100px]',
          tableBodyProps?.className,
        )}
        style={{
          height: rowVirtualizer
            ? `${rowVirtualizer.getTotalSize()}px`
            : undefined,
          ...tableBodyProps?.style,
        }}
      >
        {tableBodyProps?.children ??
          (!rows.length ? (
            <tr
              style={{
                display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
              }}
            >
              <td
                colSpan={table.getVisibleLeafColumns().length}
                style={{
                  display: layoutMode?.startsWith('grid') ? 'grid' : undefined,
                }}
              >
                {renderEmptyRowsFallback?.({ table }) ?? (
                  <p
                    className="w-full py-8 text-center text-muted-foreground italic"
                    style={{
                      maxWidth: `min(100vw, ${
                        tableLayoutRef.current?.clientWidth ?? 360
                      }px)`,
                    }}
                  >
                    {globalFilter || columnFilters.length
                      ? localization.noResultsFound
                      : localization.noRecordsToDisplay}
                  </p>
                )}
              </td>
            </tr>
          ) : (
            <>
              {(virtualRows ?? rows).map((rowOrVirtualRow, staticRowIndex) => {
                let row = rowOrVirtualRow as ST_Row<TData>;
                if (rowVirtualizer) {
                  if (renderDetailPanel) {
                    if (rowOrVirtualRow.index % 2 === 1) {
                      return null;
                    } else {
                      staticRowIndex = rowOrVirtualRow.index / 2;
                    }
                  } else {
                    staticRowIndex = rowOrVirtualRow.index;
                  }
                  row = rows[staticRowIndex];
                }
                const props = {
                  ...commonRowProps,
                  pinnedRowIds,
                  row,
                  rowVirtualizer,
                  staticRowIndex,
                  virtualRow: rowVirtualizer
                    ? (rowOrVirtualRow as ST_VirtualItem)
                    : undefined,
                };
                const key = `${row.id}-${row.index}`;
                return memoMode === 'rows' ? (
                  <Memo_ST_TableBodyRow key={key} {...props} />
                ) : (
                  <ST_TableBodyRow key={key} {...props} />
                );
              })}
            </>
          ))}
      </tbody>
      {!rowPinningDisplayMode?.includes('sticky') &&
        getIsSomeRowsPinned('bottom') && (
          <tbody
            {...tableBodyProps}
            className={cn(
              tableBodyVariants({
                layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
              }),
              'sticky z-[1]',
              tableBodyProps?.className,
            )}
            style={{ bottom: tableFooterHeight - 1, ...tableBodyProps?.style }}
          >
            {getBottomRows().map((row, staticRowIndex) => {
              const props = {
                ...commonRowProps,
                row,
                staticRowIndex,
              };
              return memoMode === 'rows' ? (
                <Memo_ST_TableBodyRow key={row.id} {...props} />
              ) : (
                <ST_TableBodyRow key={row.id} {...props} />
              );
            })}
          </tbody>
        )}
    </>
  );
};

export const Memo_ST_TableBody = memo(
  ST_TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof ST_TableBody;
