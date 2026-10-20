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
      //column definitions...
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      //end
      {
        accessorKey: 'state',
        enableColumnOrdering: false, //disable column ordering for this column,
        header: 'State',
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
    enableColumnOrdering: true,
  });

  return <ShadcnTable table={table} />;
};

export default Example;
