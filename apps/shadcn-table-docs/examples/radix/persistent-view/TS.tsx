'use client';

import { useMemo } from 'react';
import { Building2, DollarSign, MapPin, User } from 'lucide-react';
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
        icon: User,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: User,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapPin,
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        icon: DollarSign,
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
    //saves the view settings, pins, column order, pinning and visibility to localStorage
    persistViewSettings: true,
    //optional: a stable name for the storage key (a hash of the column ids otherwise)
    id: 'persistent-view',
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">
        Change the density, the grid lines or the column order, then reload the
        page: the table comes back the way you left it. Reset view in the view
        settings panel clears what was saved.
      </p>
      <ShadcnTable table={table} />
    </div>
  );
};

export default Example;
