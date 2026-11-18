import { useMemo } from 'react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  type ST_ColumnDef,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { faker } from '@faker-js/faker';
import {
  Building2Icon,
  GlobeIcon,
  HashIcon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Column Pinning',
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
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const ColumnPinningEnabled = () => (
  <ShadcnTable columns={columns} data={data} />
);

// Pinning is on by default; `false` drops the pin items from the column menu.
export const ColumnPinningDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableColumnPinning={false} />
);

export const ColumnPinningInitial = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ columnPinning: { start: ['email'], end: ['state'] } }}
  />
);

export const ColumnPinningDisabledPerColumn = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        enablePinning: false,
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
    ]}
    data={data}
  />
);

export const ColumnPinningWithSelect = () => (
  <ShadcnTable columns={columns} data={data} enableRowSelection />
);

export const ColumnPinningWithDetailPanel = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    renderDetailPanel={() => <h1>Hi</h1>}
  />
);

const header = (canvasElement: HTMLElement, id: string) =>
  canvasElement.querySelector<HTMLElement>(
    `thead th[data-flip-column="${id}"]`,
  )!;

const bodyCell = (canvasElement: HTMLElement, id: string) =>
  canvasElement.querySelector<HTMLElement>(
    `tbody tr:first-child td[data-flip-column="${id}"]`,
  )!;

const headerIds = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('thead th[data-flip-column]')].map((th) =>
    th.getAttribute('data-flip-column'),
  );

/** Chooses `item` from the column menu of column `id`. */
const columnMenuAction = async (
  canvasElement: HTMLElement,
  id: string,
  item: string,
) => {
  await userEvent.click(
    within(header(canvasElement, id)).getByRole('button', {
      name: 'Column Actions',
    }),
  );
  const menu = await within(document.body).findByRole('menu');
  await userEvent.click(within(menu).getByRole('menuitem', { name: item }));
  await waitFor(() =>
    expect(document.querySelector('[role="menu"]')).toBeNull(),
  );
};

/**
 * Pin to start moves the column first and makes its header and body cells
 * sticky at offset 0.
 */
export const PinStartSticks = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByRole('columnheader', {
      name: /Email Address/,
    });
    expect(getComputedStyle(header(canvasElement, 'email')).position).not.toBe(
      'sticky',
    );
    await columnMenuAction(canvasElement, 'email', 'Pin to start');
    await waitFor(() => expect(headerIds(canvasElement)[0]).toBe('email'));
    for (const cell of [
      header(canvasElement, 'email'),
      bodyCell(canvasElement, 'email'),
    ]) {
      const style = getComputedStyle(cell);
      expect(style.position).toBe('sticky');
      expect(style.left).toBe('0px');
    }
  },
};

/**
 * The inner-edge pinned cells cast the edge shadow (D22); unpinned cells do
 * not. Unpin then puts a pinned column back in its place, no longer sticky.
 */
ColumnPinningInitial.play = async ({ canvasElement, step }: StoryContext) => {
  await within(canvasElement).findByRole('columnheader', {
    name: /Email Address/,
  });
  await step('Pinned Edge Shadow', () => {
    for (const id of ['email', 'state']) {
      expect(header(canvasElement, id)).toHaveClass('drop-shadow-sm');
      expect(bodyCell(canvasElement, id)).toHaveClass('drop-shadow-sm');
      expect(getComputedStyle(bodyCell(canvasElement, id)).filter).toMatch(
        /drop-shadow/,
      );
    }
    for (const id of ['firstName', 'city']) {
      expect(header(canvasElement, id)).not.toHaveClass('drop-shadow-sm');
      expect(bodyCell(canvasElement, id)).not.toHaveClass('drop-shadow-sm');
    }
  });
  await step('Unpin Restores', async () => {
    expect(headerIds(canvasElement)[0]).toBe('email');
    expect(getComputedStyle(header(canvasElement, 'email')).position).toBe(
      'sticky',
    );
    await columnMenuAction(canvasElement, 'email', 'Unpin');
    await waitFor(() =>
      expect(headerIds(canvasElement).indexOf('email')).toBe(2),
    );
    expect(getComputedStyle(header(canvasElement, 'email')).position).not.toBe(
      'sticky',
    );
    expect(
      getComputedStyle(bodyCell(canvasElement, 'email')).position,
    ).not.toBe('sticky');
  });
};

