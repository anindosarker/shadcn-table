import { memo, useMemo } from 'react';
import {
  useSRT_RowVirtualizer,
  useSRT_Rows,
  type SRT_ColumnVirtualizer,
  type SRT_Row,
  type SRT_RowData,
  type SRT_TableInstance,
  type SRT_VirtualItem,
} from 'shadcn-react-table-core';
import { cn } from '@/lib/utils';
import { SRT_TableBodyRow, Memo_SRT_TableBodyRow } from './SRT_TableBodyRow';

export interface SRT_TableBodyProps<TData extends SRT_RowData> {
  columnVirtualizer?: SRT_ColumnVirtualizer;
  table: SRT_TableInstance<TData>;
  className?: string;
}

/**
 * Table body - renders all data rows (or the empty-state fallback).
 *
 * Ports material-react-table's MRT_TableBody:
 * - Empty state (renderEmptyRowsFallback, otherwise localized message)
 * - Row virtualization (height = total size, interleaved detail-panel indices)
 * - Pinned rows rendered in separate sticky top / bottom tbody sections (when
 *   rowPinningDisplayMode is not 'sticky')
 * - memoMode === 'rows' memoization dispatch
 * - Center rows via useSRT_Rows + useSRT_RowVirtualizer
 *
 * MUI's `sx` theming is replaced with Tailwind classes; sticky offsets are
 * applied as inline styles derived from the head/footer ref heights.
 */
export const SRT_TableBody = <TData extends SRT_RowData>({
  columnVirtualizer,
  table,
  className,
}: SRT_TableBodyProps<TData>) => {
  const {
    getBottomRows,
    getRowModel,
    getState,
    getTopRows,
    getVisibleLeafColumns,
    options: {
      enableStickyFooter,
      enableStickyHeader,
      localization,
      memoMode,
      renderDetailPanel,
      renderEmptyRowsFallback,
      rowPinningDisplayMode,
    },
    refs: { tableContainerRef, tableFooterRef, tableHeadRef },
  } = table;
  const { columnFilters, globalFilter, isFullScreen, rowPinning } = getState();

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
  }, [rowPinning, getRowModel().rows]);

  const rows = useSRT_Rows(table);

  const rowVirtualizer = useSRT_RowVirtualizer(table, rows);

  const { virtualRows } = rowVirtualizer ?? {};

  const isSticky = rowPinningDisplayMode?.includes('sticky');
  const topRows = getTopRows();
  const bottomRows = getBottomRows();

  const commonRowProps = {
    columnVirtualizer,
    numRows: rows.length,
    table,
  };

  return (
    <>
      {!isSticky && topRows.length > 0 && (
        <tbody
          className={cn('sticky z-[1]', className)}
          style={{ top: tableHeadHeight - 1 }}
        >
          {topRows.map((row, staticRowIndex) => {
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
        className={cn('relative [&_tr:last-child]:border-0', className)}
        style={{
          height: rowVirtualizer
            ? `${rowVirtualizer.getTotalSize()}px`
            : undefined,
          minHeight: !rows.length ? '100px' : undefined,
        }}
      >
        {!rows.length ? (
          <tr>
            <td colSpan={getVisibleLeafColumns().length}>
              {renderEmptyRowsFallback?.({ table }) ?? (
                <p
                  className="w-full py-8 text-center text-muted-foreground italic"
                  style={{
                    maxWidth: `min(100vw, ${
                      tableContainerRef.current?.clientWidth ?? 360
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
          (virtualRows ?? rows).map((rowOrVirtualRow, staticRowIndex) => {
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
          })
        )}
      </tbody>
      {!isSticky && bottomRows.length > 0 && (
        <tbody
          className={cn('sticky z-[1]', className)}
          style={{ bottom: tableFooterHeight - 1 }}
        >
          {bottomRows.map((row, staticRowIndex) => {
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
