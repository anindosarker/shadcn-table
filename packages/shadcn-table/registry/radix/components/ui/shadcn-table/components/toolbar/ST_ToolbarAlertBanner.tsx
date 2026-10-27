import { Alert, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Fragment } from 'react';
import { Subscribe } from '@tanstack/react-table';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { getST_SelectAllHandler } from '@/components/ui/shadcn-table/shared/utils/row.utils';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_SelectCheckbox } from '@/components/ui/shadcn-table/components/inputs/ST_SelectCheckbox';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

export interface ST_ToolbarAlertBannerProps<TData extends ST_RowData>
  extends React.ComponentProps<typeof Alert> {
  stackAlertBanner?: boolean;
  /**
   * Transition, part 01 phase 03: ignored, the banner reads the table from
   * context. `ST_TableHead` still passes it until its cluster lands; the
   * integration step removes this prop.
   */
  table?: ST_TableInstance<TData>;
}

const toolbarAlertBannerVariants = cva(
  'relative left-0 right-0 top-0 z-[2] w-full',
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- transition prop, kept off the Alert element until the integration step removes it
  table: _transitionTable,
  ...rest
}: ST_ToolbarAlertBannerProps<TData>) => {
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
      stToolbarAlertBannerChipProps,
      stToolbarAlertBannerProps,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
    },
    refs: { tableLayoutRef },
  } = table;

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
    <Subscribe
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
      source={table.store}
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
                  getST_SelectAllHandler({ table })(event, false, true)
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
                  <Badge variant="secondary" asChild {...chipProps}>
                    <button
                      type="button"
                      onClick={() => table.getColumn(columnId).toggleGrouping()}
                    >
                      {table.getColumn(columnId).columnDef.header}
                      <CancelIcon data-icon="inline-end" />
                    </button>
                  </Badge>
                </Fragment>
              ))}
            </span>
          ) : null;

        return (
          <Collapsible
            open={showAlertBanner || !!selectedAlert || !!groupedAlert}
          >
            <CollapsibleContent
              className={
                stackAlertBanner
                  ? 'data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up'
                  : undefined
              }
            >
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
            </CollapsibleContent>
          </Collapsible>
        );
      }}
    </Subscribe>
  );
};
