'use client';

import { useMemo } from 'react';
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { type Person } from './makeData';

const data: Array<Person> = [];

const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
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

  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      state={{ isLoading: true }}
      srtCircularProgressProps={{
        className: 'size-[55px] text-secondary-foreground',
        strokeWidth: 5,
      }}
      srtSkeletonProps={{
        className: 'h-7 animate-pulse',
      }}
    />
  );
};

export default Example;
