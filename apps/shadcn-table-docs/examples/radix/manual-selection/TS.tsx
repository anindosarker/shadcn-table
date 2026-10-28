'use client';

import { useMemo, useState } from 'react';
import {
  ShadcnTable,
  useShadcnTable,
  type ST_ColumnDef,
  type ST_RowSelectionState,
} from '@/components/ui/shadcn-table';

//data definitions...
interface Person {
  userId: string;
  firstName: string;
  lastName: string;
  age: number;
  address: string;
  city: string;
  state: string;
}
//end

const data = [
  //data definitions...
  {
    userId: '3f25309c-8fa1-470f-811e-cdb082ab9017', //we'll use this as a unique row id
    firstName: 'Dylan',
    lastName: 'Murray',
    age: 22,
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    userId: 'be731030-df83-419c-b3d6-9ef04e7f4a9f',
    firstName: 'Raquel',
    lastName: 'Kohler',
    age: 18,
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  //end
];

const Example = () => {
  const columns = useMemo<ST_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ],
    [],
    //end
  );

  const [rowSelection, setRowSelection] = useState<ST_RowSelectionState>({});

  const table = useShadcnTable({
    columns,
    data,
    getRowId: (row) => row.userId,
    stTableBodyRowProps: ({ row }) => ({
      //implement row selection click events manually
      onClick: () =>
        setRowSelection((prev) => {
          //this is a simple toggle implementation (rowSelection only holds `true` entries)
          const { [row.id]: wasSelected, ...rest } = prev;
          return wasSelected ? rest : { ...rest, [row.id]: true };
        }),
      'data-selected': rowSelection[row.id] || undefined,
      className: 'cursor-pointer',
    }),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  return <ShadcnTable table={table} />;
};

export default Example;
