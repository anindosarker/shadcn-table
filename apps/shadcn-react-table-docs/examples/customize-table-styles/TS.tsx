'use client';

import { useMemo } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';

const Example = () => {
  //light or dark green (CSS variable follows the global dark/light mode)
  const baseBackgroundColor =
    '[--base-background-color:rgba(244,255,233,1)] dark:[--base-background-color:rgba(3,44,43,1)]';

  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        header: 'Middle Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        header: 'Address',
        size: 300,
      },
      {
        accessorKey: 'city',
        header: 'City',
      },

      {
        accessorKey: 'state',
        header: 'State',
      },
    ],
    [],
    //end
  );

  const table = useShadcnReactTable({
    columns,
    data,
    enableColumnResizing: true,
    enableRowPinning: true,
    enableRowSelection: true,
    srtTableLayoutProps: {
      className: 'rounded-none shadow-none',
    },
    srtTableBodyProps: {
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

  return <ShadcnReactTable table={table} />;
};

export default Example;
