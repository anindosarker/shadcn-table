import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Column Dragging Examples',
};

export default meta;

type Person = {
  address: string;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  state: string;
};

const columns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'email',
    header: 'Email Address',
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

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

const headerNames = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll('thead th')).map((th) =>
    (th.textContent ?? '').trim(),
  );

export const ColumnDraggingEnabled = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnDragging
      enableColumnOrdering
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const headers = await canvas.findAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('First Name');
    expect(headers[2]).toHaveTextContent('Email Address');
    const handle = within(headers[0]).getAllByRole('button', {
      hidden: true,
      name: 'Move',
    })[0];
    fireEvent.dragStart(handle);
    fireEvent.dragEnter(headers[2]);
    fireEvent.dragOver(headers[2]);
    fireEvent.drop(headers[2]);
    fireEvent.dragEnd(handle);
    await waitFor(() =>
      expect(headerNames(canvasElement)).toEqual([
        'Last Name',
        'Email Address',
        'First Name',
        'Address',
        'City',
        'State',
      ]),
    );
  },
};

export const ColumnDraggingDisabledPerColumn = () => (
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
        accessorKey: 'email',
        header: 'Email Address',
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
        enableColumnDragging: false,
        header: 'State',
      },
    ]}
    data={data}
    enableColumnDragging
  />
);
