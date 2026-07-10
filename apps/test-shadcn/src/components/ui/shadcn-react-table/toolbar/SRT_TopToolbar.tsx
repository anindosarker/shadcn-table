import {
  parseFromValuesOrFunc,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_LinearProgressBar } from './SRT_LinearProgressBar';
import { SRT_TablePagination } from './SRT_TablePagination';
import { SRT_ToolbarAlertBanner } from './SRT_ToolbarAlertBanner';
import { SRT_ToolbarDropZone } from './SRT_ToolbarDropZone';
import { SRT_ToolbarInternalButtons } from './SRT_ToolbarInternalButtons';
import { useSRT_MediaQuery } from './useSRT_MediaQuery';
import { SRT_GlobalFilterTextField } from '../inputs/SRT_GlobalFilterTextField';

const topToolbarVariants = cva(
  // Note: maps MRT getCommonToolbarStyles (packages/material-react-table/src/utils/style.utils.ts)
  'relative z-[1] grid min-h-14 items-start overflow-hidden bg-background flex-wrap-reverse transition-all duration-150 ease-in-out',
  {
    variants: {
      fullscreen: {
        true: 'sticky top-0',
        false: 'relative',
      },
    },
  },
);

export interface SRT_TopToolbarProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

export const SRT_TopToolbar = <TData extends SRT_RowData>({
  table,
}: SRT_TopToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enableGlobalFilter,
      enablePagination,
      enableToolbarInternalActions,
      srtTopToolbarProps,
      positionGlobalFilter,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderTopToolbarCustomActions,
    },
    refs: { topToolbarRef },
  } = table;

  const { isFullScreen, showGlobalFilter } = getState();

  const isMobile = useSRT_MediaQuery('(max-width:720px)');
  const isTablet = useSRT_MediaQuery('(max-width:1024px)');

  const toolbarProps = parseFromValuesOrFunc(srtTopToolbarProps, { table });

  const stackAlertBanner =
    isMobile ||
    !!renderTopToolbarCustomActions ||
    (showGlobalFilter && isTablet);

  const globalFilterProps = {
    className: !isTablet ? 'z-[2]' : undefined,
    table,
  };

  return (
    <div
      {...toolbarProps}
      ref={(ref: HTMLDivElement) => {
        topToolbarRef.current = ref;
        if (toolbarProps?.ref) {
          // @ts-expect-error MRT forwards the user ref via mutable ref object
          toolbarProps.ref.current = ref;
        }
      }}
      className={cn(
        topToolbarVariants({ fullscreen: isFullScreen }),
        toolbarProps?.className,
      )}
    >
      {positionToolbarAlertBanner === 'top' && (
        <SRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'top'].includes(positionToolbarDropZone ?? '') && (
        <SRT_ToolbarDropZone table={table} />
      )}
      <div
        className={cn(
          'box-border flex w-full items-start justify-between gap-2 p-2 right-0 top-0',
          stackAlertBanner ? 'relative' : 'absolute',
        )}
      >
        {enableGlobalFilter && positionGlobalFilter === 'left' && (
          <SRT_GlobalFilterTextField {...globalFilterProps} />
        )}
        {renderTopToolbarCustomActions?.({ table }) ?? <span />}
        {enableToolbarInternalActions ? (
          <div className="flex flex-wrap-reverse items-center justify-end gap-2">
            {enableGlobalFilter && positionGlobalFilter === 'right' && (
              <SRT_GlobalFilterTextField {...globalFilterProps} />
            )}
            <SRT_ToolbarInternalButtons table={table} />
          </div>
        ) : (
          enableGlobalFilter &&
          positionGlobalFilter === 'right' && (
            <SRT_GlobalFilterTextField {...globalFilterProps} />
          )
        )}
      </div>
      {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <SRT_TablePagination position="top" table={table} />
        )}
      <SRT_LinearProgressBar isTopToolbar table={table} />
    </div>
  );
};
