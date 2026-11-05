'use client';

import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
} from '@/components/ui/shadcn-table';
import { data, type Person } from './makeData';
import { Building2Icon, DollarSignIcon, MapIcon, UserIcon } from 'lucide-react';

const columns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'First Name',
    sortDescFirst: false, //sort first name in ascending order by default on first sort click (default for non-numeric columns)
  },
  //column definitions...
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'Last Name',
  },
  {
    accessorKey: 'city',
    icon: Building2Icon,
    header: 'City',
  },
  {
    accessorKey: 'state',
    icon: MapIcon,
    header: 'State',
  },
  //end
  {
    accessorKey: 'salary',
    icon: DollarSignIcon,
    header: 'Salary',
    sortDescFirst: true, //sort salary in descending order by default on first sort click (default for numeric columns)
  },
];

const Example = () => {
  const table = useShadcnTable({
    columns,
    data,
    //the sort button in the toolbar opens the sort editor: add, reorder and remove sort rules there
    enableSortPopover: true, //default
    maxMultiSortColCount: 3, //prevent more than 3 columns from being sorted at once
    showSortIndex: true, //show each sorted column's position next to its sort arrow
    initialState: {
      sorting: [
        { id: 'state', desc: false }, //sort by state in ascending order by default
        { id: 'city', desc: true }, //then sort by city in descending order by default
      ],
    },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
