'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
  ST_TableHeadCellFilterContainer,
  ST_TableProvider,
  useST_MediaQuery,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { CakeIcon, HashIcon, UserIcon, VenusAndMarsIcon } from 'lucide-react';

const Example = () => {
  const isMobile = useST_MediaQuery('(max-width: 1000px)');

  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        header: 'ID',
      },
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
        filterVariant: 'autocomplete',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },
      {
        accessorKey: 'gender',
        icon: VenusAndMarsIcon,
        header: 'Gender',
        filterFn: 'equals',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        filterVariant: 'select',
      },
      {
        accessorKey: 'age',
        icon: CakeIcon,
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
    <ST_TableProvider table={table}>
      <div
        className={`flex gap-2 ${isMobile ? 'flex-col-reverse' : 'flex-row'}`}
      >
        <div className="min-w-0 flex-1">
          <ShadcnTable table={table} />
        </div>
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
                      open
                    />
                  ),
              )}
          </div>
        </div>
      </div>
    </ST_TableProvider>
  );
};

export default Example;
