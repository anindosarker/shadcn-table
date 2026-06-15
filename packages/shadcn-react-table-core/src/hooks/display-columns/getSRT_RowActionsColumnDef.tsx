import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

/**
 * BOUNDARY NOTE (MRT -> SRT deviation):
 * MRT's getMRT_RowActionsColumnDef imports `MRT_ToggleRowActionMenuButton` and assigns it
 * to `Cell`. That presentational component lives in the app layer, not the headless core,
 * so the core only emits the headless column definition (id `mrt-row-actions`, size). The
 * app's body cell renderer dispatches on the `mrt-row-actions` id to render the action menu
 * button.
 */
export const getSRT_RowActionsColumnDef = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
  return {
    ...defaultDisplayColumnProps({
      header: 'actions',
      id: 'mrt-row-actions',
      size: 70,
      tableOptions,
    }),
  };
};
