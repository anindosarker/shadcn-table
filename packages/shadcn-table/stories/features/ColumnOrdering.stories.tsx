import { useState } from 'react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import {
  type ST_ColumnDef,
  type ST_ColumnOrderState,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import {
  Building2Icon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Column Ordering',
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
    accessorKey: 'email',
    header: 'Email Address',
    icon: MailIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
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
    accessorKey: 'phone',
    header: 'Phone',
    icon: PhoneIcon,
    enablePinning: false,
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
  phone: faker.phone.number(),
}));

export const ColumnOrderingEnabled = () => (
  <ShadcnTable columns={columns} data={data} />
);

// Ordering is on by default; `false` makes the headers static.
export const ColumnOrderingDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableColumnOrdering={false} />
);

export const DisplayColumnOrderingEnabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    defaultDisplayColumn={{ enableColumnOrdering: true }}
    enableRowActions
    enableRowDragging
    enableRowNumbers
    enableRowSelection
    positionActionsColumn="last"
  />
);

export const ColumnOrderingDisabledPerColumn = () => (
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
        accessorKey: 'email',
        header: 'Email Address',
        icon: MailIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        enableColumnOrdering: false,
        header: 'State',
        icon: MapIcon,
      },
    ]}
    data={data}
  />
);

export const ColumnOrderingWithSelect = () => (
  <ShadcnTable columns={columns} data={data} enableRowSelection />
);

export const ColumnOrderingNoDragHandles = () => (
  <ShadcnTable columns={columns} data={data} enableColumnDragging={false} />
);

export const ColumnOrderingStateManaged = () => {
  const [columnOrder, setColumnOrder] = useState<ST_ColumnOrderState>(() =>
    columns.map((c) => c.accessorKey as string),
  );
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      defaultDisplayColumn={{ enableColumnOrdering: true, enableHiding: true }}
      enableRowSelection
      onColumnOrderChange={setColumnOrder}
      state={{ columnOrder }}
    />
  );
};

export const ColumnOrderingStateManagedCustom = () => {
  const [columnOrder, setColumnOrder] = useState<ST_ColumnOrderState>(() => [
    ...columns.map((c) => c.accessorKey as string),
    'st-row-select',
  ]);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      defaultDisplayColumn={{ enableColumnOrdering: true, enableHiding: true }}
      enableRowSelection
      onColumnOrderChange={setColumnOrder}
      state={{ columnOrder }}
    />
  );
};

export const ColumnOrderingEnabledWithColumnVirtualization = () => (
  <ShadcnTable
    columnVirtualizerOptions={{
      overscan: 0,
    }}
    columns={columns}
    data={data}
    enableColumnVirtualization
  />
);

const headerIds = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('thead th[data-flip-column]')].map((th) =>
    th.getAttribute('data-flip-column'),
  );

const firstRowIds = (canvasElement: HTMLElement) =>
  [
    ...canvasElement.querySelectorAll(
      'tbody tr:first-child td[data-flip-column]',
    ),
  ].map((td) => td.getAttribute('data-flip-column'));

/** Opens the Show/Hide columns menu and returns it. */
const openColumnsMenu = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    within(canvasElement).getByRole('button', { name: 'Show/Hide columns' }),
  );
  return within(document.body).findByRole('menu');
};

const menuItem = (menu: HTMLElement, name: string) =>
  within(menu).getByRole('menuitemcheckbox', { name });

/** Drags the menu row of `source` by its Move grip onto the row of `target`. */
const menuDrag = (menu: HTMLElement, source: string, target: string) => {
  const handle = within(
    menuItem(menu, source).parentElement as HTMLElement,
  ).getByRole('button', { name: 'Move' });
  fireEvent.dragStart(handle);
  fireEvent.dragEnter(menuItem(menu, target));
  fireEvent.dragOver(menuItem(menu, target));
  fireEvent.dragEnd(handle);
};

/**
 * Dragging a row of the columns menu moves the column: the header order
 * changes and the body cells follow.
 */
