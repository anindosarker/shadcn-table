'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { Building2Icon, DollarSignIcon, MapIcon, UserIcon } from 'lucide-react';

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name',
        icon: UserIcon,
        header: 'Name',
        filterVariant: 'autocomplete', // default
        size: 110,
      },
      {
        accessorKey: 'salary',
        icon: DollarSignIcon,
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
        icon: Building2Icon,
        header: 'City',
        filterVariant: 'select',
        //no need to specify filterSelectOptions if using faceted values
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
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
  });

  return <ShadcnTable table={table} />;
};

export default Example;
