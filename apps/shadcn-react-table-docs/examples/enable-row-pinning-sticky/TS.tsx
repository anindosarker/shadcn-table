'use client';

import { useMemo } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
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
  );

  const table = useShadcnReactTable({
    columns,
    data,
    enableRowPinning: true,
    enablePagination: false,
    enableStickyHeader: true,
    getRowId: (row) => row.email,
    initialState: {
      rowPinning: {
        top: ['rkholer33@yopmail.com', 'egarcia@yopmail.com'],
        bottom: [],
      },
    },
    srtTableContainerProps: {
      className: 'max-h-[400px]',
    },
    srtTableBodyRowProps: ({ row, table }) => {
      const { density } = table.getState();
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

  return <ShadcnReactTable table={table} />;
};

export default Example;
