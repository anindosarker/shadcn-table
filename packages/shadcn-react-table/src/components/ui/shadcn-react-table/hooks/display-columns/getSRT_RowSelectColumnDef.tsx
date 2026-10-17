import { SRT_SelectCheckbox } from '../../inputs/SRT_SelectCheckbox';
import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

export const getSRT_RowSelectColumnDef = <TData extends SRT_RowData>(
  tableOptions: SRT_StatefulTableOptions<TData>,
): SRT_ColumnDef<TData> => {
  const { enableMultiRowSelection, enableSelectAll } = tableOptions;

  return {
    Cell: ({ row, staticRowIndex, table }) => (
      <SRT_SelectCheckbox
        row={row}
        staticRowIndex={staticRowIndex}
        table={table}
      />
    ),
    Header:
      enableSelectAll && enableMultiRowSelection
        ? ({ table }) => <SRT_SelectCheckbox table={table} />
        : undefined,
    grow: false,
    ...defaultDisplayColumnProps({
      header: 'select',
      id: 'srt-row-select',
      size: enableSelectAll ? 60 : 70,
      tableOptions,
    }),
  };
};
