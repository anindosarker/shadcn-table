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
      {
        accessorKey: 'city',
        header: 'City',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    enablePagination: false,
    enableRowPinning: true,
    enableRowSelection: true,
    enableStickyHeader: true,
    rowPinningDisplayMode: 'select-sticky',
    getRowId: (row) => row.email,
    initialState: {
      rowPinning: {
        bottom: [],
        top: ['ereinger@mailinator.com'],
      },
      rowSelection: {
        'ereinger@mailinator.com': true,
      },
    },
    stTableContainerProps: {
      className: 'max-h-[400px]',
    },
    stTableBodyRowProps: ({ row, table }) => {
      const density = table.atoms.density.get();
      return {
        style: {
          //Set a fixed height for pinned rows
          height: row.getIsPinned()
            ? `${
                //Default mrt row height estimates. Adjust as needed.
                density === 'compact' ? 37 : density === 'comfortable' ? 53 : 69
              }px`
            : undefined,
        },
      };
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
