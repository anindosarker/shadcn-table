import { type ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { type DivProps } from '@/components/ui-base/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-base/shadcn-table/shared/utils/utils';
import { ST_BottomToolbar } from '@/components/ui-base/shadcn-table/components/toolbar/ST_BottomToolbar';
import { ST_TopToolbar } from '@/components/ui-base/shadcn-table/components/toolbar/ST_TopToolbar';
import { ST_TableContainer } from '@/components/ui-base/shadcn-table/components/table/ST_TableContainer';
import {
  getST_ViewSettingsKey,
  ST_VIEW_PENDING_ATTR,
  ST_ViewPendingScript,
} from '@/components/ui-base/shadcn-table/components/table/ST_ViewPendingScript';
import { useSTContext } from '@/components/ui-base/shadcn-table/hooks/stTableHook';
import { useST_ComposedRef } from '@/components/ui-base/shadcn-table/hooks/useST_ComposedRef';
import { useST_FullScreenContainer } from '@/components/ui-base/shadcn-table/hooks/useST_FullScreenContainer';

export type ST_TableLayoutProps = DivProps;

// The root declares the four tint tokens the cells read, light then dark;
// every token is an opaque mix with the background, so pinned cells stay
// opaque. Without relative colour syntax the edge shadow falls back to the
// border colour.
const tableLayoutClassName =
  'group/st relative flex flex-col gap-2 [--st-stripe:color-mix(in_srgb,var(--muted)_70%,var(--background))] dark:[--st-stripe:color-mix(in_srgb,var(--muted)_25%,var(--background))] [--st-hover:color-mix(in_srgb,var(--border)_50%,var(--background))] dark:[--st-hover:color-mix(in_srgb,var(--muted)_55%,var(--background))] [--st-selected:color-mix(in_srgb,var(--primary)_20%,var(--background))] [--st-edge-shadow:oklch(from_var(--background)_calc(l-0.08)_c_h)] supports-[not(color:oklch(from_red_l_c_h))]:[--st-edge-shadow:var(--border)]';

// The bordered frame holds the scroll box and the bottom toolbar, with no
// inner padding.
const tableFrameClassName =
  'relative flex min-h-0 flex-col overflow-hidden rounded-md border bg-background shadow';

const ST_TableLayoutContainer = ({
  children,
  frame,
  layoutDivProps,
}: {
  children: ReactNode;
  frame: ReactNode;
  layoutDivProps: ST_TableLayoutProps;
}) => {
  const table = useSTContext();
  const { containerProps, isFullScreen } = useST_FullScreenContainer(table);
  const attachRef = useST_ComposedRef(
    table.refs.tableLayoutRef,
    layoutDivProps.ref,
  );
  const storageKey = getST_ViewSettingsKey(table);

  // The pending mark is cleared once the stored view is applied; aria-busy
  // follows it.
  useEffect(() => {
    const root = table.refs.tableLayoutRef.current;
    if (!storageKey || !root || typeof MutationObserver === 'undefined') {
      return;
    }
    const clearBusy = () => {
      if (!root.hasAttribute(ST_VIEW_PENDING_ATTR)) {
        root.removeAttribute('aria-busy');
      }
    };
    const observer = new MutationObserver(clearBusy);
    observer.observe(root, { attributeFilter: [ST_VIEW_PENDING_ATTR] });
    clearBusy();
    return () => observer.disconnect();
  }, [storageKey, table]);

  return (
    <div
      data-slot="st-table-layout"
      data-st-full-screen={containerProps['data-st-full-screen']}
      onKeyDown={containerProps.onKeyDown}
      tabIndex={containerProps.tabIndex}
      {...layoutDivProps}
      ref={attachRef}
      // The pending script marks the root before hydration.
      suppressHydrationWarning={!!storageKey || undefined}
      className={cn(
        tableLayoutClassName,
        containerProps.className,
        layoutDivProps.className,
      )}
    >
      {storageKey && (
        <ST_ViewPendingScript storageKey={storageKey} table={table} />
      )}
      {children}
      <div
        data-slot="st-table-frame"
        className={cn(tableFrameClassName, isFullScreen && 'flex-1')}
      >
        {frame}
      </div>
    </div>
  );
};

export const ST_TableLayout = ({ ...rest }: ST_TableLayoutProps) => {
  const table = useSTContext();
  const {
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      stTableLayoutProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
  } = table;

  const layoutDivProps = {
    ...parseFromValuesOrFunc(stTableLayoutProps, { table }),
    ...rest,
  };

  // Created outside the full-screen container, so toggling full screen
  // re-renders only that element and the frame.
  const topToolbar =
    enableTopToolbar &&
    (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? <ST_TopToolbar />);
  const tableContainer = <ST_TableContainer />;
  const bottomToolbar =
    enableBottomToolbar &&
    (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
      <ST_BottomToolbar />
    ));

  return (
    <ST_TableLayoutContainer
      frame={
        <>
          {tableContainer}
          {bottomToolbar}
        </>
      }
      layoutDivProps={layoutDivProps}
    >
      {topToolbar}
    </ST_TableLayoutContainer>
  );
};
