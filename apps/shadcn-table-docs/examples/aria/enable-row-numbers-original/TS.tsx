'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { Building2Icon, MapIcon, MapPinIcon, UserIcon } from 'lucide-react';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
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
        accessorKey: 'address',
        icon: MapPinIcon,
        header: 'Address',
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
      },
    ],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    enableRowNumbers: true,
    rowNumberDisplayMode: 'original',
  });

  return <ShadcnTable table={table} />;
};

export default Example;
