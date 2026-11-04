import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Building2Icon, MapIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Fixed Bugs/Click Propagation',
};

export default meta;

type Person = {
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  state: string;
};

const columns: ST_ColumnDef<Person>[] = [
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

const data = [...Array(6)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowClickAndRowMenuActions = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableEditing
      enableRowActions
      stTableBodyRowProps={{
        onClick: () => {
          alert('row click');
        },
      }}
      renderRowActionMenuItems={() => [
        <DropdownMenuItem key="test">Test</DropdownMenuItem>,
      ]}
    />
  );
};

export const RowClickAndRowButtonActions = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableEditing
      enableRowActions
      stTableBodyRowProps={{
        onClick: () => {
          alert('row click');
        },
      }}
      renderRowActions={() => (
        <Button onClick={(e) => e.stopPropagation()}>Test</Button>
      )}
    />
  );
};

// The row action button and its menu item do not trigger the row's click;
// a click on a plain cell still does.
RowClickAndRowMenuActions.play = async ({ canvasElement }: StoryContext) => {
  const alert = spyOn(window, 'alert').mockImplementation(() => {});
  try {
    const canvas = within(canvasElement);
    await canvas.findAllByText(data[0]!.firstName);
    const [actions] = canvas.getAllByRole('button', { name: 'Row Actions' });
    await userEvent.click(actions!);
    const menu = await within(document.body).findByRole('menu');
    expect(alert).not.toHaveBeenCalled();
    await userEvent.click(within(menu).getByRole('menuitem', { name: 'Test' }));
    await waitFor(() =>
      expect(document.querySelector('[role="menu"]')).toBeNull(),
    );
    expect(alert).not.toHaveBeenCalled();
    await userEvent.click(canvas.getAllByText(data[1]!.lastName)[0]!);
    expect(alert).toHaveBeenCalledTimes(1);
  } finally {
    alert.mockRestore();
  }
};
