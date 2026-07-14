import { Fragment, useMemo } from 'react';
import {
  getSRT_SelectAllHandler,
  parseFromValuesOrFunc,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SRT_SelectCheckbox } from '../inputs/SRT_SelectCheckbox';

export interface SRT_ToolbarAlertBannerProps<TData extends SRT_RowData>
  extends React.ComponentProps<typeof Alert> {
  stackAlertBanner?: boolean;
  table: SRT_TableInstance<TData>;
}

// Note: MUI <Alert color="info" icon={false}> → shadcn <Alert> (div, role
// "alert"). This cva extends shadcn Alert's own base to map MRT's sx: it
// neutralizes Alert's grid/border/padding (`block border-none rounded-none p-0
// text-base` kills the has-[>svg] icon grid — no icon) and adds position
// relative, inset left/right/top 0, zIndex 2, width 100%. The `info` color →
// primary-tinted banner (bg-primary/10 + text-foreground) since SRT has no info
// palette token. Alert's internal cn(alertVariants(), className) twMerges these
// classes last, so the conflicting base tokens resolve our way. The
// `bottomOffset` variant maps `mb: positionToolbarAlertBanner === 'bottom' &&
// !stackAlertBanner ? '-1rem' : undefined` (-mb-4).
const toolbarAlertBannerVariants = cva(
  'relative left-0 right-0 top-0 z-[2] block w-full rounded-none border-none p-0 text-base bg-primary/10 text-foreground',
  {
    variants: {
      bottomOffset: {
        true: '-mb-4',
        false: '',
      },
    },
  },
);

// Note: MUI clear-selection Button size="small" sx={{ p: '2px' }} → shadcn
// Button variant="ghost" size="sm" (MUI text-variant map: primary text, ghost
// hover:bg-accent per CopyButton ruling) with p-[2px] text-primary.
const clearSelectionButtonVariants = cva('p-[2px] text-primary');

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
          type="button"
          variant="ghost"
          size="sm"
          className={clearSelectionButtonVariants()}
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
            {/* Note: MUI Chip (onDelete → internal CancelIcon) → shadcn Badge
                secondary + raw delete <button> (FilterTextField precedent).
                Badge has no built-in delete, so the CloseIcon registry icon is
                kept; MUI's internal delete icon is unlabeled, so no aria-label.
                MUI Chip's rounded-full geometry yields to Badge rounded-md. */}
            <Badge
              variant="secondary"
              {...chipProps}
              className={cn('gap-1', chipProps?.className)}
            >
              {table.getColumn(columnId).columnDef.header}
              <button
                type="button"
                onClick={() => table.getColumn(columnId).toggleGrouping()}
              >
                <CloseIcon className="size-3" />
              </button>
            </Badge>
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
    <Alert
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
            {/* Note: shadcn AlertTitle line-clamp-1 truncates multi-line titles
                (MUI AlertTitle doesn't) — accepted. `title` is the Alert HTML
                attr (string), narrower than MRT's AlertProps ReactNode —
                rendered as the AlertTitle slot's content. */}
            {alertProps?.title && (
              <AlertTitle className="mb-1">{alertProps.title}</AlertTitle>
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
  );
};
