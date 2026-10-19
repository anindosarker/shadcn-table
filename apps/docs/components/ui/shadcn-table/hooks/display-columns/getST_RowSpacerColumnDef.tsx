import { ST_DefaultDisplayColumn } from '@/components/ui/shadcn-table/hooks/useST_TableOptions';
import {
  type ST_ColumnDef,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui/shadcn-table/utils/displayColumn.utils';

const blankColProps = {
  children: null,
  style: {
    minWidth: 0,
    padding: 0,
    width: 0,
  },
};

export const getST_RowSpacerColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData> => {
  return {
    ...defaultDisplayColumnProps({
      id: 'st-row-spacer',
      size: 0,
      tableOptions,
    }),
    grow: true,
    ...ST_DefaultDisplayColumn,
    stTableBodyCellProps: blankColProps,
    stTableFooterCellProps: blankColProps,
    stTableHeadCellProps: blankColProps,
  };
};