export const MenuReorderMovesColumn = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByRole('columnheader', {
      name: /First Name/,
    });
    expect(headerIds(canvasElement).slice(0, 4)).toEqual([
      'firstName',
      'lastName',
      'email',
      'address',
    ]);
    const menu = await openColumnsMenu(canvasElement);
    menuDrag(menu, 'Address', 'First Name');
    await waitFor(() =>
      expect(headerIds(canvasElement).slice(0, 4)).toEqual([
        'address',
        'firstName',
        'lastName',
        'email',
      ]),
    );
    expect(firstRowIds(canvasElement)).toEqual(headerIds(canvasElement));
  },
};

/**
 * A column with `enableColumnOrdering: false` has no grip in the columns
 * menu, takes no drop, and keeps its index while other columns move.
 */
ColumnOrderingDisabledPerColumn.play = async ({
  canvasElement,
}: StoryContext) => {
  await within(canvasElement).findByRole('columnheader', {
    name: /First Name/,
  });
  expect(headerIds(canvasElement).indexOf('state')).toBe(5);
  const menu = await openColumnsMenu(canvasElement);
  expect(
    within(menuItem(menu, 'State').parentElement as HTMLElement).queryByRole(
      'button',
      { name: 'Move' },
    ),
  ).toBeNull();
  // A drop on the locked row is refused.
  menuDrag(menu, 'First Name', 'State');
  await new Promise((resolve) => setTimeout(resolve, 100));
  expect(headerIds(canvasElement)[0]).toBe('firstName');
  // Moving another column past it leaves it where it was.
  menuDrag(menu, 'First Name', 'City');
  await waitFor(() => expect(headerIds(canvasElement)[0]).toBe('lastName'));
  expect(headerIds(canvasElement).indexOf('state')).toBe(5);
  expect(firstRowIds(canvasElement)).toEqual(headerIds(canvasElement));
};

// The docs example "Column DnD Ordering" (examples/base/enable-column-ordering):
// its columns, options and rows.
interface DndOrderingPerson {
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  state: string;
}

const dndOrderingData: DndOrderingPerson[] = [
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

const dndOrderingColumns: ST_ColumnDef<DndOrderingPerson>[] = [
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'Last Name',
  },
  {
    accessorKey: 'address',
    icon: MapPinIcon,
    header: 'Address',
  },
  {
    accessorKey: 'city',
    icon: Building2Icon,
    header: 'City',
  },
  {
    accessorKey: 'state',
    icon: MapIcon,
    enableColumnOrdering: false,
    header: 'State',
  },
];

/** The header ids without the display columns. */
const dataHeaderIds = (canvasElement: HTMLElement) =>
  headerIds(canvasElement).filter((id) => !id?.startsWith('st-'));

const ColumnDndOrderingTable = () => {
  const table = useShadcnTable({
    columns: dndOrderingColumns,
    data: dndOrderingData,
    enableColumnOrdering: true,
  });
  return <ShadcnTable table={table} />;
};

/**
 * City moves to the front from the columns menu; State, locked, has no grip
 * and keeps its place.
 */
export const ColumnDndOrdering = {
  name: 'Column DnD Ordering',
  render: () => <ColumnDndOrderingTable />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByRole('columnheader', {
      name: /First Name/,
    });
    expect(dataHeaderIds(canvasElement)).toEqual([
      'firstName',
      'lastName',
      'address',
      'city',
      'state',
    ]);
    const menu = await openColumnsMenu(canvasElement);
    expect(
      within(menuItem(menu, 'State').parentElement as HTMLElement).queryByRole(
        'button',
        { name: 'Move' },
      ),
    ).toBeNull();
    menuDrag(menu, 'City', 'First Name');
    await waitFor(() =>
      expect(dataHeaderIds(canvasElement)).toEqual([
        'city',
        'firstName',
        'lastName',
        'address',
        'state',
      ]),
    );
    expect(firstRowIds(canvasElement)).toEqual(headerIds(canvasElement));
  },
};
