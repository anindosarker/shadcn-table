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
        size: 100,
        srtTableHeadCellProps: {
          align: 'center',
        },
        srtTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        size: 100,
        srtTableHeadCellProps: {
          align: 'center',
        },
        srtTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'age',
        header: 'Age',
        srtTableHeadCellProps: {
          align: 'right',
        },
        srtTableBodyCellProps: {
          align: 'right',
        },
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        srtTableHeadCellProps: {
          align: 'right',
        },
        srtTableBodyCellProps: {
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

  const table = useShadcnReactTable({
    columns,
    data,
  });

  return <ShadcnReactTable table={table} />;
};

export default Example;
