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
        footer: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        footer: 'Last Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
        footer: 'Email',
      },
      {
        accessorKey: 'city',
        header: 'City',
        footer: 'City',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    enableBottomToolbar: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enablePagination: false,
    stTableContainerProps: { className: 'max-h-[400px]' },
    stTableBodyCellProps: {
      className: 'bg-muted',
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
