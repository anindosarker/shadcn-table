import { ST_ToggleRowActionMenuButton } from '@/components/ui-base/shadcn-table/components/buttons/ST_ToggleRowActionMenuButton';
import {
  type ST_ColumnDef,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui-base/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui-base/shadcn-table/shared/utils/displayColumn.utils';

export const getST_RowActionsColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes> => {
  return {
    Cell: ({ cell, row, staticRowIndex }) => (
      <ST_ToggleRowActionMenuButton
        cell={cell}
        row={row}
        staticRowIndex={staticRowIndex}
      />
    ),
    // The header label is for screen readers only.
    Header: () => (
      <span className="sr-only">{tableOptions.localization.actions}</span>
    ),
    ...defaultDisplayColumnProps({
      header: 'actions',
      id: 'st-row-actions',
      size: 48,
      tableOptions,
    }),
    // The column moves through the columns menu, unless the caller says not.
    enableColumnOrdering:
      tableOptions.displayColumnDefOptions?.['st-row-actions']
        ?.enableColumnOrdering ?? true,
  };
};
