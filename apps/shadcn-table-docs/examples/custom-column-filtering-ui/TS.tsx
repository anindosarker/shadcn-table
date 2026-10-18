'use client';

import { useMemo } from 'react';
import {
  useShadcnTable,
  type ST_ColumnDef,
  ST_TableContainer,
  ST_TableHeadCellFilterContainer,
} from '@/components/ui/shadcn-table';
import { useST_MediaQuery } from '@/components/ui/shadcn-table/toolbar/useST_MediaQuery';
import { data, type Person } from './makeData';

const Example = () => {
  const isMobile = useST_MediaQuery('(max-width: 1000px)');

  const columns = useMemo<ST_ColumnDef<Person>[]>(
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

  const table = useShadcnTable({
    columns,
    data,
    columnFilterDisplayMode: 'custom', //we will render our own filtering UI
    enableFacetedValues: true,
    stFilterTextFieldProps: ({ column }) => ({
      placeholder: `Filter by ${column.columnDef.header}`,
    }),
  });

  return (
    <div className={`flex gap-2 ${isMobile ? 'flex-col-reverse' : 'flex-row'}`}>
      <ST_TableContainer table={table} />
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col gap-2 p-2">
          {table
            .getLeafHeaders()
            .map(
              (header) =>
                header.column.getCanFilter() && (
                  <ST_TableHeadCellFilterContainer
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
