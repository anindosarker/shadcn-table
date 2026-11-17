import { useState } from 'react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import {
  expect,
  fireEvent,
  spyOn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test';
import {
  type ST_ColumnDef,
  type ST_ColumnOrderState,
  ShadcnTable,
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
  title: 'Features/Column Ordering Examples',
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

export const ColumnOrderingWithPinning = () => (
  <ShadcnTable columns={columns} data={data} />
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

const centreOf = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

/** A finger's pointer event, sent to the element it went down on. */
const touch = ({
  at,
  element,
  type,
}: {
  at: { x: number; y: number };
  element: Element;
  type: 'pointercancel' | 'pointerdown' | 'pointermove' | 'pointerup';
}) =>
  fireEvent(
    element,
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: at.x,
      clientY: at.y,
      isPrimary: true,
      pointerId: 11,
      pointerType: 'touch',
    }),
  );

const pause = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** The copy of the dragged menu row that follows the finger. */
const ghost = () =>
  document.querySelector<HTMLElement>('[data-st-touch-ghost]');

/** Runs `drag` and returns the touch ghosts it drew. */
const ghostsDrawnBy = async (drag: () => unknown) => {
  const ghosts: Element[] = [];
  const observer = new MutationObserver((records) =>
    records.forEach((record) =>
      record.addedNodes.forEach((node) => {
        if (node instanceof Element && node.matches('[data-st-touch-ghost]')) {
          ghosts.push(node);
        }
      }),
    ),
  );
  observer.observe(document.body, { childList: true });
  await drag();
  observer.disconnect();
  return ghosts;
};

/**
 * Drags the menu row of `source` by touch, by its Move grip, onto the row of
 * `target`. The ghost shows while the drag is on, follows the finger and is
 * gone after the `end` event; the menu stays open.
 */
const touchMenuDrag = async ({
  end = 'pointerup',
  menu,
  source,
  target,
}: {
  end?: 'pointercancel' | 'pointerup';
  menu: HTMLElement;
  source: string;
  target: string;
}) => {
  const handle = within(
    menuItem(menu, source).parentElement as HTMLElement,
  ).getByRole('button', { name: 'Move' });
  const from = centreOf(handle);
  const to = centreOf(menuItem(menu, target));
  touch({ at: from, element: handle, type: 'pointerdown' });
  touch({
    at: { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 },
    element: handle,
    type: 'pointermove',
  });
  await waitFor(() => expect(ghost()).not.toBeNull());
  const halfway = ghost()?.style.translate;
  touch({ at: to, element: handle, type: 'pointermove' });
  await waitFor(() => expect(ghost()?.style.translate).not.toBe(halfway));
  await pause(50);
  touch({ at: to, element: handle, type: end });
  await waitFor(() => expect(ghost()).toBeNull());
  expect(menu.isConnected).toBe(true);
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
    const before = headerIds(canvasElement);
    const menu = await openColumnsMenu(canvasElement);
    // A mouse drag draws no ghost at any moment of the drag.
    expect(
      await ghostsDrawnBy(() => menuDrag(menu, 'Address', 'First Name')),
    ).toEqual([]);
    await waitFor(() =>
      expect(headerIds(canvasElement).slice(0, 4)).toEqual([
        'address',
        'firstName',
        'lastName',
        'email',
      ]),
    );
    expect(firstRowIds(canvasElement)).toEqual(headerIds(canvasElement));
    const moved = headerIds(canvasElement);

    // Touch: a cancelled drag leaves the order, then the grip drags at once,
    // back and then as the mouse moved it.
    await touchMenuDrag({
      end: 'pointercancel',
      menu,
      source: 'Address',
      target: 'Email Address',
    });
    await pause(100);
    expect(headerIds(canvasElement)).toEqual(moved);
    await touchMenuDrag({ menu, source: 'Address', target: 'Email Address' });
    await waitFor(() => expect(headerIds(canvasElement)).toEqual(before));
    await touchMenuDrag({ menu, source: 'Address', target: 'First Name' });
    await waitFor(() => expect(headerIds(canvasElement)).toEqual(moved));
    expect(firstRowIds(canvasElement)).toEqual(headerIds(canvasElement));
    expect(await within(document.body).findByRole('menu')).toBe(menu);

    // A tap on a grip moves nothing: the next order change slides no column.
    const grip = within(
      menuItem(menu, 'State').parentElement as HTMLElement,
    ).getByRole('button', { name: 'Move' });
    touch({ at: centreOf(grip), element: grip, type: 'pointerdown' });
    touch({ at: centreOf(grip), element: grip, type: 'pointerup' });
    await pause(100);
    expect(headerIds(canvasElement)).toEqual(moved);
    const slides = spyOn(Element.prototype, 'animate');
    try {
      await userEvent.click(
        within(document.body).getByRole('button', { name: 'Reset order' }),
      );
      await waitFor(() => expect(headerIds(canvasElement)).toEqual(before));
      await pause(100);
      expect(slides).not.toHaveBeenCalled();
    } finally {
      slides.mockRestore();
    }
  },
};

/**
 * A column with `enableColumnOrdering: false` has no grip in the columns
 * menu, takes no drop, and keeps its index while other columns move.
 */
export const LockedColumnStaysPut = {
  render: () => <ColumnOrderingDisabledPerColumn />,
  play: async ({ canvasElement }: StoryContext) => {
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
    const before = headerIds(canvasElement);
    menuDrag(menu, 'First Name', 'City');
    await waitFor(() => expect(headerIds(canvasElement)[0]).toBe('lastName'));
    expect(headerIds(canvasElement).indexOf('state')).toBe(5);
    expect(firstRowIds(canvasElement)).toEqual(headerIds(canvasElement));
    const moved = headerIds(canvasElement);

    // Touch: a drop on the locked row is refused, then First Name moves back
    // and past the locked column again as the mouse moved it.
    await touchMenuDrag({ menu, source: 'Last Name', target: 'State' });
    await pause(100);
    expect(headerIds(canvasElement)).toEqual(moved);
    await touchMenuDrag({ menu, source: 'First Name', target: 'Last Name' });
    await waitFor(() => expect(headerIds(canvasElement)).toEqual(before));
    await touchMenuDrag({ menu, source: 'First Name', target: 'City' });
    await waitFor(() => expect(headerIds(canvasElement)).toEqual(moved));
    expect(headerIds(canvasElement).indexOf('state')).toBe(5);
    expect(firstRowIds(canvasElement)).toEqual(headerIds(canvasElement));
  },
};
