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
  const columns = useMemo(
    //column definitions...
    () =>
      [
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
      ] as ST_ColumnDef<Person>[],
    [],
    //end
  );

  const table = useShadcnTable({
    columns,
    data,
    enableDensityToggle: false,
    initialState: { density: 'compact' },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
