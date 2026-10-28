import { useCallback, useRef } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_RowData,
} from '@/components/ui-base/shadcn-table/types';
import {
  assignRef,
  parseFromValuesOrFunc,
} from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_LinearProgressBar } from '@/components/ui-base/shadcn-table/components/toolbar/ST_LinearProgressBar';
import { ST_TablePagination } from '@/components/ui-base/shadcn-table/components/toolbar/ST_TablePagination';
import { ST_ToolbarAlertBanner } from '@/components/ui-base/shadcn-table/components/toolbar/ST_ToolbarAlertBanner';
import { ST_ToolbarDropZone } from '@/components/ui-base/shadcn-table/components/toolbar/ST_ToolbarDropZone';
import { useST_MediaQuery } from '@/components/ui-base/shadcn-table/components/toolbar/useST_MediaQuery';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';

export type ST_BottomToolbarProps = DivProps;

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
  ...rest
}: ST_BottomToolbarProps) => {
  const table = useSTContext<TData>();
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

  const isMobile = useST_MediaQuery('(max-width:720px)');

  const toolbarProps = {
    ...parseFromValuesOrFunc(stBottomToolbarProps, { table }),
    ...rest,
  };

  // The user's ref is read through a ref so the callback keeps one identity:
  // a new callback each render would detach and reattach the node, leaving
  // bottomToolbarRef null while the children's layout effects run.
  const userRef = useRef(toolbarProps.ref);
  userRef.current = toolbarProps.ref;
  const attachRef = useCallback(
    (node: HTMLDivElement) => {
      bottomToolbarRef.current = node;
      const ref = userRef.current;
      const cleanup = assignRef(ref, node);
      return () => {
        if (typeof cleanup === 'function') {
          cleanup();
        } else {
          assignRef(ref, null);
        }
        bottomToolbarRef.current = null;
      };
    },
    [bottomToolbarRef],
  );

  const stackAlertBanner = isMobile || !!renderBottomToolbarCustomActions;

  // Created outside the full screen subscription, so toggling full screen
  // re-renders only the toolbar element.
  const toolbarContent = (
    <>
      <ST_LinearProgressBar isTopToolbar={false} />
      {positionToolbarAlertBanner === 'bottom' && (
        <ST_ToolbarAlertBanner stackAlertBanner={stackAlertBanner} />
      )}
      {['both', 'bottom'].includes(positionToolbarDropZone ?? '') && (
        <ST_ToolbarDropZone />
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
              <ST_TablePagination position="bottom" />
            )}
        </div>
      </div>
    </>
  );

  return (
    <Subscribe source={table.atoms.isFullScreen}>
      {(isFullScreen) => (
        <div
          {...toolbarProps}
          ref={attachRef}
          className={cn(
            bottomToolbarVariants({
              fullscreen: isFullScreen,
              className: toolbarProps.className,
            }),
          )}
        >
          {toolbarContent}
        </div>
      )}
    </Subscribe>
  );
};
