'use client';

import { useMemo } from 'react';
import {
  useShadcnReactTable,
  type SRT_ColumnDef,
  SRT_TableContainer,
  SRT_TableHeadCellFilterContainer,
} from '@/components/ui/shadcn-react-table';
import { useSRT_MediaQuery } from '@/components/ui/shadcn-react-table/toolbar/useSRT_MediaQuery';
import { data, type Person } from './makeData';

const Example = () => {
  const isMobile = useSRT_MediaQuery('(max-width: 1000px)');

  const columns = useMemo<SRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'firstName',
        header: 'First Name',
        filterVariant: 'autocomplete',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        filterFn: 'equals',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        filterVariant: 'select',
      },
      {
        accessorKey: 'age',
        header: 'Age',
        filterVariant: 'range',
      },
    ],
    [],
  );

  const table = useShadcnReactTable({
    columns,
    data,
    columnFilterDisplayMode: 'custom', //we will render our own filtering UI
    enableFacetedValues: true,
    srtFilterTextFieldProps: ({ column }) => ({
      placeholder: `Filter by ${column.columnDef.header}`,
    }),
  });

  return (
    <div className={`flex gap-2 ${isMobile ? 'flex-col-reverse' : 'flex-row'}`}>
      <SRT_TableContainer table={table} />
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-2 p-2">
          {table
            .getLeafHeaders()
            .map(
              (header) =>
                header.column.getCanFilter() && (
                  <SRT_TableHeadCellFilterContainer
                    key={header.id}
                    header={header}
                    table={table}
                    open
                  />
                ),
            )}
        </div>
      </div>
    </div>
  );
};

export default Example;
