import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { type ST_RowData } from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_LinearProgressBar } from '@/components/ui/shadcn-table/components/toolbar/ST_LinearProgressBar';
import { ST_TablePagination } from '@/components/ui/shadcn-table/components/toolbar/ST_TablePagination';
import { ST_ToolbarAlertBanner } from '@/components/ui/shadcn-table/components/toolbar/ST_ToolbarAlertBanner';
import { ST_ToolbarDropZone } from '@/components/ui/shadcn-table/components/toolbar/ST_ToolbarDropZone';
import { ST_ToolbarInternalButtons } from '@/components/ui/shadcn-table/components/toolbar/ST_ToolbarInternalButtons';
import { useST_MediaQuery } from '@/components/ui/shadcn-table/hooks/useST_MediaQuery';
import { ST_GlobalFilterTextField } from '@/components/ui/shadcn-table/components/inputs/ST_GlobalFilterTextField';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';
import { useST_ComposedRef } from '@/components/ui/shadcn-table/hooks/useST_ComposedRef';

const topToolbarVariants = cva(
  'relative z-1 grid min-h-14 items-start overflow-hidden bg-background flex-wrap-reverse transition-all duration-150 ease-in-out',
  {
    variants: {
      fullscreen: {
        true: 'sticky top-0',
        false: 'relative',
      },
    },
  },
);

export const ST_TopToolbar = <TData extends ST_RowData>() => {
  const table = useSTContext<TData>();
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

  const isMobile = useST_MediaQuery('(max-width:720px)');
  const isTablet = useST_MediaQuery('(max-width:1024px)');

  const toolbarProps = parseFromValuesOrFunc(stTopToolbarProps, { table });

  const attachRef = useST_ComposedRef(topToolbarRef, toolbarProps?.ref);

  const globalFilterProps = {
    className: !isTablet ? 'z-2' : undefined,
  };

  // Created outside the state subscription, so a full screen or global filter
  // change re-renders only the toolbar element, the alert banner and the
  // actions row.
  const dropZone = ['both', 'top'].includes(positionToolbarDropZone ?? '') && (
    <ST_ToolbarDropZone />
  );
  const actions = (
    <>
      {enableGlobalFilter && positionGlobalFilter === 'left' && (
        <ST_GlobalFilterTextField {...globalFilterProps} />
      )}
      {renderTopToolbarCustomActions?.({ table }) ?? <span />}
      {enableToolbarInternalActions ? (
        <div className="flex flex-wrap-reverse items-center justify-end gap-2">
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
        isFullScreen: state.isFullScreen,
        showGlobalFilter: state.showGlobalFilter,
      })}
    >
      {({ isFullScreen, showGlobalFilter }) => {
        const stackAlertBanner =
          isMobile ||
          !!renderTopToolbarCustomActions ||
          (showGlobalFilter && isTablet);

        return (
          <div
            {...toolbarProps}
            ref={attachRef}
            className={cn(
              topToolbarVariants({ fullscreen: isFullScreen }),
              toolbarProps?.className,
            )}
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
              {actions}
            </div>
            {pagination}
            {progressBar}
          </div>
        );
      }}
    </table.Subscribe>
  );
};
