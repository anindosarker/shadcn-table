import { Fragment, type ReactNode, useState } from 'react';
import { ST_Tooltip } from '@/components/ui-aria/shadcn-table/components/buttons/ST_Tooltip';
import { ST_ExpandAllButton } from '@/components/ui-aria/shadcn-table/components/buttons/ST_ExpandAllButton';
import { ST_ExpandButton } from '@/components/ui-aria/shadcn-table/components/buttons/ST_ExpandButton';
import {
  type ST_ColumnDef,
  type ST_NeutralPartPropTypes,
  type ST_RowData,
  type ST_StatefulTableOptions,
} from '@/components/ui-aria/shadcn-table/types';
import {
  getAllLeafColumnDefs,
  getColumnId,
  renderColumnIcon,
} from '@/components/ui-aria/shadcn-table/shared/utils/column.utils';
import { defaultDisplayColumnProps } from '@/components/ui-aria/shadcn-table/shared/utils/displayColumn.utils';

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

  const leafColumnDefs = getAllLeafColumnDefs(tableOptions.columns);

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
    // Under 'remove' the header is a breadcrumb of the grouped columns: per
    // column its icon and name, chevrons between them.
    Header:
      enableExpandAll || groupedColumnMode === 'remove'
        ? ({ table }) => {
            const {
              options: {
                icons: { ChevronRightIcon },
              },
            } = table;
            return (
              <span className="inline-flex items-center gap-1 whitespace-nowrap">
                {enableExpandAll && <ST_ExpandAllButton />}
                {groupedColumnMode === 'remove' &&
                  grouping?.map((groupedColumnId, index) => {
                    const { columnDef } = table.getColumn(groupedColumnId);
                    return (
                      <Fragment key={groupedColumnId}>
                        {index > 0 && (
                          <ChevronRightIcon
                            aria-hidden
                            className="size-3.5 shrink-0 opacity-70 rtl:rotate-180"
                          />
                        )}
                        {renderColumnIcon(columnDef.icon)}
                        <span>{columnDef.header}</span>
                      </Fragment>
                    );
                  })}
              </span>
            );
          }
        : undefined,
    stTableBodyCellProps: alignProps,
    stTableHeadCellProps: alignProps,
    ...defaultDisplayColumnProps({
      header: 'expand',
      id: 'st-row-expand',
      // Under 'remove' the grouped columns leave the table and their widths
      // move into this one.
      size:
        groupedColumnMode === 'remove'
          ? grouping?.length
            ? grouping.reduce(
                (sum, groupedColumnId) =>
                  sum +
                  (leafColumnDefs.find(
                    (columnDef) => getColumnId(columnDef) === groupedColumnId,
                  )?.size ??
                    defaultColumn?.size ??
                    180),
                0,
              )
            : (defaultColumn?.size ?? 180)
          : renderDetailPanel
            ? enableExpandAll
              ? 60
              : 70
            : 100,
      tableOptions,
    }),
  };
};
