'use client';

import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { Button } from '@/components/ui/button';

const columns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    sortDescFirst: false, //sort first name in ascending order by default on first sort click (default for non-numeric columns)
  },
  //column definitions...
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'city',
    header: 'City',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  //end
  {
    accessorKey: 'salary',
    header: 'Salary',
    sortDescFirst: true, //sort salary in descending order by default on first sort click (default for numeric columns)
  },
];

const Example = () => {
  const table = useShadcnTable({
    columns,
    data,
    isMultiSortEvent: () => true, //now no need to hold `shift` key to multi-sort
    maxMultiSortColCount: 3, //prevent more than 3 columns from being sorted at once
    initialState: {
      sorting: [
        { id: 'state', desc: false }, //sort by state in ascending order by default
        { id: 'city', desc: true }, //then sort by city in descending order by default
      ],
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <Button onClick={() => table.resetSorting(true)}>
        Clear All Sorting
      </Button>
    ),
  });

  return <ShadcnTable table={table} />;
};

export default Example;
