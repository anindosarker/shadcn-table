'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { CakeIcon, HashIcon, UserIcon, VenusAndMarsIcon } from 'lucide-react';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        header: 'ID',
      },
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },
      {
        accessorKey: 'gender',
        icon: VenusAndMarsIcon,
        header: 'Gender',
        filterFn: 'equals',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        filterVariant: 'select',
      },
      {
        accessorKey: 'age',
        icon: CakeIcon,
        header: 'Age',
        filterVariant: 'range',
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
    columnFilterDisplayMode: 'popover',
  });

  return <ShadcnTable table={table} />;
};

export default Example;
