import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_LinearProgressBar } from '@/components/ui/shadcn-table/toolbar/ST_LinearProgressBar';
import { ST_TablePagination } from '@/components/ui/shadcn-table/toolbar/ST_TablePagination';
import { ST_ToolbarAlertBanner } from '@/components/ui/shadcn-table/toolbar/ST_ToolbarAlertBanner';
import { ST_ToolbarDropZone } from '@/components/ui/shadcn-table/toolbar/ST_ToolbarDropZone';
import { useST_MediaQuery } from '@/components/ui/shadcn-table/toolbar/useST_MediaQuery';

export interface ST_BottomToolbarProps<TData extends ST_RowData>
  extends DivProps {
  table: ST_TableInstance<TData>;
}

// Note: base maps MRT's shared getCommonToolbarStyles (min-h-14 = 3.5rem,
// bg-background = baseBackgroundColor) plus the bottom-toolbar extras (inset
// boxShadow, left/right pinning); the fullscreen variant maps
// `position: isFullScreen ? 'fixed' : 'relative'`.
const bottomToolbarVariants = cva(
  'relative z-[1] grid min-h-14 items-start overflow-hidden bg-background flex-wrap-reverse transition-all duration-150 ease-in-out shadow-[inset_0_1px_2px_-1px_rgba(97,97,97,0.5)] left-0 right-0',
  {
    variants: {
      fullscreen: {
        true: 'fixed bottom-0',
        false: 'relative',
      },
    },
  },
);

export const ST_BottomToolbar = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_BottomToolbarProps<TData>) => {
  const {
    options: {
      enablePagination,
      stBottomToolbarProps,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table;
  const { isFullScreen } = table.state;

  const isMobile = useST_MediaQuery('(max-width:720px)');

  const toolbarProps = {
    ...parseFromValuesOrFunc(stBottomToolbarProps, { table }),
    ...rest,
  };

  const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions;

  return (
    <div
      {...toolbarProps}
      ref={(node: HTMLDivElement) => {
        if (node) {
          bottomToolbarRef.current = node;
          if (toolbarProps?.ref) {
            //@ts-expect-error ref can be either RefCallback or RefObject
            toolbarProps.ref.current = node;
          }
        }
      }}
      className={cn(
        bottomToolbarVariants({
          fullscreen: isFullScreen,
          className: toolbarProps.className,
        }),
      )}
    >
      <ST_LinearProgressBar isTopToolbar={false} table={table} />
      {positionToolbarAlertBanner === 'bottom' && (
        <ST_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <ST_ToolbarDropZone table={table} />
      )}
      <div className="flex w-full box-border items-center justify-between p-2">
        {renderBottomToolbarCustomActions ? (
          renderBottomToolbarCustomActions({ table })
        ) : (
          <span />
        )}
        <div
          className={cn(
            'flex justify-end right-0 top-0',
            stackAlertBanner ? 'relative' : 'absolute',
          )}
        >
          {enablePagination &&
            ['both', 'bottom'].includes(positionPagination ?? '') && (
              <ST_TablePagination position="bottom" table={table} />
            )}
        </div>
      </div>
    </div>
  );
};
