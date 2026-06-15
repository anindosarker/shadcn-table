import { SRT_DefaultDisplayColumn } from '../useSRT_TableOptions';
import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

/**
 * BOUNDARY NOTE (MRT -> SRT deviation):
 * MRT's getMRT_RowSpacerColumnDef sets `muiTableBodyCellProps`/`muiTableHeadCellProps`/
 * `muiTableFooterCellProps` (with a MUI `sx` object) to render a zero-width blank cell.
 * The headless core has no MUI props (they are intentionally omitted from SRT_ColumnDef),
 * so styling of the spacer cell is the component layer's responsibility. Here we only
 * emit the headless shape: a growable, zero-size display column.
 */
export const getSRT_RowSpacerColumnDef = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
  return {
    ...defaultDisplayColumnProps({
      id: 'mrt-row-spacer',
      size: 0,
      tableOptions,
    }),
    grow: true,
    ...SRT_DefaultDisplayColumn,
  };
};
