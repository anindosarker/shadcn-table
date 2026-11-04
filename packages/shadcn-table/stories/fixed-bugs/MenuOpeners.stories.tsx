import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { UserIcon } from 'lucide-react';

// Every chrome menu opens from the element the user presses (D25): the opener
// announces its menu and its open state, a second press on it closes the
// menu, and Escape hands focus back to it.

const meta: Meta = {
  title: 'Fixed Bugs/Menu Openers',
};

export default meta;

type Person = { firstName: string; lastName: string };

const data: Person[] = [
  { firstName: 'Mason', lastName: 'Lee' },
  { firstName: 'Lily', lastName: 'Park' },
  { firstName: 'Jackson', lastName: 'Diaz' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name', icon: UserIcon },
  { accessorKey: 'lastName', header: 'Last Name', icon: UserIcon },
];

const body = within(document.body);

const expectOpener = async (getOpener: () => HTMLElement) => {
  const opener = getOpener();
  // `true` means `menu` in ARIA; React Aria's MenuTrigger writes `true`.
  expect(['menu', 'true']).toContain(opener.getAttribute('aria-haspopup'));
  expect(opener).toHaveAttribute('aria-expanded', 'false');

  // Open, then a second press on the same opener closes the menu. A modal
  // Radix menu sets `pointer-events: none` outside it, so the second press
  // skips that check, as a real press at the opener's position lands anyway.
  await userEvent.click(opener);
  await body.findByRole('menu');
  await waitFor(() =>
    expect(getOpener()).toHaveAttribute('aria-expanded', 'true'),
  );
  await userEvent.setup({ pointerEventsCheck: 0 }).click(getOpener());
  await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  await waitFor(() =>
    expect(getOpener()).toHaveAttribute('aria-expanded', 'false'),
  );

  // The press that closed the menu does not leave the next click swallowed;
  // Escape closes the menu and focus returns to the opener.
  await userEvent.click(getOpener());
  await body.findByRole('menu');
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(getOpener()));
};

const waitForRows = (canvasElement: HTMLElement) =>
  within(canvasElement).findByText('Mason');

export const ColumnActions = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    const getOpener = () =>
      within(canvasElement).getAllByRole('button', {
        hidden: true,
        name: 'Column Actions',
      })[0];
    await expectOpener(getOpener);

    // In chips mode "Filter" opens the column's chip editor with its input
    // focused.
    await userEvent.click(getOpener());
    await userEvent.click(
      await body.findByRole('menuitem', { name: /^Filter$/ }),
    );
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
    const filterInput = await body.findByRole('textbox', {
      name: 'Filter by First Name',
    });
    await waitFor(() => expect(document.activeElement).toBe(filterInput));
  },
};

export const RowActions = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowActions
      renderRowActionMenuItems={({ closeMenu }) => [
        <DropdownMenuItem key="view" onClick={() => closeMenu()}>
          View
        </DropdownMenuItem>,
      ]}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    await expectOpener(
      () =>
        within(canvasElement).getAllByRole('button', {
          hidden: true,
          name: 'Row Actions',
        })[0],
    );
  },
};

export const ShowHideColumns = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    await expectOpener(() =>
      within(canvasElement).getByRole('button', {
        hidden: true,
        name: 'Show/Hide columns',
      }),
    );
  },
};

export const FilterMode = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="subheader"
      columns={columns}
      data={data}
      enableColumnFilterModes
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    await expectOpener(
      () =>
        within(canvasElement).getAllByRole('button', {
          hidden: true,
          name: 'Change filter mode',
        })[0],
    );
  },
};
