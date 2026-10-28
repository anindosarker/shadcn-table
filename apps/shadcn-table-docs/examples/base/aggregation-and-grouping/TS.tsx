'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';

const Example = () => {
  const averageSalary = useMemo(
    () => data.reduce((acc, curr) => acc + curr.salary, 0) / data.length,
    [],
  );

  const maxAge = useMemo(
    () => data.reduce((acc, curr) => Math.max(acc, curr.age), 0),
    [],
  );

  const columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        header: 'First Name',
        accessorKey: 'firstName',
        enableGrouping: false, //do not let this column be grouped
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
      },
      {
        header: 'Age',
        accessorKey: 'age',
        aggregationFn: 'max', //show the max age in the group (lots of pre-built aggregationFns to choose from)
        //required to render an aggregated cell
        AggregatedCell: ({ cell, table }) => (
          <>
            Oldest by{' '}
            {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
            <span className="inline font-bold text-sky-600">
              {cell.getValue<number>()}
            </span>
          </>
        ),
        Footer: () => (
          <div className="flex flex-col">
            Max Age:
            <div className="text-yellow-600">{Math.round(maxAge)}</div>
          </div>
        ),
      },
      {
        header: 'Gender',
        accessorKey: 'gender',
        //optionally, customize the cell render when this column is grouped. Make the text blue and pluralize the word
        GroupedCell: ({ cell, row }) => (
          <div className="text-primary">
            <strong>{cell.getValue<string>()}s </strong> ({row.subRows?.length})
          </div>
        ),
      },
      {
        header: 'State',
        accessorKey: 'state',
      },
      {
        header: 'Salary',
        accessorKey: 'salary',
        aggregationFn: 'mean',
        //required to render an aggregated cell, show the average salary in the group
        AggregatedCell: ({ cell, table }) => (
          <>
            Average by{' '}
            {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
            <div className="font-bold text-green-600">
              {cell.getValue<number>()?.toLocaleString?.('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
          </>
        ),
        //customize normal cell render on normal non-aggregated rows
        Cell: ({ cell }) => (
          <>
            {cell.getValue<number>()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </>
        ),
        Footer: () => (
          <div className="flex flex-col">
            Average Salary:
            <div className="text-yellow-600">
              {averageSalary?.toLocaleString?.('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })}
            </div>
          </div>
        ),
      },
    ],
    [averageSalary, maxAge],
  );

  const table = useShadcnTable({
    columns,
    data,
    displayColumnDefOptions: {
      'st-row-expand': {
        enableResizing: true,
      },
    },
    enableColumnResizing: true,
    enableGrouping: true,
    enableStickyHeader: true,
    enableStickyFooter: true,
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
