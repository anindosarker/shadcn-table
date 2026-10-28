'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    enableExpandAll: false, //disable expand all button
    stDetailPanelProps: () => ({
      className: 'bg-black/10 dark:bg-[rgba(255,210,244,0.1)]',
    }),
    //custom expand button rotation
    stExpandButtonProps: ({ row, table }) => {
      const isExpanded = row.getIsExpanded(); //read at render: the button toggles the row before this onClick runs
      return {
        onClick: () => table.setExpanded({ [row.id]: !isExpanded }), //only 1 detail panel open at a time
        style: {
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s',
        },
      };
    },
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
      row.original.address ? (
        <div className="m-auto grid w-full grid-cols-2">
          <p>Address: {row.original.address}</p>
          <p>City: {row.original.city}</p>
          <p>State: {row.original.state}</p>
          <p>Country: {row.original.country}</p>
        </div>
      ) : null,
  });

  return <ShadcnTable table={table} />;
};

export default Example;
