import { Alert, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Fragment, type MouseEvent } from 'react';
import {
  type ST_RowData,
  type ST_TableOptions,
} from '@/components/ui/shadcn-table/types';
import { getST_SelectAllHandler } from '@/components/ui/shadcn-table/shared/utils/row.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_SelectCheckbox } from '@/components/ui/shadcn-table/components/inputs/ST_SelectCheckbox';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';
import { stCollapsibleKeyframes } from '@/components/ui/shadcn-table/shared/utils/style.utils';

export interface ST_ToolbarAlertBannerProps
  extends React.ComponentProps<typeof Alert> {
  stackAlertBanner?: boolean;
}

const toolbarAlertBannerVariants = cva(
  'relative inset-s-0 inset-e-0 top-0 z-2 w-full',
  {
    variants: {
      bottomOffset: {
        true: '-mb-4',
        false: '',
      },
    },
  },
);

export const ST_ToolbarAlertBanner = <TData extends ST_RowData>({
  stackAlertBanner,
  ...rest
}: ST_ToolbarAlertBannerProps) => {
  const table = useSTContext<TData>();
  const {
    getFilteredSelectedRowModel,
    getCoreRowModel,
    options: {
      enableRowSelection,
      enableSelectAll,
      icons: { CancelIcon },
      localization,
      manualPagination,
      stToolbarAlertBannerProps,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
    },
    refs: { tableLayoutRef },
  } = table;
  const {
    stToolbarAlertBannerChipProps,
  }: Pick<
    ST_TableOptions<TData>,
    'stToolbarAlertBannerChipProps'
  > = table.options;

  const alertProps = {
    ...parseFromValuesOrFunc(stToolbarAlertBannerProps, {
      table,
    }),
    ...rest,
  };

  const chipProps = parseFromValuesOrFunc(stToolbarAlertBannerChipProps, {
    table,
  });

  // The selected count reads the filtered selected row model, so the selector
  // lists the filter slices besides the ones the banner shows.
  return (
    <table.Subscribe
      selector={(state) => ({
        columnFilterFns: state.columnFilterFns,
        columnFilters: state.columnFilters,
        density: state.density,
        globalFilter: state.globalFilter,
        globalFilterFn: state.globalFilterFn,
        grouping: state.grouping,
        rowSelection: state.rowSelection,
        showAlertBanner: state.showAlertBanner,
      })}
    >
      {({ density, grouping, rowSelection, showAlertBanner }) => {
        const totalRowCount = rowCount ?? getCoreRowModel().rows.length;
        const filteredRowCount = getFilteredSelectedRowModel().rows.length;

        const selectedRowCount = manualPagination
          ? Object.values(rowSelection).filter(Boolean).length
          : filteredRowCount;
        const selectedAlert =
          selectedRowCount > 0 ? (
            <div className="flex flex-row items-center gap-4">
              {localization.selectedCountOfRowCountRowsSelected
                ?.replace(
                  '{selectedCount}',
                  selectedRowCount.toLocaleString(localization.language),
                )
                ?.replace(
                  '{rowCount}',
                  totalRowCount.toLocaleString(localization.language),
                )}
              <Button
                variant="ghost"
                size="sm"
                onClick={(event) =>
                  getST_SelectAllHandler({ table })(
                    // React Aria types the event on FocusableElement; the
                    // Button renders a <button>.
                    event as MouseEvent<HTMLButtonElement>,
                    false,
                    true,
                  )
                }
              >
                {localization.clearSelection}
              </Button>
            </div>
          ) : null;

        const groupedAlert =
          grouping.length > 0 ? (
            <span>
              {localization.groupedBy}{' '}
              {grouping.map((columnId, index) => (
                <Fragment key={`${index}-${columnId}`}>
                  {index > 0 ? localization.thenBy : ''}
                  <Badge
                    variant="secondary"
                    {...chipProps}
                    render={(badgeProps) => (
                      <button
                        {...badgeProps}
                        type="button"
                        onClick={(event) => {
                          table.getColumn(columnId).toggleGrouping();
                          badgeProps.onClick?.(event);
                        }}
                      >
                        {table.getColumn(columnId).columnDef.header}
                        <CancelIcon data-icon="inline-end" />
                      </button>
                    )}
                  />
                </Fragment>
              ))}
            </span>
          ) : null;

        const isExpanded = showAlertBanner || !!selectedAlert || !!groupedAlert;

        return (
          <Collapsible isExpanded={isExpanded}>
            <style href="st-collapsible" precedence="low">
              {stCollapsibleKeyframes}
            </style>
            {/* React Aria keeps a collapsed panel's children mounted. */}
            <CollapsibleContent
              className={
                stackAlertBanner
                  ? 'aria-[hidden=false]:animate-[st-collapsible-down_200ms_ease-out] aria-hidden:animate-[st-collapsible-up_200ms_ease-out]'
                  : undefined
              }
            >
              {isExpanded && (
                <Alert
                  {...alertProps}
                  className={cn(
                    toolbarAlertBannerVariants({
                      bottomOffset:
                        !stackAlertBanner &&
                        positionToolbarAlertBanner === 'bottom',
                    }),
                    alertProps?.className,
                  )}
                >
                  <div
                    className="col-start-2"
                    style={{
                      maxWidth: `calc(${
                        tableLayoutRef.current?.clientWidth ?? 360
                      }px - 1rem)`,
                      width: '100%',
                    }}
                  >
                    {renderToolbarAlertBannerContent?.({
                      groupedAlert,
                      selectedAlert,
                      table,
                    }) ?? (
                      <>
                        {alertProps?.title && (
                          <AlertTitle>{alertProps.title}</AlertTitle>
                        )}
                        <div
                          className={cn(
                            'flex flex-col',
                            positionToolbarAlertBanner !== 'head-overlay'
                              ? 'px-4 py-2'
                              : density === 'spacious'
                                ? 'px-5 py-3'
                                : density === 'comfortable'
                                  ? 'px-3 py-2'
                                  : 'px-2 py-1',
                          )}
                        >
                          {alertProps?.children}
                          {alertProps?.children &&
                            (selectedAlert || groupedAlert) && <br />}
                          <div className="flex">
                            {enableRowSelection &&
                              enableSelectAll &&
                              positionToolbarAlertBanner === 'head-overlay' && (
                                <ST_SelectCheckbox />
                              )}{' '}
                            {selectedAlert}
                          </div>
                          {selectedAlert && groupedAlert && <br />}
                          {groupedAlert}
                        </div>
                      </>
                    )}
                  </div>
                </Alert>
              )}
            </CollapsibleContent>
          </Collapsible>
        );
      }}
    </table.Subscribe>
  );
};
