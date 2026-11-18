import { useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_SortingState,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import {
  Building2Icon,
  CakeIcon,
  DollarSignIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Sorting',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const SortingEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} />
);

export const DisableSorting = () => (
  <ShadcnTable columns={columns} data={data} enableSorting={false} />
);

export const DisableSortingForSpecificColumns = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'address',
        enableSorting: false,
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      {
        accessorKey: 'phoneNumber',
        enableSorting: false,
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
  />
);

export const DisableMultiSorting = () => (
  <ShadcnTable columns={columns} data={data} enableMultiSort={false} />
);

export const DisableSortingRemoval = () => (
  <ShadcnTable columns={columns} data={data} enableSortingRemoval={false} />
);

export const SortRanking = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        sortFn: 'fuzzy',
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
    enableRowNumbers
    initialState={{ sorting: [{ desc: false, id: 'firstName' }] }}
  />
);

export const SortingStateManaged = () => {
  const [sorting, setSorting] = useState<ST_SortingState>([]);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      onSortingChange={setSorting}
      state={{ sorting }}
    />
  );
};

type Pet = { name: string; age: number };

const pets: Pet[] = [
  { age: 4, name: 'Milo' },
  { age: 2, name: 'Luna' },
  { age: 9, name: 'Otis' },
];

const petColumns: ST_ColumnDef<Pet>[] = [
  { accessorKey: 'name', header: 'Name', icon: UserIcon },
  { accessorKey: 'age', header: 'Age', icon: CakeIcon },
];

const bodyNames = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('tbody tr')].map(
    (row) => row.querySelector('td')?.textContent,
  );

const ClearSortTable = () => {
  const [renders, setRenders] = useState(0);
  return (
    <>
      <button onClick={() => setRenders(renders + 1)} type="button">
        Re-render {renders}
      </button>
      <ShadcnTable columns={petColumns} data={pets} />
    </>
  );
};

/**
 * With the default ranked results, Clear sort leaves the rows unsorted, also
 * after the owner re-renders.
 */
export const ClearSortStaysCleared = {
  render: () => <ClearSortTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Milo');
    const nameHeader = canvas.getByRole('columnheader', { name: /Name/ });
    const aria = (name: string) =>
      within(nameHeader).getAllByRole('button', { hidden: true, name })[0];

    await userEvent.click(aria('Column Actions'));
    await userEvent.click(
      await within(document.body).findByRole('menuitem', {
        name: /^Sort ascending$/,
      }),
    );
    await waitFor(() =>
      expect(bodyNames(canvasElement)).toEqual(['Luna', 'Milo', 'Otis']),
    );
    await waitFor(() =>
      expect(document.querySelector('[role="menu"]')).toBeNull(),
    );

    await userEvent.click(aria('Column Actions'));
    await userEvent.click(
      await within(document.body).findByRole('menuitem', {
        name: /Clear sort/,
      }),
    );
    await waitFor(() =>
      expect(bodyNames(canvasElement)).toEqual(['Milo', 'Luna', 'Otis']),
    );
    // A closing menu keeps the rest of the page aria-hidden.
    await waitFor(() =>
      expect(document.querySelector('[role="menu"]')).toBeNull(),
    );
    // An owner render does not bring the cleared sort back.
    await userEvent.click(canvas.getByRole('button', { name: /Re-render/ }));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(bodyNames(canvasElement)).toEqual(['Milo', 'Luna', 'Otis']);
    expect(nameHeader).not.toHaveAttribute('aria-sort', 'ascending');
  },
};

type Employee = {
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  salary: number;
};

const employees: Employee[] = [
  {
    firstName: 'Allison',
    lastName: 'Brown',
    city: 'Omaha',
    state: 'Nebraska',
    salary: 10000,
  },
  {
    firstName: 'Harry',
    lastName: 'Smith',
    city: 'Hickman',
    state: 'Nebraska',
    salary: 20000,
  },
  {
    firstName: 'Sally',
    lastName: 'Williamson',
    city: 'Alliance',
    state: 'Nebraska',
    salary: 30000,
  },
  {
    firstName: 'Lebron',
    lastName: 'James',
    city: 'Indianapolis',
    state: 'Indiana',
    salary: 40000,
  },
  {
    firstName: 'Michael',
    lastName: 'McGinnis',
    city: 'Harrisonburg',
    state: 'Virginia',
    salary: 150000,
  },
  {
    firstName: 'Joseph',
    lastName: 'Williams',
    city: 'Valentine',
    state: 'Nebraska',
    salary: 100000,
  },
  {
    firstName: 'Noah',
    lastName: 'Brown',
    city: 'Toledo',
    state: 'Ohio',
    salary: 50000,
  },
  {
    firstName: 'Mason',
    lastName: 'Zhang',
    city: 'Sacramento',
    state: 'California',
    salary: 100000,
  },
  {
    firstName: 'Violet',
    lastName: 'Doe',
    city: 'San Francisco',
    state: 'California',
    salary: 100000,
  },
];

const employeeColumns: ST_ColumnDef<Employee>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    icon: UserIcon,
    sortDescFirst: false, //sort first name in ascending order on the first sort click
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'city',
    header: 'City',
    icon: Building2Icon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    icon: DollarSignIcon,
    sortDescFirst: true, //sort salary in descending order on the first sort click
  },
];

const bodyCities = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('tbody tr')].map(
    (row) => row.querySelectorAll('td')[2]?.textContent,
  );

/**
 * The table of the Sorting guide, sorted by State ascending and then by City
 * descending on load; clearing the State sort leaves the City sort.
 */
export const SortedOnLoad = {
  render: () => (
    <ShadcnTable
      columns={employeeColumns}
      data={employees}
      initialState={{
        sorting: [
          { desc: false, id: 'state' }, //sort by state in ascending order
          { desc: true, id: 'city' }, //then by city in descending order
        ],
      }}
      maxMultiSortColCount={3} //sort by 3 columns at most
      showSortIndex //show each sorted column's position next to its arrow
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Allison');
    const header = (name: RegExp) => canvas.getByRole('columnheader', { name });
    expect(header(/State/)).toHaveAttribute('aria-sort', 'ascending');
    expect(header(/City/)).toHaveAttribute('aria-sort', 'descending');
    expect(bodyCities(canvasElement)).toEqual([
      'San Francisco',
      'Sacramento',
      'Indianapolis',
      'Valentine',
      'Omaha',
      'Hickman',
      'Alliance',
      'Toledo',
      'Harrisonburg',
    ]);

    await userEvent.click(
      within(header(/State/)).getAllByRole('button', {
        hidden: true,
        name: 'Column Actions',
      })[0],
    );
    await userEvent.click(
      await within(document.body).findByRole('menuitem', {
        name: /Clear sort/,
      }),
    );
    await waitFor(() =>
      expect(bodyCities(canvasElement)).toEqual([
        'Valentine',
        'Toledo',
        'San Francisco',
        'Sacramento',
        'Omaha',
        'Indianapolis',
        'Hickman',
        'Harrisonburg',
        'Alliance',
      ]),
    );
    await waitFor(() =>
      expect(document.querySelector('[role="menu"]')).toBeNull(),
    );
    expect(header(/State/)).not.toHaveAttribute('aria-sort', 'ascending');
    expect(header(/City/)).toHaveAttribute('aria-sort', 'descending');
  },
};
