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

  const table = useShadcnTable({
    columns,
    data,
    enableRowPinning: true,
    enablePagination: false,
    enableStickyHeader: true,
    rowPinningDisplayMode: 'top-and-bottom',
    getRowId: (row) => row.email,
    stTableContainerProps: {
      className: 'max-h-[400px]',
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
