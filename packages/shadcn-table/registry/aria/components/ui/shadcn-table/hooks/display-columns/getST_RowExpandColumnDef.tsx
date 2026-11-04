import { type ReactNode, useState } from 'react';
import { ST_Tooltip } from '@/components/ui/shadcn-table/components/buttons/ST_Tooltip';
import { ST_ExpandAllButton } from '@/components/ui/shadcn-table/components/buttons/ST_ExpandAllButton';
import { ST_ExpandButton } from '@/components/ui/shadcn-table/components/buttons/ST_ExpandButton';
import {
  type ST_ColumnDef,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui/shadcn-table/types';
import {
  getAllLeafColumnDefs,
  getColumnId,
} from '@/components/ui/shadcn-table/shared/utils/column.utils';
import { defaultDisplayColumnProps } from '@/components/ui/shadcn-table/shared/utils/displayColumn.utils';

/**
 * The grouped value with the grouping column's header as its tooltip. A
 * component of its own: `Cell` runs as a plain function, so it holds no state.
 */
const ST_GroupingValue = ({
  header,
  value,
}: {
  header: string;
  value: ReactNode;
}) => {
  // Pointer enter and leave open the standalone tooltip; the span takes no
  // focus.
  const [tooltipOpen, setTooltipOpen] = useState(false);
  return (
    <ST_Tooltip side="right" standalone open={tooltipOpen} title={header}>
      <span
        onPointerEnter={() => setTooltipOpen(true)}
        onPointerLeave={() => setTooltipOpen(false)}
        title={header}
      >
        {value}
      </span>
    </ST_Tooltip>
  );
};

export const getST_RowExpandColumnDef = <TData extends ST_RowData>(
  tableOptions: ST_StatefulTableOptions<TData>,
): ST_ColumnDef<TData, unknown, ST_NeutralPartPropTypes> => {
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
      const expandButtonProps = { row, staticRowIndex };
      const subRowsLength = row.subRows?.length;
      if (groupedColumnMode === 'remove' && row.groupingColumnId) {
        return (
          <div className="flex flex-row items-center gap-1">
            <ST_ExpandButton {...expandButtonProps} />
            <ST_GroupingValue
              header={table.getColumn(row.groupingColumnId).columnDef.header}
              value={row.groupingValue as ReactNode}
            />
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
              <ST_ExpandAllButton />
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
    // The column names the grouped columns, so it shows the first one's icon.
    icon:
      groupedColumnMode === 'remove' && grouping?.length
        ? getAllLeafColumnDefs(tableOptions.columns).find(
            (columnDef) => getColumnId(columnDef) === grouping[0],
          )?.icon
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
