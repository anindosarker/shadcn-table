import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// The five menus share useST_MenuAnchor: each opens from an invisible span
// over its opener and, on Escape, hands focus back to that opener.

const meta: Meta = {
  title: 'Fixed Bugs/Menu Focus Return',
};

export default meta;

type Person = { firstName: string; lastName: string };

const data: Person[] = [
  { firstName: 'Mason', lastName: 'Lee' },
  { firstName: 'Lily', lastName: 'Park' },
  { firstName: 'Jackson', lastName: 'Diaz' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
];

const waitForRows = (canvasElement: HTMLElement) =>
  waitFor(() =>
    expect(canvasElement.querySelector('tbody')?.textContent).toContain(
      'Mason',
    ),
  );

/** Opens the menu from `opener`, closes it with Escape, expects focus back. */
const expectFocusReturn = async (
  opener: HTMLElement,
  open: (opener: HTMLElement) => Promise<void>,
) => {
  const body = within(document.body);
  await open(opener);
  await body.findByRole('menu');
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(opener));
};

const click = (opener: HTMLElement) => userEvent.click(opener);

export const ColumnActionMenu = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    const [opener] = within(canvasElement).getAllByRole('button', {
      name: 'Column Actions',
    });
    await expectFocusReturn(opener, click);
  },
};

export const RowActionMenu = {
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
    const [opener] = within(canvasElement).getAllByRole('button', {
      name: 'Row Actions',
    });
    await expectFocusReturn(opener, click);
  },
};

export const CellActionMenu = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableCellActions
      enableClickToCopy="context-menu"
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    const cell = canvasElement.querySelector('tbody td') as HTMLElement;
    await expectFocusReturn(cell, async (target) => {
      await userEvent.click(target);
      await userEvent.pointer({ keys: '[MouseRight]', target });
    });
  },
};

export const FilterOptionMenu = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    const [opener] = within(canvasElement).getAllByRole('button', {
      name: 'Change filter mode',
    });
    await expectFocusReturn(opener, click);
  },
};

export const ShowHideColumnsMenu = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    const opener = within(canvasElement).getByRole('button', {
      name: 'Show/Hide columns',
    });
    await expectFocusReturn(opener, click);
  },
};
