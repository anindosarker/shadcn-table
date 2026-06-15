import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

/**
 * BOUNDARY NOTE (MRT -> SRT deviation):
 * MRT's getMRT_RowDragColumnDef imports `MRT_TableBodyRowGrabHandle` and assigns it to
 * `Cell`. That presentational component lives in the app layer, not the headless core, so
 * the core only emits the headless column definition (id `mrt-row-drag`, size, grow). The
 * app's body cell renderer dispatches on the `mrt-row-drag` id to render the grab handle.
 */
export const getSRT_RowDragColumnDef = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
  return {
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'move',
      id: 'mrt-row-drag',
      size: 60,
      tableOptions,
    }),
  };
};
