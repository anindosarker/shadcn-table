import { memo, useMemo } from 'react';
import { useSelector } from '@tanstack/react-store';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useST_Rows } from '@/components/ui-radix/shadcn-table/hooks/useST_Rows';
import { useST_RowVirtualizer } from '@/components/ui-radix/shadcn-table/hooks/useST_RowVirtualizer';
import { useST_RowFlip } from '@/components/ui-radix/shadcn-table/hooks/useST_RowFlip';
import {
  type ST_ColumnVirtualizer,
  type ST_Row,
  type ST_RowData,
  type ST_VirtualItem,
  type TableBodyProps,
} from '@/components/ui-radix/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_OverflowTooltipProvider } from '@/components/ui-radix/shadcn-table/components/body/ST_OverflowText';
import { ST_TableBodyRow } from '@/components/ui-radix/shadcn-table/components/body/ST_TableBodyRow';
import { useSTContext } from '@/components/ui-radix/shadcn-table/context/ST_TableContext';

export interface ST_TableBodyProps extends TableBodyProps {
  columnVirtualizer?: ST_ColumnVirtualizer;
}

// While the root waits for a stored view (`data-st-view-pending`), every
// cell hides its content and shows a skeleton bar.
const tableBodyVariants = cva(
  "group-data-st-view-pending/st:[&_td]:text-transparent group-data-st-view-pending/st:[&_td>*]:invisible group-data-st-view-pending/st:[&_td]:before:absolute group-data-st-view-pending/st:[&_td]:before:inset-s-2 group-data-st-view-pending/st:[&_td]:before:top-1/2 group-data-st-view-pending/st:[&_td]:before:h-4 group-data-st-view-pending/st:[&_td]:before:w-3/5 group-data-st-view-pending/st:[&_td]:before:-translate-y-1/2 group-data-st-view-pending/st:[&_td]:before:rounded group-data-st-view-pending/st:[&_td]:before:bg-muted group-data-st-view-pending/st:[&_td]:before:content-['']",
  {
    variants: {
      layout: { grid: 'grid', semantic: '' },
    },
  },
);

export const ST_TableBody = <TData extends ST_RowData>({
  columnVirtualizer,
  ...rest
}: ST_TableBodyProps) => {
  const table = useSTContext<TData>();
  const {
    getBottomRows,
    getIsSomeRowsPinned,
    getTopRows,
    options: {
      enableStickyFooter,
      enableStickyHeader,
      layoutMode,
      localization,
      renderDetailPanel,
      renderEmptyRowsFallback,
      rowPinningDisplayMode,
      stTableBodyProps,
    },
    refs: { tableFooterRef, tableHeadRef, tableLayoutRef },
  } = table;

  const tableBodyProps = {
    ...parseFromValuesOrFunc(stTableBodyProps, { table }),
    ...rest,
  };

  const rowPinning = useSelector(table.atoms.rowPinning);

  // useST_Rows subscribes this body to every slice that feeds the row model
  // (filters, global filter, sorting, grouping, expanded, pagination, row
  // pinning, creating row), so the row model reads below stay current.
  const rows = useST_Rows(table);
  useST_RowFlip(table, rows);

  // The sticky stacking order: the pinned rows as the body shows them, the
  // rows kept from other pages included.
  const pinnedRowIds = useMemo(() => {
    if (!rowPinning.bottom?.length && !rowPinning.top?.length) return [];
    return rows.filter((row) => row.getIsPinned()).map((r) => r.id);
  }, [rowPinning, rows]);

  const rowVirtualizer = useST_RowVirtualizer(table, rows);

  const { virtualRows } = rowVirtualizer ?? {};

  const commonRowProps = {
    columnVirtualizer,
    numRows: rows.length,
  };

  // The rows are created outside the state subscription, so a full screen or
  // filter change re-renders only the tbody elements, not every row.
  const topRows =
    !rowPinningDisplayMode?.includes('sticky') && getIsSomeRowsPinned('top')
      ? getTopRows().map((row, staticRowIndex) => {
          const props = {
            ...commonRowProps,
            row,
            staticRowIndex,
          };
          return <ST_TableBodyRow key={row.id} {...props} />;
        })
      : null;

  const centerRows = (virtualRows ?? rows).map(
    (rowOrVirtualRow, staticRowIndex) => {
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
      return <ST_TableBodyRow key={key} {...props} />;
    },
  );

  const bottomRows =
    !rowPinningDisplayMode?.includes('sticky') && getIsSomeRowsPinned('bottom')
      ? getBottomRows().map((row, staticRowIndex) => {
          const props = {
            ...commonRowProps,
            row,
            staticRowIndex,
          };
          return <ST_TableBodyRow key={row.id} {...props} />;
        })
      : null;

  return (
    <table.Subscribe
      selector={(state) => ({
        columnFilters: state.columnFilters,
        columnVisibility: state.columnVisibility,
        globalFilter: state.globalFilter,
        isFullScreen: state.isFullScreen,
        stickyHeader: state.viewSettings.stickyHeader,
      })}
    >
      {({ columnFilters, globalFilter, isFullScreen, stickyHeader }) => {
        const tableHeadHeight =
          ((enableStickyHeader || stickyHeader || isFullScreen) &&
            tableHeadRef.current?.clientHeight) ||
          0;
        const tableFooterHeight =
          (enableStickyFooter && tableFooterRef.current?.clientHeight) || 0;

        return (
          <ST_OverflowTooltipProvider>
            {topRows && (
              <tbody
                {...tableBodyProps}
                className={cn(
                  tableBodyVariants({
                    layout: layoutMode?.startsWith('grid')
                      ? 'grid'
                      : 'semantic',
                  }),
                  'sticky z-1',
                  tableBodyProps?.className,
                )}
                style={{ top: tableHeadHeight - 1, ...tableBodyProps?.style }}
              >
                {topRows}
              </tbody>
            )}
            <tbody
              {...tableBodyProps}
              className={cn(
                tableBodyVariants({
                  layout: layoutMode?.startsWith('grid') ? 'grid' : 'semantic',
                }),
                'relative',
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
                      display: layoutMode?.startsWith('grid')
                        ? 'grid'
                        : undefined,
                    }}
                  >
                    <td
                      colSpan={table.getVisibleLeafColumns().length}
                      style={{
                        display: layoutMode?.startsWith('grid')
                          ? 'grid'
                          : undefined,
                      }}
                    >
                      {renderEmptyRowsFallback?.({ table }) ?? (
                        <p
                          className="flex h-24 w-full items-center justify-center text-center text-muted-foreground"
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
                  <>{centerRows}</>
                ))}
            </tbody>
            {bottomRows && (
              <tbody
                {...tableBodyProps}
                className={cn(
                  tableBodyVariants({
                    layout: layoutMode?.startsWith('grid')
                      ? 'grid'
                      : 'semantic',
                  }),
                  'sticky z-1',
                  tableBodyProps?.className,
                )}
                style={{
                  bottom: tableFooterHeight - 1,
                  ...tableBodyProps?.style,
                }}
              >
                {bottomRows}
              </tbody>
            )}
          </ST_OverflowTooltipProvider>
        );
      }}
    </table.Subscribe>
  );
};

export const Memo_ST_TableBody = memo(ST_TableBody) as typeof ST_TableBody;
