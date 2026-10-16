import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

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
