import { useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_SortingState,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Sorting Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
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
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
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
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'address',
        enableSorting: false,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        enableSorting: false,
        header: 'Phone Number',
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
        sortFn: 'fuzzy',
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
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
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
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'age', header: 'Age' },
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
        name: /Sort by Name ascending/,
      }),
    );
    await waitFor(() =>
      expect(bodyNames(canvasElement)).toEqual(['Luna', 'Milo', 'Otis']),
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
    // An owner render does not bring the cleared sort back.
    await userEvent.click(canvas.getByRole('button', { name: /Re-render/ }));
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(bodyNames(canvasElement)).toEqual(['Milo', 'Luna', 'Otis']);
    expect(nameHeader).not.toHaveAttribute('aria-sort', 'ascending');
  },
};
