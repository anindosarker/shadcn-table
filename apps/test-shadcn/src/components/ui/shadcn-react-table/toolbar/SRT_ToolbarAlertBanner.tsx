import { Alert, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Fragment, useMemo } from 'react';
import {
  getSRT_SelectAllHandler,
  parseFromValuesOrFunc,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { SRT_SelectCheckbox } from '../inputs/SRT_SelectCheckbox';

export interface SRT_ToolbarAlertBannerProps<TData extends SRT_RowData>
  extends React.ComponentProps<typeof Alert> {
  stackAlertBanner?: boolean;
  table: SRT_TableInstance<TData>;
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

export const SRT_ToolbarAlertBanner = <TData extends SRT_RowData>({
  stackAlertBanner,
  table,
  ...rest
}: SRT_ToolbarAlertBannerProps<TData>) => {
  const {
    getFilteredSelectedRowModel,
    getCoreRowModel,
    getState,
    options: {
      enableRowSelection,
      enableSelectAll,
      icons: { CancelIcon },
      localization,
      manualPagination,
      srtToolbarAlertBannerChipProps,
      srtToolbarAlertBannerProps,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
    },
    refs: { tableLayoutRef },
  } = table;
  const { density, grouping, rowSelection, showAlertBanner } = getState();

  const alertProps = {
    ...parseFromValuesOrFunc(srtToolbarAlertBannerProps, {
      table,
    }),
    ...rest,
  };

  const chipProps = parseFromValuesOrFunc(srtToolbarAlertBannerChipProps, {
    table,
  });

  const totalRowCount = rowCount ?? getCoreRowModel().rows.length;
  const filteredRowCount = getFilteredSelectedRowModel().rows.length;

  const selectedRowCount = useMemo(
    () =>
      manualPagination
        ? Object.values(rowSelection).filter(Boolean).length
        : filteredRowCount,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rowSelection, totalRowCount, manualPagination, filteredRowCount],
  );
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
            getSRT_SelectAllHandler({ table })(event, false, true)
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
    <Collapsible open={showAlertBanner || !!selectedAlert || !!groupedAlert}>
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
                !stackAlertBanner && positionToolbarAlertBanner === 'bottom',
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
                  {alertProps?.children && (selectedAlert || groupedAlert) && (
                    <br />
                  )}
                  <div className="flex">
                    {enableRowSelection &&
                      enableSelectAll &&
                      positionToolbarAlertBanner === 'head-overlay' && (
                        <SRT_SelectCheckbox table={table} />
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
};
