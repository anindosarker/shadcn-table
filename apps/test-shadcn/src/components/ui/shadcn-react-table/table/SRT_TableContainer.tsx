import { useEffect, useLayoutEffect, useState } from 'react';
import {
  parseFromValuesOrFunc,
  type DivProps,
  type SRT_RowData,
  type SRT_TableInstance,
} from 'shadcn-react-table-core';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { SRT_Table } from './SRT_Table';
import { SRT_TableLoadingOverlay } from './SRT_TableLoadingOverlay';
import { SRT_CellActionMenu } from '../menus/SRT_CellActionMenu';
import { SRT_EditRowModal } from '../modals/SRT_EditRowModal';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export interface SRT_TableContainerProps<TData extends SRT_RowData>
  extends DivProps {
  table: SRT_TableInstance<TData>;
}

const tableContainerVariants = cva('relative max-w-full overflow-auto');

export const SRT_TableContainer = <TData extends SRT_RowData>({
  table,
  ...rest
}: SRT_TableContainerProps<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableCellActions,
      enableStickyHeader,
      srtTableContainerProps,
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
  } = getState();

  const loading =
    showLoadingOverlay !== false && (isLoading || showLoadingOverlay);

  const [totalToolbarHeight, setTotalToolbarHeight] = useState(0);

  const tableContainerProps = {
    ...parseFromValuesOrFunc(srtTableContainerProps, {
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
      aria-describedby={loading ? 'srt-progress' : undefined}
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
      {loading ? <SRT_TableLoadingOverlay table={table} /> : null}
      <SRT_Table table={table} />
      {(createModalOpen || editModalOpen) && (
        <SRT_EditRowModal open table={table} />
      )}
      {enableCellActions && actionCell && <SRT_CellActionMenu table={table} />}
    </div>
  );
};
