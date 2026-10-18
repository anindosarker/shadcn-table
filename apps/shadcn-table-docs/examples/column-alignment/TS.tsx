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
        size: 100,
        stTableHeadCellProps: {
          align: 'center',
        },
        stTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 100,
        stTableHeadCellProps: {
          align: 'center',
        },
        stTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'age',
        header: 'Age',
        stTableHeadCellProps: {
          align: 'right',
        },
        stTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        stTableHeadCellProps: {
          align: 'right',
        },
        stTableBodyCellProps: {
          align: 'right',
        },
        Cell: ({ cell }) =>
          cell
            .getValue<number>()
            .toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
  });

  return <ShadcnTable table={table} />;
};

export default Example;
