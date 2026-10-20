'use client';

import { useMemo } from 'react';
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
        accessorKey: 'name',
        header: 'Name',
        filterVariant: 'autocomplete', // default
        size: 100,
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        stFilterSliderProps: {
          //no need to specify min/max/step if using faceted values
          step: 5_000,
        },
      },
      {
        accessorKey: 'city',
        header: 'City',
        filterVariant: 'select',
        //no need to specify filterSelectOptions if using faceted values
      },
      {
        accessorKey: 'state',
        header: 'State',
        filterVariant: 'multi-select',
        //no need to specify filterSelectOptions if using faceted values
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
    enableFacetedValues: true,
    initialState: { showColumnFilters: true },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
