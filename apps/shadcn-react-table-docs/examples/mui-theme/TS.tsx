'use client';

import {
  ShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';

type Person = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
};

//column definitions...
const columns: SRT_ColumnDef<Person>[] = [
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
    header: 'State',
  },
];
//end

//data definitions...
const data = [
  {
    firstName: 'Dylan',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    firstName: 'Raquel',
    lastName: 'Kohler',
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    firstName: 'Ervin',
    lastName: 'Reinger',
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    firstName: 'Brittany',
    lastName: 'McCullough',
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    firstName: 'Branson',
    lastName: 'Frami',
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
  },
];
//end

const Example = () => {
  //(optional) the global shadcn theme is defined in your app root; override its CSS variables here for the table only
  const tableTheme = [
    //let's use the same dark/light mode as the global theme (the `dark:` variants below follow it)
    '[--primary:var(--secondary)] [--primary-foreground:var(--secondary-foreground)]', //swap in the secondary color as the primary for the table
    '[--info:rgb(255,122,0)]', //add in a custom color for the toolbar alert background stuff
    '[--background:rgb(254,255,244)]', //random light yellow color for the background in light mode
    'dark:[--background:#000]', //pure black table in dark mode for fun
    '[&_button]:normal-case [&_button]:text-[1.2rem]', //customize typography styles for all buttons in table by default
  ].join(' ');

  return (
    <div className={tableTheme}>
      <ShadcnReactTable
        columns={columns}
        data={data}
        enableRowSelection
        enableColumnOrdering
        enableColumnPinning
      />
    </div>
  );
};

export default Example;
