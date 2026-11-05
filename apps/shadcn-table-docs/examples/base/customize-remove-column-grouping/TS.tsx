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
import {
  CakeIcon,
  DollarSignIcon,
  MapIcon,
  UserIcon,
  VenusAndMarsIcon,
} from 'lucide-react';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        header: 'First Name',
        accessorKey: 'firstName',
        icon: UserIcon,
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
        icon: UserIcon,
      },
      {
        header: 'Age',
        accessorKey: 'age',
        icon: CakeIcon,
      },
      {
        header: 'Gender',
        accessorKey: 'gender',
        icon: VenusAndMarsIcon,
      },
      {
        header: 'State',
        accessorKey: 'state',
        icon: MapIcon,
      },
      {
        header: 'Salary',
        accessorKey: 'salary',
        icon: DollarSignIcon,
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
          const grouping = table.atoms.grouping.get();
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
