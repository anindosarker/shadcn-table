import {
  parseFromValuesOrFunc,
  type DivProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_LinearProgressBar } from './SRT_LinearProgressBar';
import { SRT_TablePagination } from './SRT_TablePagination';
import { SRT_ToolbarAlertBanner } from './SRT_ToolbarAlertBanner';
import { SRT_ToolbarDropZone } from './SRT_ToolbarDropZone';
import { useSRT_MediaQuery } from './useSRT_MediaQuery';

export interface SRT_BottomToolbarProps<TData extends SRT_RowData>
  extends DivProps {
  table: SRT_TableInstance<TData>;
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

export const SRT_BottomToolbar = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_BottomToolbarProps<TData>) => {
  const {
    getState,
    options: {
      enablePagination,
      srtBottomToolbarProps,
      positionPagination,
      positionToolbarAlertBanner,
      positionToolbarDropZone,
      renderBottomToolbarCustomActions,
    },
    refs: { bottomToolbarRef },
  } = table;
  const { isFullScreen } = getState();

  const isMobile = useSRT_MediaQuery('(max-width:720px)');

  const toolbarProps = {
    ...parseFromValuesOrFunc(srtBottomToolbarProps, { table }),
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
      <SRT_LinearProgressBar isTopToolbar={false} table={table} />
      {positionToolbarAlertBanner === 'bottom' && (
        <SRT_ToolbarAlertBanner
          stackAlertBanner={stackAlertBanner}
          table={table}
        />
      )}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <SRT_ToolbarDropZone table={table} />
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
              <SRT_TablePagination position="bottom" table={table} />
            )}
        </div>
      </div>
    </div>
  );
};
