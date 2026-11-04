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
    () => [
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      //column definitions...
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
      //end
      {
        accessorKey: 'state',
        icon: MapIcon,
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
