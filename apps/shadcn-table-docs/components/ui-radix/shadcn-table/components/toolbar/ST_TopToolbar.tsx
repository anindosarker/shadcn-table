import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { type ST_RowData } from '@/components/ui-radix/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_LinearProgressBar } from '@/components/ui-radix/shadcn-table/components/toolbar/ST_LinearProgressBar';
import { ST_TablePagination } from '@/components/ui-radix/shadcn-table/components/toolbar/ST_TablePagination';
import { ST_ToolbarAlertBanner } from '@/components/ui-radix/shadcn-table/components/toolbar/ST_ToolbarAlertBanner';
import { ST_ToolbarDropZone } from '@/components/ui-radix/shadcn-table/components/toolbar/ST_ToolbarDropZone';
import { ST_ToolbarInternalButtons } from '@/components/ui-radix/shadcn-table/components/toolbar/ST_ToolbarInternalButtons';
import { useST_MediaQuery } from '@/components/ui-radix/shadcn-table/hooks/useST_MediaQuery';
import { ST_GlobalFilterTextField } from '@/components/ui-radix/shadcn-table/components/inputs/ST_GlobalFilterTextField';
import { Separator } from '@/components/ui-radix/separator';
import { ST_FilterChips } from '@/components/ui-radix/shadcn-table/components/toolbar/ST_FilterChips';
import { ST_SortPopover } from '@/components/ui-radix/shadcn-table/components/toolbar/ST_SortPopover';
import { useSTContext } from '@/components/ui-radix/shadcn-table/hooks/stTableHook';
import { useST_ComposedRef } from '@/components/ui-radix/shadcn-table/hooks/useST_ComposedRef';

const topToolbarVariants = cva(
  'relative z-1 grid min-h-14 items-start overflow-hidden bg-background flex-wrap-reverse transition-all duration-150 ease-in-out',
);

export const ST_TopToolbar = <TData extends ST_RowData>() => {
  const table = useSTContext<TData>();
  const {
    options: {
      columnFilterDisplayMode,
      enableColumnFilters,
      enableFilters,
      enableGlobalFilter,
      enableSortPopover,
      enableSorting,
      enablePagination,
      enableToolbarInternalActions,
      stTopToolbarProps,
      positionGlobalFilter,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderTopToolbarCustomActions,
    },
    refs: { topToolbarRef },
  } = table;

  const isMobile = useST_MediaQuery('(max-width:720px)');
  const isTablet = useST_MediaQuery('(max-width:1024px)');

  const toolbarProps = parseFromValuesOrFunc(stTopToolbarProps, { table });

  const attachRef = useST_ComposedRef(topToolbarRef, toolbarProps?.ref);

  const globalFilterProps = {
    className: !isTablet ? 'z-2' : undefined,
  };

  // Created outside the state subscription, so a full screen or global filter
  // change does not re-render them.
  const dropZone = ['both', 'top'].includes(positionToolbarDropZone ?? '') && (
    <ST_ToolbarDropZone />
  );
  const hasChips =
    !!enableFilters &&
    !!enableColumnFilters &&
    columnFilterDisplayMode === 'chips';
  const hasSortChip = !!enableSorting && enableSortPopover === true;
  const renderActions = (showSeparator: boolean) => (
    <>
      <div className="flex min-h-9 min-w-0 flex-1 flex-wrap items-center gap-1.5 py-1">
        {enableGlobalFilter && positionGlobalFilter === 'left' && (
          <ST_GlobalFilterTextField {...globalFilterProps} />
        )}
        {hasSortChip && <ST_SortPopover table={table} variant="chip" />}
        {showSeparator && (
          <Separator className="h-4! self-center!" orientation="vertical" />
        )}
        {hasChips && <ST_FilterChips table={table} />}
        {renderTopToolbarCustomActions && (
          // The actions read the table, most often the selected rows, so they
          // re-render on the state they commonly read; the toolbar does not.
          <table.Subscribe
            selector={(state) => ({
              columnFilters: state.columnFilters,
              globalFilter: state.globalFilter,
              rowSelection: state.rowSelection,
              sorting: state.sorting,
            })}
          >
            {() => renderTopToolbarCustomActions({ table })}
          </table.Subscribe>
        )}
      </div>
      {enableToolbarInternalActions ? (
        <div className="flex shrink-0 flex-wrap-reverse items-center justify-end gap-2">
          {enableGlobalFilter && positionGlobalFilter === 'right' && (
            <ST_GlobalFilterTextField {...globalFilterProps} />
          )}
          <ST_ToolbarInternalButtons />
        </div>
      ) : (
        enableGlobalFilter &&
        positionGlobalFilter === 'right' && (
          <ST_GlobalFilterTextField {...globalFilterProps} />
        )
      )}
    </>
  );
  const pagination = enablePagination &&
    ['both', 'top'].includes(positionPagination ?? '') && (
      <ST_TablePagination position="top" />
    );
  const progressBar = <ST_LinearProgressBar isTopToolbar />;

  return (
    <table.Subscribe
      selector={(state) => ({
        hasFilterChips:
          state.filterChips.columnIds.length > 0 ||
          state.columnFilters.length > 0,
        hasSorts: state.sorting.length > 0,
        showGlobalFilter: state.showGlobalFilter,
      })}
    >
      {({ hasFilterChips, hasSorts, showGlobalFilter }) => {
        const showSortChip = hasSortChip && hasSorts;
        const hasChipRow = showSortChip || (hasChips && hasFilterChips);
        const stackAlertBanner =
          isMobile ||
          !!renderTopToolbarCustomActions ||
          hasChipRow ||
          (showGlobalFilter && isTablet);

        return (
          <div
            {...toolbarProps}
            ref={attachRef}
            className={cn(topToolbarVariants(), toolbarProps?.className)}
          >
            {positionToolbarAlertBanner === 'top' && (
              <ST_ToolbarAlertBanner stackAlertBanner={stackAlertBanner} />
            )}
            {dropZone}
            <div
              className={cn(
                'box-border flex w-full items-start justify-between gap-2 p-2 inset-e-0 top-0',
                stackAlertBanner ? 'relative' : 'absolute',
              )}
            >
              {renderActions(showSortChip && hasChips && hasFilterChips)}
            </div>
            {pagination}
            {progressBar}
          </div>
        );
      }}
    </table.Subscribe>
  );
};
