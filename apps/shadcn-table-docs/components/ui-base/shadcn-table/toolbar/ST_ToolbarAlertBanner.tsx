import { Alert, AlertTitle } from '@/components/ui-base/alert';
import { Badge } from '@/components/ui-base/badge';
import { Button } from '@/components/ui-base/button';
import { Collapsible, CollapsibleContent } from '@/components/ui-base/collapsible';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Fragment, useMemo } from 'react';
import { type ST_RowData, type ST_TableInstance } from '../types';
import { getST_SelectAllHandler } from '../utils/row.utils';
import { parseFromValuesOrFunc } from '../utils/utils';
import { ST_SelectCheckbox } from '../inputs/ST_SelectCheckbox';

export interface ST_ToolbarAlertBannerProps<TData extends ST_RowData>
  extends React.ComponentProps<typeof Alert> {
  stackAlertBanner?: boolean;
  table: ST_TableInstance<TData>;
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
  table,
  ...rest
}: ST_ToolbarAlertBannerProps<TData>) => {
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
      stToolbarAlertBannerChipProps,
      stToolbarAlertBannerProps,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
    },
    refs: { tableLayoutRef },
  } = table;
  const { density, grouping, rowSelection, showAlertBanner } = getState();

  const alertProps = {
    ...parseFromValuesOrFunc(stToolbarAlertBannerProps, {
      table,
    }),
    ...rest,
  };

  const chipProps = parseFromValuesOrFunc(stToolbarAlertBannerChipProps, {
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
            <Badge
              variant="secondary"
              render={
                <button
                  type="button"
                  onClick={() => table.getColumn(columnId).toggleGrouping()}
                />
              }
              {...chipProps}
            >
              {table.getColumn(columnId).columnDef.header}
              <CancelIcon data-icon="inline-end" />
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
            ? 'data-open:animate-[st-base-collapsible-down_200ms_ease-out] data-closed:animate-[st-base-collapsible-up_200ms_ease-out]'
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
                        <ST_SelectCheckbox table={table} />
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
