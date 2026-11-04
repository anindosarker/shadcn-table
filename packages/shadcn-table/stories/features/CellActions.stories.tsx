import { type Meta, type StoryContext } from '@storybook/react-vite';
import {
  expect,
  fireEvent,
  screen,
  spyOn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test';
import {
  type ST_ColumnDef,
  ShadcnTable,
  ST_ActionMenuItem,
} from '@/components/ui/shadcn-table';
import {
  Mail,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  UserX,
} from 'lucide-react';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { faker } from '@faker-js/faker';

const meta: Meta = {
  title: 'Features/Cell Action Examples',
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

export const CellActionsEnabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableCellActions
    enableClickToCopy="context-menu"
  />
);

export const CellActionsEnabledConditionally = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableCellActions={(cell) => cell.row.index % 2 === 0}
    enableClickToCopy="context-menu"
  />
);

export const CellActionsEnabledCustom = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableCellActions
    renderCellActionMenuItems={({ closeMenu }) => [
      <ST_ActionMenuItem
        icon={<Mail />}
        key={1}
        label="Item 1"
        onClick={() => {
          closeMenu();
        }}
      />,
      <ST_ActionMenuItem
        icon={<UserX />}
        key={2}
        label="Item 2"
        onClick={() => {
          closeMenu();
        }}
      />,
    ]}
  />
);

// A real right-click fires contextmenu on the cell (macOS: on mousedown),
// then the right button's pointerup lands on whatever is under the cursor,
// which is now the first menu item. Radix selects an item on pointerup when
// the pointer did not go down on it, so the menu closed itself (and ran the
// item) before the user let go. The menu must still be open afterwards.
CellActionsEnabledCustom.play = async ({ canvas, userEvent }: StoryContext) => {
  const cell = (await canvas.findAllByRole('cell'))[0];
  await userEvent.pointer({ keys: '[MouseRight>]', target: cell });
  const item = await screen.findByRole('menuitem', { name: 'Item 1' });
  await userEvent.pointer({ keys: '[/MouseRight]', target: item });
  await new Promise((resolve) => setTimeout(resolve, 300));
  await expect(screen.getByRole('menu')).toBeVisible();
  await expect(screen.getByRole('menuitem', { name: 'Item 1' })).toBeVisible();
  // Escape still closes it.
  await userEvent.keyboard('{Escape}');
  await waitFor(() =>
    expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
  );
};

export const CellActionsWithClickToCopy = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableCellActions
    enableClickToCopy
    renderCellActionMenuItems={({ closeMenu }) => [
      <ST_ActionMenuItem
        icon={<Mail />}
        key={1}
        label="Item 1"
        onClick={() => {
          closeMenu();
        }}
      />,
      <ST_ActionMenuItem
        icon={<UserX />}
        key={2}
        label="Item 2"
        onClick={() => {
          closeMenu();
        }}
      />,
    ]}
  />
);

export const CellActionsWithBuiltIns = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    editDisplayMode="cell"
    enableCellActions
    enableClickToCopy="context-menu"
    enableEditing
    renderCellActionMenuItems={({ closeMenu, internalMenuItems }) => [
      ...internalMenuItems,
      <DropdownMenuSeparator key="divider" />,
      <ST_ActionMenuItem
        icon={<Mail />}
        key={1}
        label="Item 1"
        onClick={() => {
          closeMenu();
        }}
      />,
      <ST_ActionMenuItem
        icon={<UserX />}
        key={2}
        label="Item 2"
        onClick={() => {
          closeMenu();
        }}
      />,
    ]}
  />
);

const firstNameCell = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>(
    'tbody tr:first-child td[data-flip-column="firstName"]',
  )!;

/** A right click on a cell opens its action menu with the copy item. */
export const RightClickOpensMenu = {
  render: () => <CellActionsEnabled />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(data[0].firstName);
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.contextMenu(firstNameCell(canvasElement));
    const menu = await screen.findByRole('menu');
    expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((item) => (item.textContent ?? '').trim()),
    ).toContain('Copy');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
  },
};

/** Choosing Copy writes the cell's value to the clipboard and closes the menu. */
export const MenuItemRuns = {
  render: () => <CellActionsEnabled />,
  play: async ({ canvasElement }: StoryContext) => {
    const writeText = spyOn(navigator.clipboard, 'writeText').mockResolvedValue(
      undefined,
    );
    try {
      await within(canvasElement).findAllByText(data[0].firstName);
      fireEvent.contextMenu(firstNameCell(canvasElement));
      const menu = await screen.findByRole('menu');
      await userEvent.click(
        within(menu).getByRole('menuitem', { name: 'Copy' }),
      );
      expect(writeText).toHaveBeenCalledWith(data[0].firstName);
      await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    } finally {
      writeText.mockRestore();
    }
  },
};
