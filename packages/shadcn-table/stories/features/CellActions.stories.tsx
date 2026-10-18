import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, screen, waitFor } from 'storybook/test';
import { type ST_ColumnDef } from '@/components/ui/shadcn-table';
import { Mail, UserX } from 'lucide-react';
import { ShadcnTable } from '@/components/ui/shadcn-table/ShadcnTable';
import { ST_ActionMenuItem } from '@/components/ui/shadcn-table/menus/ST_ActionMenuItem';
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
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
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
    renderCellActionMenuItems={({ closeMenu, table }) => [
      <ST_ActionMenuItem
        icon={<Mail />}
        key={1}
        label="Item 1"
        onClick={() => {
          closeMenu();
        }}
        table={table}
      />,
      <ST_ActionMenuItem
        icon={<UserX />}
        key={2}
        label="Item 2"
        onClick={() => {
          closeMenu();
        }}
        table={table}
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
    renderCellActionMenuItems={({ closeMenu, table }) => [
      <ST_ActionMenuItem
        icon={<Mail />}
        key={1}
        label="Item 1"
        onClick={() => {
          closeMenu();
        }}
        table={table}
      />,
      <ST_ActionMenuItem
        icon={<UserX />}
        key={2}
        label="Item 2"
        onClick={() => {
          closeMenu();
        }}
        table={table}
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
    renderCellActionMenuItems={({ closeMenu, internalMenuItems, table }) => [
      ...internalMenuItems,
      <DropdownMenuSeparator key="divider" />,
      <ST_ActionMenuItem
        icon={<Mail />}
        key={1}
        label="Item 1"
        onClick={() => {
          closeMenu();
        }}
        table={table}
      />,
      <ST_ActionMenuItem
        icon={<UserX />}
        key={2}
        label="Item 2"
        onClick={() => {
          closeMenu();
        }}
        table={table}
      />,
    ]}
  />
);
