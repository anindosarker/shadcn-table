'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
  type ST_Row,
  ST_ExpandAllButton,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        header: 'First Name',
        accessorKey: 'firstName',
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        header: 'Age',
        accessorKey: 'age',
      },
      {
        header: 'Gender',
        accessorKey: 'gender',
      },
      {
        header: 'State',
        accessorKey: 'state',
      },
      {
        header: 'Salary',
        accessorKey: 'salary',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    displayColumnDefOptions: {
      'st-row-expand': {
        Header: () => (
          <div className="flex flex-row items-center">
            <ST_ExpandAllButton />
            <div>Groups</div>
          </div>
        ),
        GroupedCell: ({ row, table }) => {
          const { grouping } = table.store.state;
          return row.getValue(grouping[grouping.length - 1]);
        },
        enableResizing: true,
        stTableBodyCellProps: ({ row }) => ({
          style: {
            color:
              row.depth === 0
                ? 'var(--primary)'
                : row.depth === 1
                  ? 'var(--secondary)'
                  : undefined,
          },
        }),
        size: 200,
      },
    },
    enableGrouping: true,
    enableColumnResizing: true,
    groupedColumnMode: 'remove',
    initialState: {
      density: 'compact',
      expanded: true, //expand all groups by default
      grouping: ['state', 'gender'], //an array of columns to group by by default (can be multiple)
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [{ id: 'state', desc: false }],
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
