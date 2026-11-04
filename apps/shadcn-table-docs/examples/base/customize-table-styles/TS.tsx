'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import {
  Building2Icon,
  HashIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';

const Example = () => {
  //light or dark green (CSS variable follows the global dark/light mode)
  const baseBackgroundColor =
    '[--base-background-color:rgba(244,255,233,1)] dark:[--base-background-color:rgba(3,44,43,1)]';

  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        header: 'ID',
        size: 100,
        enableColumnFilter: false,
      },
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
    enableColumnResizing: true,
    enableRowPinning: true,
    enableRowSelection: true,
    stTableLayoutProps: {
      className: 'rounded-none shadow-none',
    },
    stTableBodyProps: {
      className: [
        baseBackgroundColor,
        //darken(baseBackgroundColor, 0.1)
        '[&_tr:nth-of-type(odd):not([data-selected=true]):not([data-pinned=true])>td]:bg-[color-mix(in_srgb,var(--base-background-color)_90%,black)]',
        //darken(baseBackgroundColor, 0.2)
        '[&_tr:nth-of-type(odd):not([data-selected=true]):not([data-pinned=true]):hover>td]:bg-[color-mix(in_srgb,var(--base-background-color)_80%,black)]',
        //lighten(baseBackgroundColor, 0.1)
        '[&_tr:nth-of-type(even):not([data-selected=true]):not([data-pinned=true])>td]:bg-[color-mix(in_srgb,var(--base-background-color)_90%,white)]',
        //darken(baseBackgroundColor, 0.2)
        '[&_tr:nth-of-type(even):not([data-selected=true]):not([data-pinned=true]):hover>td]:bg-[color-mix(in_srgb,var(--base-background-color)_80%,black)]',
      ].join(' '),
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
