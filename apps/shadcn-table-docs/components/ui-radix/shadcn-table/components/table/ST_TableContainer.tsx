import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { type DivProps } from '@/components/ui-radix/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui-radix/shadcn-table/shared/utils/utils';
import { ST_Table } from '@/components/ui-radix/shadcn-table/components/table/ST_Table';
import { ST_ScrollButtons } from '@/components/ui-radix/shadcn-table/components/table/ST_ScrollButtons';
import { ST_TableLoadingOverlay } from '@/components/ui-radix/shadcn-table/components/table/ST_TableLoadingOverlay';
import { ST_CellActionMenu } from '@/components/ui-radix/shadcn-table/components/menus/ST_CellActionMenu';
import { ST_EditRowModal } from '@/components/ui-radix/shadcn-table/components/modals/ST_EditRowModal';
import { useSTContext } from '@/components/ui-radix/shadcn-table/context/ST_TableContext';
import { useST_ComposedRef } from '@/components/ui-radix/shadcn-table/hooks/useST_ComposedRef';
import { useST_HorizontalOverflow } from '@/components/ui-radix/shadcn-table/hooks/useST_HorizontalOverflow';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export type ST_TableContainerProps = DivProps;

// Thin, always-visible scrollbars so the horizontal bar is not hidden by
// overlay scrollbars on macOS. Chromium ignores the ::-webkit-scrollbar rules
// once scrollbar-width is set, so scrollbar-width: thin only applies in
// engines without ::-webkit-scrollbar support (Firefox).
const tableContainerVariants = cva(
  'relative min-w-0 max-w-full overflow-auto supports-[not_selector(::-webkit-scrollbar)]:scrollbar-thin [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent',
);

export const ST_TableContainer = ({ ...rest }: ST_TableContainerProps) => {
  const table = useSTContext();
  const {
    options: {
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableRowVirtualization,
      enableScrollButtons,
      enableStickyHeader,
      stTableContainerProps,
    },
    refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table;

  const tableContainerProps = {
    ...parseFromValuesOrFunc(stTableContainerProps, {
      table,
    }),
    ...rest,
  };

  // The virtualizers in the table read tableContainerRef in their layout
  // effects, which run before React attaches this ref. Storing the attached
  // node renders the container and the table again, before paint, so the
  // virtualizers pick up their scroll element on mount.
  const [, setContainerNode] = useState<HTMLDivElement | null>(null);

  const composedRef = useST_ComposedRef(
    tableContainerRef,
    tableContainerProps.ref,
  );
  const attachRef = useCallback(
    (node: HTMLDivElement) => {
      setContainerNode(node);
      return composedRef(node);
    },
    [composedRef],
  );

  const scrollWrapperRef = useRef<HTMLDivElement | null>(null);
  useST_HorizontalOverflow(scrollWrapperRef, tableContainerRef, table);

  const toolbarObserverRef = useRef<{
    observer: ResizeObserver;
    toolbars: (HTMLDivElement | null)[];
  } | null>(null);

  // The toolbar height is observed and written to a CSS variable, not React
  // state, so a toolbar resize does not re-render the container and the table.
  useIsomorphicLayoutEffect(() => {
    const measureToolbars = () => {
      const topToolbarHeight = topToolbarRef.current?.offsetHeight ?? 0;
      const bottomToolbarHeight = bottomToolbarRef?.current?.offsetHeight ?? 0;
      tableContainerRef.current?.style.setProperty(
        '--st-toolbar-height',
        `${topToolbarHeight + bottomToolbarHeight}px`,
      );
    };
    measureToolbars();
    if (typeof ResizeObserver === 'undefined') return;
    const toolbars = [topToolbarRef.current, bottomToolbarRef.current];
    const current = toolbarObserverRef.current;
    if (
      current &&
      current.toolbars.every((toolbar, i) => toolbar === toolbars[i])
    ) {
      return;
    }
    current?.observer.disconnect();
    const observer = new ResizeObserver(measureToolbars);
    toolbars.forEach((toolbar) => toolbar && observer.observe(toolbar));
    toolbarObserverRef.current = { observer, toolbars };
  });

  useEffect(
    () => () => {
      toolbarObserverRef.current?.observer.disconnect();
      toolbarObserverRef.current = null;
    },
    [],
  );

  // Created outside the state subscription, so a loading or editing change
  // re-renders only the container element.
  const tableElement = <ST_Table />;

  return (
    <table.Subscribe
      selector={(state) => ({
        creatingRow: state.creatingRow,
        editingRow: state.editingRow,
        isFullScreen: state.isFullScreen,
        isLoading: state.isLoading,
        showLoadingOverlay: state.showLoadingOverlay,
        stickyHeader: state.viewSettings.stickyHeader,
      })}
    >
      {({
        creatingRow,
        editingRow,
        isFullScreen,
        isLoading,
        showLoadingOverlay,
        stickyHeader,
      }) => {
        const loading =
          showLoadingOverlay !== false && (isLoading || showLoadingOverlay);

        const createModalOpen = createDisplayMode === 'modal' && creatingRow;
        const editModalOpen = editDisplayMode === 'modal' && editingRow;

        // A sticky header needs the box to own the y axis. By choice it caps
        // at 70vh; forced by row virtualization it keeps the full height.
        const maxHeight = isFullScreen
          ? undefined
          : enableRowVirtualization
            ? 'var(--st-sticky-max-height, clamp(350px, calc(100vh - var(--st-toolbar-height, 0px)), 9999px))'
            : enableStickyHeader || stickyHeader
              ? 'var(--st-sticky-max-height, 70vh)'
              : undefined;

        return (
          <div
            className={cn(
              'group/st-scroll relative flex min-h-0 flex-col',
              isFullScreen && 'flex-1',
            )}
            data-slot="st-scroll-wrapper"
            ref={scrollWrapperRef}
          >
            <div
              aria-busy={loading}
              aria-describedby={loading ? 'st-progress' : undefined}
              {...tableContainerProps}
              ref={attachRef}
              style={{ maxHeight, ...tableContainerProps?.style }}
              className={cn(
                tableContainerVariants({
                  className: cn(
                    isFullScreen && 'min-h-0 flex-1',
                    tableContainerProps.className,
                  ),
                }),
              )}
            >
              {loading ? <ST_TableLoadingOverlay /> : null}
              {tableElement}
              {(createDisplayMode === 'modal' ||
                editDisplayMode === 'modal') && (
                <ST_EditRowModal open={!!(createModalOpen || editModalOpen)} />
              )}
              {enableCellActions && <ST_CellActionMenu />}
            </div>
            {enableScrollButtons === true && <ST_ScrollButtons table={table} />}
          </div>
        );
      }}
    </table.Subscribe>
  );
};
