'use client';

import {
  ShadcnReactTable,
  useShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';
import { data, type Person } from './makeData';
import { Button } from '@/components/ui/button';

const columns: SRT_ColumnDef<Person>[] = [
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
  const table = useShadcnReactTable({
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

  return <ShadcnReactTable table={table} />;
};

export default Example;
