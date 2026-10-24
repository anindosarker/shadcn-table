import { useEffect, useLayoutEffect, useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import {
  type DivProps,
  type ST_RowData,
  type ST_TableInstance,
} from '@/components/ui/shadcn-table/types';
import { parseFromValuesOrFunc } from '@/components/ui/shadcn-table/utils/utils';
import { ST_Table } from '@/components/ui/shadcn-table/table/ST_Table';
import { ST_TableLoadingOverlay } from '@/components/ui/shadcn-table/table/ST_TableLoadingOverlay';
import { ST_CellActionMenu } from '@/components/ui/shadcn-table/menus/ST_CellActionMenu';
import { ST_EditRowModal } from '@/components/ui/shadcn-table/modals/ST_EditRowModal';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface ST_TableContainerProps<TData extends ST_RowData>
  extends DivProps {
  table: ST_TableInstance<TData>;
}

// Thin, always-visible scrollbars so the horizontal bar is not hidden by
// overlay scrollbars on macOS. Chromium ignores the ::-webkit-scrollbar rules
// once scrollbar-width is set, so scrollbar-width: thin only applies in
// engines without ::-webkit-scrollbar support (Firefox).
const tableContainerVariants = cva(
  'relative min-w-0 max-w-full overflow-auto supports-[not_selector(::-webkit-scrollbar)]:[scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent',
);

export const ST_TableContainer = <TData extends ST_RowData>({
  table,
  ...rest
}: ST_TableContainerProps<TData>) => {
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
  const {
    actionCell,
    creatingRow,
    editingRow,
    isFullScreen,
    isLoading,
    showLoadingOverlay,
  } = table.state;

  const loading =
    showLoadingOverlay !== false && (isLoading || showLoadingOverlay);

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);

  const tableContainerProps = {
    ...parseFromValuesOrFunc(stTableContainerProps, {
      table,
    }),
    ...rest,
  };

  useIsomorphicLayoutEffect(() => {
    const topToolbarHeight =
      typeof document !== 'undefined'
        ? (topToolbarRef.current?.offsetHeight ?? 0)
        : 0;

    const bottomToolbarHeight =
      typeof document !== 'undefined'
        ? (bottomToolbarRef?.current?.offsetHeight ?? 0)
        : 0;

    setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight);
  });

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
        tableContainerVariants({ className: tableContainerProps.className }),
      )}
    >
      {loading ? <ST_TableLoadingOverlay table={table} /> : null}
      <ST_Table table={table} />
      {(createModalOpen || editModalOpen) && (
        <ST_EditRowModal open table={table} />
      )}
      {enableCellActions && actionCell && <ST_CellActionMenu table={table} />}
    </div>
  );
};
