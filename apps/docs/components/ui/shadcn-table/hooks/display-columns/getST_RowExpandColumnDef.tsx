import { type ReactNode } from 'react';
import { ST_ExpandAllButton } from '@/components/ui/shadcn-table/buttons/ST_ExpandAllButton';
import { ST_ExpandButton } from '@/components/ui/shadcn-table/buttons/ST_ExpandButton';
import { ST_Tooltip } from '@/components/ui/shadcn-table/ST_Tooltip';
import {
  type ST_ColumnDef,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui/shadcn-table/types';
import { defaultDisplayColumnProps } from '@/components/ui/shadcn-table/utils/displayColumn.utils';

export const getST_RowExpandColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData> => {
  const {
    defaultColumn,
    enableExpandAll,
    groupedColumnMode,
    positionExpandColumn,
    renderDetailPanel,
    state: { grouping },
  } = tableOptions;

  const alignProps =
    positionExpandColumn === 'last'
      ? ({
          align: 'right',
        } as const)
      : undefined;

  return {
    Cell: ({ cell, column, row, staticRowIndex, table }) => {
      const expandButtonProps = { row, staticRowIndex, table };
      const subRowsLength = row.subRows?.length;
      if (groupedColumnMode === 'remove' && row.groupingColumnId) {
        return (
          <div className="flex flex-row items-center gap-1">
            <ST_ExpandButton {...expandButtonProps} />
            <ST_Tooltip
              side="right"
              title={table.getColumn(row.groupingColumnId).columnDef.header}
            >
              <span>{row.groupingValue as ReactNode}</span>
            </ST_Tooltip>
            {!!subRowsLength && <span>({subRowsLength})</span>}
          </div>
        );
      } else {
        return (
          <>
            <ST_ExpandButton {...expandButtonProps} />
            {column.columnDef.GroupedCell?.({ cell, column, row, table })}
          </>
        );
      }
    },
    Header: enableExpandAll
      ? ({ table }) => {
          return (
            <>
              <ST_ExpandAllButton table={table} />
              {groupedColumnMode === 'remove' &&
                grouping
                  ?.map(
                    (groupedColumnId) =>
                      table.getColumn(groupedColumnId).columnDef.header,
                  )
                  ?.join(', ')}
            </>
          );
        }
      : undefined,
    stTableBodyCellProps: alignProps,
    stTableHeadCellProps: alignProps,
    ...defaultDisplayColumnProps({
      header: 'expand',
      id: 'st-row-expand',
      size:
        groupedColumnMode === 'remove'
          ? (defaultColumn?.size ?? 180)
          : renderDetailPanel
            ? enableExpandAll
              ? 60
              : 70
            : 100,
      tableOptions,
    }),
  };
};