// The docs example "Column Pinning" (examples/base/enable-column-pinning): its
// columns, options and rows.
interface PinningPerson {
  address: string;
  city: string;
  country: string;
  firstName: string;
  id: string;
  lastName: string;
  middleName: string;
  state: string;
}

const pinningData: PinningPerson[] = [
  {
    id: '1',
    firstName: 'Dylan',
    middleName: 'Sprouse',
    lastName: 'Murray',
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
    country: 'United States',
  },
  {
    id: '2',
    firstName: 'Raquel',
    middleName: 'Hakeem',
    lastName: 'Kohler',
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
    country: 'United States',
  },
  {
    id: '3',
    firstName: 'Ervin',
    middleName: 'Kris',
    lastName: 'Reinger',
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
    country: 'United States',
  },
  {
    id: '4',
    firstName: 'Brittany',
    middleName: 'Kathryn',
    lastName: 'McCullough',
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
    country: 'United States',
  },
  {
    id: '5',
    firstName: 'Branson',
    middleName: 'John',
    lastName: 'Frami',
    address: '32188 Larkin Turnpike',
    city: 'Charleston',
    state: 'South Carolina',
    country: 'United States',
  },
  {
    id: '6',
    firstName: 'Brandon',
    middleName: 'Joe',
    lastName: 'Kutch',
    address: '5660 Kuhn Village',
    city: 'Vancouver',
    state: 'British Columbia',
    country: 'Canada',
  },
];

const ColumnPinningTable = () => {
  const columns = useMemo<ST_ColumnDef<PinningPerson>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        enablePinning: false, //disable column pinning for this column
        header: 'ID',
        size: 110,
      },
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        icon: UserIcon,
        header: 'Middle Name',
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
        size: 300,
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
      {
        accessorKey: 'country',
        icon: GlobeIcon,
        header: 'Country',
      },
    ],
    [],
  );
  const table = useShadcnTable({
    columns,
    data: pinningData,
    enableColumnPinning: true,
    enableRowActions: true,
    layoutMode: 'grid-no-grow',
    renderRowActionMenuItems: () => [
      <DropdownMenuItem key="action">Action</DropdownMenuItem>,
    ],
    initialState: {
      columnPinning: { start: ['st-row-actions', 'state'], end: ['city'] },
    },
  });
  return <ShadcnTable table={table} />;
};

/**
 * State starts pinned to the start and City to the end; Pin to start on
 * First Name puts it beside State. The ID column menu has no pin items.
 */
export const ColumnPinning = {
  render: () => <ColumnPinningTable />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByRole('columnheader', {
      name: /First Name/,
    });
    const ids = headerIds(canvasElement);
    expect(ids.slice(0, 2)).toEqual(['st-row-actions', 'state']);
    expect(ids.filter((id) => !id?.startsWith('st-')).at(-1)).toBe('city');
    for (const id of ['state', 'city']) {
      expect(getComputedStyle(header(canvasElement, id)).position).toBe(
        'sticky',
      );
    }
    await columnMenuAction(canvasElement, 'firstName', 'Pin to start');
    await waitFor(() =>
      expect(headerIds(canvasElement).slice(0, 3)).toEqual([
        'st-row-actions',
        'state',
        'firstName',
      ]),
    );
    await userEvent.click(
      within(header(canvasElement, 'id')).getByRole('button', {
        name: 'Column Actions',
      }),
    );
    const menu = await within(document.body).findByRole('menu');
    expect(within(menu).getAllByRole('menuitem').length).toBeGreaterThan(0);
    expect(
      within(menu).queryAllByRole('menuitem', { name: /^(Pin to|Unpin)/ }),
    ).toHaveLength(0);
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(document.querySelector('[role="menu"]')).toBeNull(),
    );
  },
};
