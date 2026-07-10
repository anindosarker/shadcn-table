import { Fragment, useMemo } from 'react';
import {
  getSRT_SelectAllHandler,
  parseFromValuesOrFunc,
  type DivProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_SelectCheckbox } from '../inputs/SRT_SelectCheckbox';

export interface SRT_ToolbarAlertBannerProps<TData extends SRT_RowData>
  extends DivProps {
  stackAlertBanner?: boolean;
  table: SRT_TableInstance<TData>;
}

// Note: MUI <Alert color="info" icon={false}> root → div. Base maps the sx:
// position relative, inset left/right/top 0, zIndex 2, width 100%, borderRadius
// 0, fontSize 1rem, p 0. The `info` color → primary-tinted banner
// (bg-primary/10 + text-foreground) since SRT has no info palette token. The
// `bottomOffset` variant maps `mb: positionToolbarAlertBanner === 'bottom' &&
// !stackAlertBanner ? '-1rem' : undefined` (-mb-4).
const toolbarAlertBannerVariants = cva(
  'relative left-0 right-0 top-0 z-[2] w-full rounded-none p-0 text-base bg-primary/10 text-foreground',
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
      icons: { CloseIcon },
      localization,
      manualPagination,
      positionToolbarAlertBanner,
      renderToolbarAlertBannerContent,
      rowCount,
      srtToolbarAlertBannerChipProps,
      srtToolbarAlertBannerProps,
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
        <button
          type="button"
          onClick={(event) =>
            getSRT_SelectAllHandler({ table })(event, false, true)
          }
          className="rounded-md p-[2px] text-sm text-primary hover:underline"
        >
          {localization.clearSelection}
        </button>
      </div>
    ) : null;

  const groupedAlert =
    grouping.length > 0 ? (
      <span>
        {localization.groupedBy}{' '}
        {grouping.map((columnId, index) => (
          <Fragment key={`${index}-${columnId}`}>
            {index > 0 ? localization.thenBy : ''}
            <span
              {...chipProps}
              className={cn(
                'inline-flex items-center gap-1 rounded-full border bg-muted px-2 py-0.5 text-sm',
                chipProps?.className,
              )}
            >
              {table.getColumn(columnId).columnDef.header}
              <button
                type="button"
                onClick={() => table.getColumn(columnId).toggleGrouping()}
                className="inline-flex items-center rounded-full hover:bg-background/50"
              >
                <CloseIcon className="h-3.5 w-3.5" />
              </button>
            </span>
          </Fragment>
        ))}
      </span>
    ) : null;

  // Note: MRT wraps the banner in MUI <Collapse in={showAlertBanner ||
  // !!selectedAlert || !!groupedAlert} timeout={stackAlertBanner ? 200 : 0}>;
  // SRT conditionally renders (unmount) instead — the animation timeout nuance
  // is dropped with the Collapse.
  if (!(showAlertBanner || !!selectedAlert || !!groupedAlert)) return null;

  return (
    <div
      {...alertProps}
      className={cn(
        'Srt-ToolbarAlertBanner',
        toolbarAlertBannerVariants({
          bottomOffset:
            !stackAlertBanner && positionToolbarAlertBanner === 'bottom',
        }),
        alertProps?.className,
      )}
    >
      {/* Note: maps the sx `& .MuiAlert-message` (Alert's content wrapper) —
          maxWidth from the runtime-measured table width stays inline style. */}
      <div
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
            {/* Note: AlertTitle → div. `title` is the DivProps HTML attr
                (string), narrower than MRT's AlertProps ReactNode — rendered as
                the AlertTitle slot's content. */}
            {alertProps?.title && (
              <div className="mb-1 font-medium">{alertProps.title}</div>
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
    </div>
  );
};
