import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import {
  Building2Icon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Column Pinning Examples',
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

/** Unpin puts a pinned column back in its place, no longer sticky. */
export const UnpinRestores = {
  render: () => <ColumnPinningInitial />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByRole('columnheader', {
      name: /Email Address/,
    });
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
  },
};

/**
 * The inner-edge pinned cells cast the edge shadow (D22); unpinned cells do
 * not.
 */
export const PinnedEdgeShadow = {
  render: () => <ColumnPinningInitial />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByRole('columnheader', {
      name: /Email Address/,
    });
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
  },
};
