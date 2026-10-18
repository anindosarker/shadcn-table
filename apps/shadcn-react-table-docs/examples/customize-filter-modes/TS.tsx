'use client';

import { useMemo } from 'react';
import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { data, type Person } from './makeData';

const Example = () => {
  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        enableColumnFilterModes: false, //disable changing filter mode for this column
        filterFn: 'equals', //set filter mode to equals
        header: 'ID',
      },
      {
        accessorKey: 'firstName', //normal, all filter modes are enabled
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        enableColumnFilterModes: false, //disable changing filter mode for this column
        filterFn: 'startsWith', //even though changing the mode is disabled, you can still set the default filter mode
        header: 'Middle Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        //if you do not want to use the default filter modes, you can provide your own and render your own menu
        renderColumnFilterModeMenuItems: ({ onSelectFilterMode }) => [
          <DropdownMenuItem
            key="0"
            onClick={() => onSelectFilterMode('contains')}
          >
            <div>Contains</div>
          </DropdownMenuItem>,
          <DropdownMenuItem
            key="1"
            onClick={() => onSelectFilterMode('customFilterFn')}
          >
            <div>Custom Filter Fn</div>
          </DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'age',
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes
        filterFn: 'between',
        header: 'Age',
      },
    ],
    [],
  );

  const table = useShadcnReactTable({
    columns,
    data,
    enableColumnFilterModes: true, //enable changing filter mode for all columns unless explicitly disabled in a column def
    initialState: { showColumnFilters: true }, //show filters by default
    filterFns: {
      customFilterFn: (row, id, filterValue) => {
        return row.getValue(id) === filterValue;
      },
    },
    localization: {
      filterCustomFilterFn: 'Custom Filter Fn',
    } as any,
  });

  return <ShadcnReactTable table={table} />;
};

export default Example;
