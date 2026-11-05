import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import {
  type ST_ColumnDef,
  useShadcnTable,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { CakeIcon, HashIcon, MailIcon, MapIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Fixed Bugs/dragging virtual when filtered',
};

export default meta;

const initData = [...Array(25)].map(() => ({
  age: faker.number.int(20) + 18,
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  id: faker.string.alphanumeric(6),
  lastName: faker.person.lastName(),
}));
initData.push({
  age: 18,
  email: 'info@example.com',
  firstName: 'Foobar',
  lastName: 'Baz',
  id: '1',
});

const columns: ST_ColumnDef<(typeof initData)[0]>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    icon: HashIcon,
  },
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
    accessorKey: 'email',
    header: 'Email Address',
    icon: MailIcon,
  },
  {
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
];

export const DraggingRowWhenFiltered = () => {
  const [data] = useState(() => initData);
  const table = useShadcnTable({
    enableRowVirtualization: true,
    enableRowNumbers: true,
    columns: columns,
    data: data,
    enableRowDragging: true,
    columnFilterDisplayMode: 'subheader',
    initialState: {
      density: 'compact',
      columnFilters: [{ id: 'firstName', value: 'foo' }],
      showColumnFilters: true,
    },
  });
  return <ShadcnTable table={table} />;
};

// Filtered under row virtualization, the one matching row renders and its
// grip drags that row, not the first row of the unfiltered data.
DraggingRowWhenFiltered.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(1),
  );
  const rows = canvasElement.querySelectorAll<HTMLElement>('tbody tr');
  expect(rows[0]).toHaveTextContent('Foobar');
  const grip = within(rows[0]!).getByRole('button', { name: 'Move' });
  const dataTransfer = new DataTransfer();
  fireEvent.dragStart(grip, { dataTransfer });
  try {
    // The dragged row, Foobar, takes the dashed drag outline.
    await waitFor(() =>
      expect(
        rows[0]!.querySelector<HTMLElement>('td[data-flip-column="firstName"]')!
          .style.borderTop,
      ).toMatch(/dashed/),
    );
    expect(rows[0]).toHaveTextContent('Foobar');
  } finally {
    fireEvent.dragEnd(grip, { dataTransfer });
  }
};
