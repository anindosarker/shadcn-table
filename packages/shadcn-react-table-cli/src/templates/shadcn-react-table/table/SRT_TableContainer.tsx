import type { SRT_RowData, SRT_TableInstance } from 'shadcn-react-table-core';
import { SRT_Table } from './SRT_Table';
import { SRT_TableLoadingOverlay } from './SRT_TableLoadingOverlay';

export interface SRT_TableContainerProps<TData extends SRT_RowData> {
  table: SRT_TableInstance<TData>;
}

/**
 * TODO:
 * - cva for className overrides
 * - MRT_TableLoadingOverlay
 * - MRT_EditRowModal
 * - MRT_CellActionMenu
 */

export const SRT_TableContainer = <TData extends SRT_RowData>({
  table,
}: SRT_TableContainerProps<TData>) => {
  const {
    getState,
    // options: {
    //   createDisplayMode,
    //   editDisplayMode,
    //   enableCellActions,
    //   enableStickyHeader,
    //   muiTableContainerProps,
    // },
    // refs: { bottomToolbarRef, tableContainerRef, topToolbarRef },
  } = table;
  const {
    // actionCell,
    // creatingRow,
    // editingRow,
    // isFullScreen,
    isLoading,
    showLoadingOverlay,
  } = getState();

  const loading =
    showLoadingOverlay !== false && (isLoading || showLoadingOverlay);

  return (
    <div className="relative max-w-full overflow-auto">
      {loading ? <SRT_TableLoadingOverlay table={table} /> : null}
      <SRT_Table table={table} />
    </div>
  );
};
