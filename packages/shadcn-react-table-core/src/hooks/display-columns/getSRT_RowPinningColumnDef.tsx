import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

/**
 * BOUNDARY NOTE (MRT -> SRT deviation):
 * MRT's getMRT_RowPinningColumnDef imports `MRT_TableBodyRowPinButton` and assigns it to
 * `Cell`. That presentational component lives in the app layer, not the headless core, so
 * the core only emits the headless column definition (id `mrt-row-pin`, size, grow). The
 * app's body cell renderer dispatches on the `mrt-row-pin` id to render the pin button.
 */
export const getSRT_RowPinningColumnDef = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
  return {
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'pin',
      id: 'mrt-row-pin',
      size: 60,
      tableOptions,
    }),
  };
};
