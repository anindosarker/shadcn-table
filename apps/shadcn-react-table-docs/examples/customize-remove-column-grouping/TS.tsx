'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
  type SRT_Row,
  SRT_ExpandAllButton,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
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

  const table = useShadcnReactTable({
    columns,
    data,
    displayColumnDefOptions: {
      'srt-row-expand': {
        Header: () => (
          <div className="flex flex-row items-center">
            <SRT_ExpandAllButton table={table} />
            <div>Groups</div>
          </div>
        ),
        GroupedCell: ({ row, table }) => {
          const { grouping } = table.getState();
          return row.getValue(grouping[grouping.length - 1]);
        },
        enableResizing: true,
        srtTableBodyCellProps: ({ row }) => ({
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

  return <ShadcnReactTable table={table} />;
};

export default Example;
