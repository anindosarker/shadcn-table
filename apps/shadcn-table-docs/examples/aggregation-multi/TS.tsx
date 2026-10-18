'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';

const localeStringOptions = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} as const;

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        header: 'First Name',
        accessorKey: 'firstName',
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        header: 'Gender',
        accessorKey: 'gender',
      },
      {
        header: 'State',
        accessorKey: 'state',
      },
      {
        header: 'Salary',
        accessorKey: 'salary',
        aggregationFn: ['count', 'mean', 'median', 'min', 'max'],
        //required to render an aggregated cell, show the average salary in the group
        AggregatedCell: ({ cell }) => (
          <>
            Count:{' '}
            <div className="font-bold text-green-600">
              {cell.getValue<Array<number>>()?.[0]}
            </div>
            Average:{' '}
            <div className="font-bold text-green-600">
              {cell
                .getValue<Array<number>>()?.[1]
                ?.toLocaleString?.('en-US', localeStringOptions)}
            </div>
            Median:{' '}
            <div className="font-bold text-green-600">
              {cell
                .getValue<Array<number>>()?.[2]
                ?.toLocaleString?.('en-US', localeStringOptions)}
            </div>
            Min:{' '}
            <div className="font-bold text-green-600">
              {cell
                .getValue<Array<number>>()?.[3]
                ?.toLocaleString?.('en-US', localeStringOptions)}
            </div>
            Max:{' '}
            <div className="font-bold text-green-600">
              {cell
                .getValue<Array<number>>()?.[4]
                ?.toLocaleString?.('en-US', localeStringOptions)}
            </div>
          </>
        ),
        //customize normal cell render on normal non-aggregated rows
        Cell: ({ cell }) => (
          <>
            {cell
              .getValue<number>()
              ?.toLocaleString?.('en-US', localeStringOptions)}
          </>
        ),
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
    enableGrouping: true,
    enableStickyHeader: true,
    initialState: {
      density: 'compact',
      expanded: true, //expand all groups by default
      grouping: ['state'], //an array of columns to group by by default (can be multiple)
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [{ id: 'state', desc: false }], //sort by state by default
    },
    stToolbarAlertBannerChipProps: {
      className: 'bg-primary text-primary-foreground',
    },
    stTableContainerProps: { className: 'max-h-[700px]' },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
