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
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    enableBottomToolbar: false,
    enablePagination: false,
    enableRowVirtualization: true,
    stTableContainerProps: {
      className: 'max-h-[500px]',
    },
    renderDetailPanel: ({ row }) => (
      <div className="m-auto grid w-full grid-cols-2">
        <p>Address: {row.original.address}</p>
        <p>City: {row.original.city}</p>
        <p>State: {row.original.state}</p>
        <p>Country: {row.original.country}</p>
      </div>
    ),
    rowVirtualizerOptions: ({ table }) => {
      const { density, expanded } = table.getState();
      return {
        //adjust to your needs
        estimateSize: (index) =>
          index % 2 === 1 //even rows are normal rows, odd rows are detail panels
            ? //Estimate open detail panels as 80px tall, closed detail panels as 0px tall
              expanded === true
              ? 80
              : 0
            : //estimate normal row heights
              density === 'compact'
              ? 37
              : density === 'comfortable'
                ? 58
                : 73,
      };
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
