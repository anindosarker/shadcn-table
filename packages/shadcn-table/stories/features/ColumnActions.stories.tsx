import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { faker } from '@faker-js/faker';
import { MapIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Features/Column Action Examples',
};

export default meta;

interface Row {
  address: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
}

const columns: ST_ColumnDef<Row>[] = [
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

const data: Row[] = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const ColumnActionsEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} />
);

export const ColumnActionsDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableColumnActions={false} />
);

export const ColumnActionsDisabledPerColumn = () => (
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
        enableColumnActions: false,
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        enableColumnActions: false,
        header: 'State',
        icon: MapIcon,
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: false,
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
  />
);

export const ColumnActionsEnabledPerColumn = () => (
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
        enableColumnActions: true,
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        enableColumnActions: true,
        header: 'State',
        icon: MapIcon,
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: true,
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
    enableColumnActions={false}
  />
);

export const CustomColumnActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    renderColumnActionsMenuItems={() => [
      <DropdownMenuItem key={1}>Item 1</DropdownMenuItem>,
      <DropdownMenuItem key={2}>Item 2</DropdownMenuItem>,
    ]}
  />
);

export const CustomColumnActionsPerColumn = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        renderColumnActionsMenuItems: () => [
          <DropdownMenuItem key={1}>Item 1</DropdownMenuItem>,
          <DropdownMenuItem key={2}>Item 2</DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        renderColumnActionsMenuItems: () => [
          <DropdownMenuItem key={1}>Item 2</DropdownMenuItem>,
          <DropdownMenuItem key={3}>Item 3</DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'address',
        enableColumnActions: true,
        header: 'Address',
        icon: MapPinIcon,
        renderColumnActionsMenuItems: ({ internalColumnMenuItems }) => [
          ...internalColumnMenuItems,
          <DropdownMenuSeparator key={3332} />,
          <DropdownMenuItem key={3333}>Item 1</DropdownMenuItem>,
          <DropdownMenuItem key={3334}>Item 2</DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'state',
        enableColumnActions: true,
        header: 'State',
        icon: MapIcon,
      },
      {
        accessorKey: 'phoneNumber',
        enableColumnActions: true,
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
  />
);

const body = within(document.body);

const menuColumns: ST_ColumnDef<Row>[] = [
  { accessorKey: 'firstName', header: 'First Name', icon: UserIcon },
  { accessorKey: 'lastName', header: 'Last Name', icon: UserIcon },
  { accessorKey: 'address', header: 'Address', icon: MapPinIcon },
  {
    icon: MapIcon,
    accessorKey: 'state',
    enableColumnOrdering: false,
    header: 'State',
  },
  { accessorKey: 'phoneNumber', header: 'Phone Number', icon: PhoneIcon },
];

const menuData: Row[] = [
  {
    address: '1 Elm St',
    firstName: 'Mason',
    lastName: 'Lee',
    phoneNumber: '555-0101',
    state: 'Ohio',
  },
  {
    address: '2 Oak St',
    firstName: 'Lily',
    lastName: 'Park',
    phoneNumber: '555-0102',
    state: 'Utah',
  },
];

const headerCell = (canvasElement: HTMLElement, name: string) =>
  [...canvasElement.querySelectorAll<HTMLElement>('thead th')].find((th) =>
    (th.textContent ?? '').trim().startsWith(name),
  ) as HTMLElement;

/** No menu in the DOM, a closing one included (it keeps the page aria-hidden). */
const waitForNoMenu = () =>
  waitFor(() => expect(document.querySelector('[role="menu"]')).toBeNull());

/** Opens the column's menu from its chevron and returns the item texts. */
const openMenu = async (canvasElement: HTMLElement, name: string) => {
  await waitForNoMenu();
  await userEvent.click(
    within(headerCell(canvasElement, name)).getByRole('button', {
      name: 'Column Actions',
    }),
  );
  const menu = await body.findByRole('menu');
  return within(menu)
    .getAllByRole('menuitem')
    .map((item) => (item.textContent ?? '').trim());
};

const menuItem = (name: string) =>
  body.getByRole('menuitem', { name: new RegExp(`^${name}$`) });

const closeMenu = async () => {
  await userEvent.keyboard('{Escape}');
  await waitForNoMenu();
};

/**
 * The column menu lists only what applies, in order: four column states,
 * the disabled active direction, the disabled Fixed position, and the reset
 * size item only once the column was resized.
 */
export const MenuItemsFollowTheColumnState = {
  render: () => (
    <ShadcnTable
      columns={menuColumns}
      data={menuData}
      enableColumnOrdering
      enableColumnPinning
      enableColumnResizing
      initialState={{
        columnFilters: [{ id: 'lastName', value: 'e' }],
        columnPinning: { end: [], start: ['address'] },
        sorting: [{ desc: false, id: 'lastName' }],
      }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText('Mason');

    // Unsorted, unfiltered, unpinned.
    expect(await openMenu(canvasElement, 'First Name')).toEqual([
      'Sort ascending',
      'Sort descending',
      'Filter',
      'Pin to start',
      'Pin to end',
      'Hide',
    ]);
    await closeMenu();

    // Sorted and filtered: the active direction is the one disabled item.
    expect(await openMenu(canvasElement, 'Last Name')).toEqual([
      'Sort ascending',
      'Sort descending',
      'Clear sort',
      'Filter',
      'Clear filter',
      'Pin to start',
      'Pin to end',
      'Hide',
    ]);
    expect(menuItem('Sort ascending')).toHaveAttribute('aria-disabled', 'true');
    expect(menuItem('Sort descending')).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await closeMenu();

    // Pinned to the start.
    expect(await openMenu(canvasElement, 'Address')).toEqual([
      'Sort ascending',
      'Sort descending',
      'Filter',
      'Pin to end',
      'Unpin',
      'Hide',
    ]);
    await closeMenu();

    // Locked: Fixed position, disabled.
    expect(await openMenu(canvasElement, 'State')).toEqual([
      'Sort ascending',
      'Sort descending',
      'Filter',
      'Pin to start',
      'Pin to end',
      'Fixed position',
      'Hide',
    ]);
    expect(menuItem('Fixed position')).toHaveAttribute('aria-disabled', 'true');
    await closeMenu();
  },
};

/** Sorting from the menu stacks onto another column's sort. */
export const MenuSortStacks = {
  render: () => <ShadcnTable columns={menuColumns} data={menuData} />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText('Mason');
    await openMenu(canvasElement, 'First Name');
    await userEvent.click(menuItem('Sort ascending'));
    await waitForNoMenu();
    await openMenu(canvasElement, 'Last Name');
    await userEvent.click(menuItem('Sort descending'));
    await waitFor(() =>
      expect(headerCell(canvasElement, 'Last Name')).toHaveAttribute(
        'aria-sort',
        'descending',
      ),
    );
    expect(headerCell(canvasElement, 'First Name')).toHaveAttribute(
      'aria-sort',
      'ascending',
    );
    // The same column replaces its own direction.
    await openMenu(canvasElement, 'First Name');
    await userEvent.click(menuItem('Sort descending'));
    await waitFor(() =>
      expect(headerCell(canvasElement, 'First Name')).toHaveAttribute(
        'aria-sort',
        'descending',
      ),
    );
    expect(headerCell(canvasElement, 'Last Name')).toHaveAttribute(
      'aria-sort',
      'descending',
    );
  },
};

/** Reset column size shows only while the width differs from its default. */
export const MenuResetSizeAfterResize = {
  render: () => (
    <ShadcnTable
      columns={menuColumns}
      data={menuData}
      enableColumnResizing
      initialState={{ columnSizing: { phoneNumber: 320 } }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText('Mason');
    expect(await openMenu(canvasElement, 'First Name')).not.toContain(
      'Reset column size',
    );
    await closeMenu();
    expect(await openMenu(canvasElement, 'Phone Number')).toContain(
      'Reset column size',
    );
    await userEvent.click(menuItem('Reset column size'));
    await waitForNoMenu();
    expect(await openMenu(canvasElement, 'Phone Number')).not.toContain(
      'Reset column size',
    );
    await closeMenu();
  },
};

/**
 * The label opens the same menu as the chevron and never sorts; a second
 * click on the chevron closes the menu.
 */
export const LabelOpensMenu = {
  render: () => <ShadcnTable columns={menuColumns} data={menuData} />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText('Mason');
    const cell = headerCell(canvasElement, 'First Name');
    await userEvent.click(
      within(cell).getByRole('button', { name: 'First Name column menu' }),
    );
    await body.findByRole('menu');
    expect(cell).toHaveAttribute('aria-sort', 'none');
    await closeMenu();

    const chevron = within(cell).getByRole('button', {
      name: 'Column Actions',
    });
    await userEvent.click(chevron);
    await body.findByRole('menu');
    // A modal menu sets pointer-events: none outside it.
    await userEvent.setup({ pointerEventsCheck: 0 }).click(chevron);
    await waitForNoMenu();
    expect(cell).toHaveAttribute('aria-sort', 'none');
  },
};
