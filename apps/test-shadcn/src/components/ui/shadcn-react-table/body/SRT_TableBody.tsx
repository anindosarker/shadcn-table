import { memo, useMemo } from 'react';
import {
  parseFromValuesOrFunc,
  useSRT_RowVirtualizer,
  useSRT_Rows,
  type SRT_ColumnVirtualizer,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  type SRT_VirtualItem,
  type TableBodyProps,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_TableBodyRow, Memo_SRT_TableBodyRow } from './SRT_TableBodyRow';

export interface SRT_TableBodyProps<TData extends SRT_RowData>
  extends TableBodyProps {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  table: SRT_TableInstance<TData>;
}

const tableBodyVariants = cva('', {
  variants: {
    layout: { grid: 'grid', semantic: '' },
  },
});

export const SRT_TableBody = <TData extends SRT_RowData>({
  columnVirtualizer,
  table,
  ...rest
}: SRT_TableBodyProps<TData>) => {
  const {
    getBottomRows,
    getIsSomeRowsPinned,
    getRowModel,
    getState,
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
      srtTableBodyProps,
    },
    refs: { tableFooterRef, tableHeadRef, tableLayoutRef },
  } = table;
  const { columnFilters, globalFilter, isFullScreen, rowPinning } = getState();

  const tableBodyProps = {
    ...parseFromValuesOrFunc(srtTableBodyProps, { table }),
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

  const rows = useSRT_Rows(table);

  const rowVirtualizer = useSRT_RowVirtualizer(table, rows);

  const { virtualRows } = rowVirtualizer ?? {};

  const layout = layoutMode?.startsWith('grid') ? 'grid' : 'semantic';

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
              tableBodyVariants({ layout }),
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
                <Memo_SRT_TableBodyRow key={row.id} {...props} />
              ) : (
                <SRT_TableBodyRow key={row.id} {...props} />
              );
            })}
          </tbody>
        )}
      <tbody
        {...tableBodyProps}
        className={cn(
          tableBodyVariants({ layout }),
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
                let row = rowOrVirtualRow as SRT_Row<TData>;
                if (rowVirtualizer) {
                  if (renderDetailPanel) {
                    if ((rowOrVirtualRow as SRT_VirtualItem).index % 2 === 1) {
                      return null;
                    } else {
                      staticRowIndex =
                        (rowOrVirtualRow as SRT_VirtualItem).index / 2;
                    }
                  } else {
                    staticRowIndex = (rowOrVirtualRow as SRT_VirtualItem).index;
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
                    ? (rowOrVirtualRow as SRT_VirtualItem)
                    : undefined,
                };
                const key = `${row.id}-${row.index}`;
                return memoMode === 'rows' ? (
                  <Memo_SRT_TableBodyRow key={key} {...props} />
                ) : (
                  <SRT_TableBodyRow key={key} {...props} />
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
              tableBodyVariants({ layout }),
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
                <Memo_SRT_TableBodyRow key={row.id} {...props} />
              ) : (
                <SRT_TableBodyRow key={row.id} {...props} />
              );
            })}
          </tbody>
        )}
    </>
  );
};

export const Memo_SRT_TableBody = memo(
  SRT_TableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof SRT_TableBody;
