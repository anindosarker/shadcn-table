import { ST_ToggleRowActionMenuButton } from '@/components/ui-aria/shadcn-table/components/buttons/ST_ToggleRowActionMenuButton';
import {
  type ST_ColumnDef,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui-aria/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui-aria/shadcn-table/shared/utils/displayColumn.utils';

export const getST_RowActionsColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes> => {
  const { localization, renderRowActions } = tableOptions;
  return {
    Cell: ({ cell, row, staticRowIndex }) =>
      renderRowActions ? (
        <div className="flex items-center justify-center gap-1">
          <ST_ToggleRowActionMenuButton
            cell={cell}
            row={row}
            staticRowIndex={staticRowIndex}
          />
        </div>
      ) : (
        <ST_ToggleRowActionMenuButton
          cell={cell}
          row={row}
          staticRowIndex={staticRowIndex}
        />
      ),
    // The dots button's column labels itself for screen readers only; with
    // `renderRowActions` the label shows above the controls.
    Header: () =>
      renderRowActions ? (
        localization.actions
      ) : (
        <span className="sr-only">{localization.actions}</span>
      ),
    ...defaultDisplayColumnProps({
      header: 'actions',
      id: 'st-row-actions',
      // Two icon buttons and their gap fit 96 px; the dots button alone 48.
      size: renderRowActions ? 96 : 48,
      tableOptions,
    }),
    // The column moves through the columns menu, unless the caller says not.
    enableColumnOrdering:
      tableOptions.displayColumnDefOptions?.['st-row-actions']
        ?.enableColumnOrdering ?? true,
  };
};
