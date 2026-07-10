import { SRT_DefaultDisplayColumn } from '../useSRT_TableOptions';
import {
  type SRT_ColumnDef,
  type SRT_RowData,
  type SRT_StatefulTableOptions,
} from '../../types';
import { defaultDisplayColumnProps } from '../../utils/displayColumn.utils';

const blankColProps = {
  children: null,
  style: {
    minWidth: 0,
    padding: 0,
    width: 0,
  },
};

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
    srtTableBodyCellProps: blankColProps,
    srtTableFooterCellProps: blankColProps,
    srtTableHeadCellProps: blankColProps,
  };
};
