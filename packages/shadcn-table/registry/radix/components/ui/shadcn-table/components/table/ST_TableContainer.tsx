import { useEffect, useLayoutEffect, useState } from 'react';
import { Subscribe } from '@tanstack/react-table';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { type DivProps } from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/shared/utils/utils';
import { ST_Table } from '@/components/ui/shadcn-table/components/table/ST_Table';
import { ST_TableLoadingOverlay } from '@/components/ui/shadcn-table/components/table/ST_TableLoadingOverlay';
import { ST_CellActionMenu } from '@/components/ui/shadcn-table/components/menus/ST_CellActionMenu';
import { ST_EditRowModal } from '@/components/ui/shadcn-table/components/modals/ST_EditRowModal';
import { useSTContext } from '@/components/ui/shadcn-table/hooks/stTableHook';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type ST_TableContainerProps = DivProps;

// Thin, always-visible scrollbars so the horizontal bar is not hidden by
// overlay scrollbars on macOS. Chromium ignores the ::-webkit-scrollbar rules
// once scrollbar-width is set, so scrollbar-width: thin only applies in
// engines without ::-webkit-scrollbar support (Firefox).
const tableContainerVariants = cva(
  'relative min-w-0 max-w-full overflow-auto supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent',
);

export const ST_TableContainer = ({ ...rest }: ST_TableContainerProps) => {
  const table = useSTContext();
  const {
    options: {
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableStickyHeader,
      stTableContainerProps,
    },
    refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table;

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);

  const tableContainerProps = {
    ...parseFromValuesOrFunc(stTableContainerProps, {
      table,
    }),
    ...rest,
  };

  // The toolbars change height on state this container does not render (an
  // alert banner on selection), so their size is observed, not only measured
  // after this container renders.
  useIsomorphicLayoutEffect(() => {
    const measureToolbars = () => {
      const topToolbarHeight =
        typeof document !== 'undefined'
          ? (topToolbarRef.current?.offsetHeight ?? 0)
          : 0;

      const bottomToolbarHeight =
        typeof document !== 'undefined'
          ? (bottomToolbarRef?.current?.offsetHeight ?? 0)
          : 0;

      setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight);
    };
    measureToolbars();
    if (typeof ResizeObserver === 'undefined') return;
    const resizeObserver = new ResizeObserver(measureToolbars);
    [topToolbarRef.current, bottomToolbarRef.current].forEach(
      (toolbar) => toolbar && resizeObserver.observe(toolbar),
    );
    return () => resizeObserver.disconnect();
  });

  // Created outside the state subscription, so a loading or editing change
  // re-renders only the container element.
  const tableElement = <ST_Table />;

  return (
    <Subscribe
      selector={(state) => ({
        actionCell: state.actionCell,
        creatingRow: state.creatingRow,
        editingRow: state.editingRow,
        isFullScreen: state.isFullScreen,
        isLoading: state.isLoading,
        showLoadingOverlay: state.showLoadingOverlay,
      })}
      source={table.store}
    >
      {({
        actionCell,
        creatingRow,
        editingRow,
        isFullScreen,
        isLoading,
        showLoadingOverlay,
      }) => {
        const loading =
          showLoadingOverlay !== false && (isLoading || showLoadingOverlay);

        const createModalOpen = createDisplayMode === 'modal' && creatingRow;
        const editModalOpen = editDisplayMode === 'modal' && editingRow;

        return (
          <div
            aria-busy={loading}
            aria-describedby={loading ? 'st-progress' : undefined}
            {...tableContainerProps}
            ref={(node: HTMLDivElement) => {
              if (node) {
                tableContainerRef.current = node;
                if (tableContainerProps?.ref) {
                  //@ts-expect-error ref can be either RefCallback or RefObject
                  tableContainerProps.ref.current = node;
                }
              }
            }}
            style={{
              maxHeight: isFullScreen
                ? `calc(100vh - ${totalToolbarHeight}px)`
                : enableStickyHeader
                  ? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
                  : undefined,
              ...tableContainerProps?.style,
            }}
            className={cn(
              tableContainerVariants({
                className: tableContainerProps.className,
              }),
            )}
          >
            {loading ? <ST_TableLoadingOverlay /> : null}
            {tableElement}
            {(createModalOpen || editModalOpen) && <ST_EditRowModal open />}
            {enableCellActions && actionCell && <ST_CellActionMenu />}
          </div>
        );
      }}
    </Subscribe>
  );
};
