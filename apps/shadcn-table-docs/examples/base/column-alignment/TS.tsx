'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { CakeIcon, DollarSignIcon, UserIcon } from 'lucide-react';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        icon: UserIcon,
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
        icon: UserIcon,
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
        icon: CakeIcon,
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
        icon: DollarSignIcon,
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
