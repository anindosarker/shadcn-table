import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { UserIcon } from 'lucide-react';

// Each menu, on Escape, hands focus back to its opener: the column menu
// chevron, the row actions button, the cell, the filter mode button and the
// columns button.

const meta: Meta = {
  title: 'Miscellaneous/Menu Focus Return',
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

/**
 * Mounts the story again (.storybook/preview.tsx), so each step of a play
 * that holds merged checks (D106) starts from the story's first render.
 */
const remountStory = () => {
  const remount = (globalThis as { __stRemountStory?: () => Promise<void> })
    .__stRemountStory;
  if (!remount) throw new Error('__stRemountStory is not set (preview.tsx)');
  return remount();
};

const columnActionMenuPlay = async ({ canvasElement }: StoryContext) => {
  await waitForRows(canvasElement);
  const [opener] = within(canvasElement).getAllByRole('button', {
    name: 'Column Actions',
  });
  await expectFocusReturn(opener, click);
};

const showHideColumnsMenuPlay = async ({ canvasElement }: StoryContext) => {
  await waitForRows(canvasElement);
  const opener = within(canvasElement).getByRole('button', {
    name: 'Show/Hide columns',
  });
  await expectFocusReturn(opener, click);
};

export const ColumnActionMenu = {
  render: () => <ShadcnTable columns={columns} data={data} />,
  play: async (context: StoryContext) => {
    await context.step('Column Action Menu', () =>
      columnActionMenuPlay(context),
    );
    await remountStory();
    await context.step('Show Hide Columns Menu', () =>
      showHideColumnsMenuPlay(context),
    );
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
      columnFilterDisplayMode="subheader"
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
