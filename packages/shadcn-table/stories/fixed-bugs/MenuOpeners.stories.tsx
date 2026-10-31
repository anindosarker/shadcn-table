import { useState } from 'react';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Every menu opener announces its menu and its open state, a second click on
// it closes the menu, Tab skips the invisible anchor span, the menu follows
// its opener after a resize, and Escape hands focus back to the opener.

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
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
];

const body = within(document.body);

/** The invisible span the open menu is anchored to. */
const anchorSpanLeft = () => {
  const span = [...document.querySelectorAll<HTMLElement>('span[inert]')].find(
    (element) => element.style.position === 'fixed' && element.offsetWidth > 0,
  );
  return span?.getBoundingClientRect().left;
};

/** The wrapper's start margin moves the table, so a resize must move the menu. */
const ShiftableTable = ({ children }: { children: React.ReactNode }) => {
  const [shift, setShift] = useState(0);
  return (
    <div style={{ marginInlineStart: shift }}>
      <button
        data-testid="shift"
        onClick={() => setShift((value) => value + 120)}
        type="button"
      >
        Shift
      </button>
      {children}
    </div>
  );
};

const expectOpener = async (
  canvasElement: HTMLElement,
  getOpener: () => HTMLElement,
) => {
  const opener = getOpener();
  expect(opener).toHaveAttribute('aria-haspopup', 'menu');
  expect(opener).toHaveAttribute('aria-expanded', 'false');

  // Open, then a second click on the same opener closes the menu. A modal
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
  // The press that closed the menu does not leave the next click swallowed.
  await userEvent.click(getOpener());
  await body.findByRole('menu');

  // The anchor span follows its opener when the layout moves and the window
  // resizes, so the menu does too.
  within(canvasElement)
    .getByTestId('shift')
    .dispatchEvent(new MouseEvent('click', { bubbles: true }));
  window.dispatchEvent(new Event('resize'));
  await waitFor(() =>
    expect(anchorSpanLeft()).toBeCloseTo(
      getOpener().getBoundingClientRect().left,
      0,
    ),
  );

  // Escape closes the menu and focus returns to the opener.
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(getOpener()));

  // Tab from the opener never lands on an anchor span.
  for (let index = 0; index < 4; index++) {
    await userEvent.tab();
    expect(document.activeElement?.closest('[inert]') ?? null).toBeNull();
  }
};

const waitForRows = (canvasElement: HTMLElement) =>
  within(canvasElement).findByText('Mason');

export const ColumnActions = {
  render: () => (
    <ShiftableTable>
      <ShadcnTable columns={columns} data={data} />
    </ShiftableTable>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    await expectOpener(
      canvasElement,
      () =>
        within(canvasElement).getAllByRole('button', {
          hidden: true,
          name: 'Column Actions',
        })[0],
    );
  },
};

export const RowActions = {
  render: () => (
    <ShiftableTable>
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
    </ShiftableTable>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    await expectOpener(
      canvasElement,
      () =>
        within(canvasElement).getAllByRole('button', {
          hidden: true,
          name: 'Row Actions',
        })[0],
    );
  },
};

export const ShowHideColumns = {
  render: () => (
    <ShiftableTable>
      <ShadcnTable columns={columns} data={data} />
    </ShiftableTable>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    await expectOpener(canvasElement, () =>
      within(canvasElement).getByRole('button', {
        hidden: true,
        name: 'Show/Hide columns',
      }),
    );
  },
};

export const FilterMode = {
  render: () => (
    <ShiftableTable>
      <ShadcnTable
        columns={columns}
        data={data}
        enableColumnFilterModes
        initialState={{ showColumnFilters: true }}
      />
    </ShiftableTable>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitForRows(canvasElement);
    await expectOpener(
      canvasElement,
      () =>
        within(canvasElement).getAllByRole('button', {
          hidden: true,
          name: 'Change filter mode',
        })[0],
    );
  },
};
