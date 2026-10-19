'use client';

import { useMemo } from 'react';
import {
  ShadcnTable,
  type ST_ExpandedState,
  type ST_ColumnDef,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';

export type Person = {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  subRows?: Person[]; //Each person can have sub rows of more people
};

//data definitions...
export const data: Person[] = [
  {
    id: '1',
    firstName: 'Dylan',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
    subRows: [
      {
        id: '2',
        firstName: 'Ervin',
        lastName: 'Reinger',
        address: '566 Brakus Inlet',
        city: 'South Linda',
        state: 'West Virginia',
        subRows: [
          {
            id: '3',
            firstName: 'Jordane',
            lastName: 'Homenick',
            address: '1234 Brakus Inlet',
            city: 'South Linda',
            state: 'West Virginia',
          },
          {
            id: '4',
            firstName: 'Jordan',
            lastName: 'Clarkson',
            address: '4882 Palm Rd',
            city: 'San Francisco',
            state: 'California',
          },
        ],
      },
      {
        id: '5',
        firstName: 'Brittany',
        lastName: 'McCullough',
        address: '722 Emie Stream',
        city: 'Lincoln',
        state: 'Nebraska',
      },
    ],
  },
  {
    id: '6',
    firstName: 'Raquel',
    lastName: 'Kohler',
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
    subRows: [
      {
        id: '7',
        firstName: 'Branson',
        lastName: 'Frami',
        address: '32188 Larkin Turnpike',
        city: 'Charleston',
        state: 'South Carolina',
        subRows: [
          {
            id: '8',
            firstName: 'Henry',
            lastName: 'Ford',
            address: '1234 Brakus Inlet',
            city: 'Nashville',
            state: 'Tennessee',
          },
        ],
      },
    ],
  },
];
//end

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
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
      },

      {
        accessorKey: 'state',
        enableColumnOrdering: false,
        header: 'State',
      },
    ],
    [],
    //end
  );

  const initialExpandedRootRows = useMemo<ST_ExpandedState>(
    () =>
      data
        .map((originalRow) => originalRow.id) //get all the root row ids, use recursion for additional levels
        .reduce((a, v) => ({ ...a, [v]: true }), {}), //convert to an object with all the ids as keys and `true` as values
    [],
  );

  const table = useShadcnTable({
    columns,
    data,
    enableExpanding: true,
    getRowId: (originalRow) => originalRow.id,
    initialState: { expanded: initialExpandedRootRows }, //only expand the root rows by default
    renderTopToolbarCustomActions: ({ table }) => (
      <Button onClick={() => table.resetExpanded()}>Reset Expanded</Button>
    ),
  });

  return <ShadcnTable table={table} />;
};

export default Example;
