import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_LinearProgressBar } from '@/components/ui/shadcn-table/toolbar/ST_LinearProgressBar';
import { ST_TablePagination } from '@/components/ui/shadcn-table/toolbar/ST_TablePagination';
import { ST_ToolbarAlertBanner } from '@/components/ui/shadcn-table/toolbar/ST_ToolbarAlertBanner';
import { ST_ToolbarDropZone } from '@/components/ui/shadcn-table/toolbar/ST_ToolbarDropZone';
import { ST_ToolbarInternalButtons } from '@/components/ui/shadcn-table/toolbar/ST_ToolbarInternalButtons';
import { useST_MediaQuery } from '@/components/ui/shadcn-table/toolbar/useST_MediaQuery';
import { ST_GlobalFilterTextField } from '@/components/ui/shadcn-table/inputs/ST_GlobalFilterTextField';

const topToolbarVariants = cva(
  // Note: maps MRT getCommonToolbarStyles
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

export interface ST_TopToolbarProps<TData extends ST_RowData> {
  table: ST_TableInstance<TData>;
}

export const ST_TopToolbar = <TData extends ST_RowData>({
  table,
}: ST_TopToolbarProps<TData>) => {
  const {
    options: {
      enableGlobalFilter,
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

  const { isFullScreen, showGlobalFilter } = table.state;

  const isMobile = useST_MediaQuery('(max-width:720px)');
  const isTablet = useST_MediaQuery('(max-width:1024px)');

  const toolbarProps = parseFromValuesOrFunc(stTopToolbarProps, { table });

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
        <ST_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'top'].includes(positionToolbarDropZone ?? '') && (
        <ST_ToolbarDropZone table={table} />
      )}
      <div
        className={cn(
          'box-border flex w-full items-start justify-between gap-2 p-2 right-0 top-0',
          stackAlertBanner ? 'relative' : 'absolute',
        )}
      >
        {enableGlobalFilter && positionGlobalFilter === 'left' && (
          <ST_GlobalFilterTextField {...globalFilterProps} />
        )}
        {renderTopToolbarCustomActions?.({ table }) ?? <span />}
        {enableToolbarInternalActions ? (
          <div className="flex flex-wrap-reverse items-center justify-end gap-2">
            {enableGlobalFilter && positionGlobalFilter === 'right' && (
              <ST_GlobalFilterTextField {...globalFilterProps} />
            )}
            <ST_ToolbarInternalButtons table={table} />
          </div>
        ) : (
          enableGlobalFilter &&
          positionGlobalFilter === 'right' && (
            <ST_GlobalFilterTextField {...globalFilterProps} />
          )
        )}
      </div>
      {enablePagination &&
        ['both', 'top'].includes(positionPagination ?? '') && (
          <ST_TablePagination position="top" table={table} />
        )}
      <ST_LinearProgressBar isTopToolbar table={table} />
    </div>
  );
};
