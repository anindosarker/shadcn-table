import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

/**
 * BOUNDARY NOTE (MRT -> SRT deviation):
 * MRT's getMRT_RowSelectColumnDef imports `MRT_SelectCheckbox` from the components folder
 * and assigns it to `Cell`/`Header`. In this split, presentational components live in the
 * app layer (apps/test-shadcn/.../inputs/SRT_SelectCheckbox.tsx), NOT in the headless core,
 * so the core cannot import them. The core therefore emits only the headless column
 * definition (id `mrt-row-select`, size, grow). The app's body/head cell renderers dispatch
 * on the `mrt-row-select` display column id to render `SRT_SelectCheckbox`.
 */
export const getSRT_RowSelectColumnDef = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
  const { enableSelectAll } = tableOptions;

  return {
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'select',
      id: 'mrt-row-select',
      size: enableSelectAll ? 60 : 70,
      tableOptions,
    }),
  };
};
