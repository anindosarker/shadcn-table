'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Building2Icon,
  GlobeIcon,
  HashIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        enableColumnPinning: false, //disable column pinning for this column
        header: 'ID',
        size: 56,
      },
      //column definitions...
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        icon: UserIcon,
        header: 'Middle Name',
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
        size: 300,
      },
      //end
      {
        accessorKey: 'city', //this column gets pinned to the right by default because of the initial state,
        icon: Building2Icon,
        header: 'City',
      },
      {
        accessorKey: 'state', //this column gets pinned left by default because of the the initial state,
        icon: MapIcon,
        header: 'State',
      },
      {
        accessorKey: 'country',
        icon: GlobeIcon,
        header: 'Country',
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
    enableColumnPinning: true,
    enableRowActions: true,
    layoutMode: 'grid-no-grow', //constant column widths
    renderRowActionMenuItems: () => [
      <DropdownMenuItem key="action">Action</DropdownMenuItem>,
    ],
    initialState: {
      columnPinning: { start: ['st-row-actions', 'state'], end: ['city'] },
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
