import {
  MailIcon,
  MailboxIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  TypeIcon,
  UserIcon,
} from 'lucide-react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { expect, userEvent, waitFor, within } from 'storybook/test';

const meta: Meta = {
  title: 'Features/Column Hiding Examples',
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
    accessorKey: 'zip',
    header: 'Zip',
    icon: MailboxIcon,
  },
  {
    accessorKey: 'email',
    header: 'Email Address',
    icon: MailIcon,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
  zip: faker.location.zipCode(),
}));

export const ColumnHidingEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} />
);

export const ColumnHidingDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableHiding={false} />
);

export const ColumnHidingDisabledButWithOrdering = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnOrdering
    enableHiding={false}
  />
);

export const ColumnHidingDisabledButWithPinning = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    enableHiding={false}
  />
);

export const ColumnHidingDisabledPerColumn = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        enableHiding: false,
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        enableHiding: false,
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
        accessorKey: 'zip',
        header: 'Zip',
        icon: MailboxIcon,
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
        icon: MailIcon,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
  />
);

export const ColumnHidingWithHeaderGroups = () => (
  <ShadcnTable
    columns={[
      {
        columns: [
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
        ],
        header: 'Name',
        id: 'name',
      },
      {
        columns: [
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
            accessorKey: 'zip',
            header: 'Zip',
            icon: MailboxIcon,
          },
        ],
        header: 'Mailing Info',
        id: 'mailingInfo',
      },
      {
        columns: [
          {
            accessorKey: 'email',
            header: 'Email Address',
            icon: MailIcon,
          },
          {
            accessorKey: 'phoneNumber',
            header: 'Phone Number',
            icon: PhoneIcon,
          },
        ],
        header: 'Contact Info',
        id: 'contactInfo',
      },
    ]}
    data={data}
  />
);
export const ColumnHidingColumnsNotVisibleInShowHide = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
        visibleInShowHideMenu: false,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
        visibleInShowHideMenu: false,
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
        accessorKey: 'zip',
        header: 'Zip',
        icon: MailboxIcon,
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
        icon: MailIcon,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
  />
);
export const ColumnHidingWithColumnsHiddenAndNotVisibleInShowHide = () => (
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
        enableHiding: false,
        header: 'Address',
        icon: MapPinIcon,
        visibleInShowHideMenu: false,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
      {
        accessorKey: 'zip',
        header: 'Zip',
        icon: MailboxIcon,
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
        icon: MailIcon,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        icon: PhoneIcon,
      },
    ]}
    data={data}
    initialState={{
      columnVisibility: { address: false },
    }}
  />
);

/** Space on a focused column row hides the column; Tab reaches the pin buttons. */
export const ColumnHidingKeyboardToggle = {
  render: () => (
    <ShadcnTable columns={columns} data={data} enableColumnPinning />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByRole('columnheader', { name: /Last Name/ });
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show/Hide columns' }),
    );
    const menu = await body.findByRole('menu');
    const row = within(menu).getByRole('menuitemcheckbox', {
      name: 'Last Name',
    });
    await waitFor(() => expect(row).toHaveAttribute('aria-checked', 'true'));
    row.focus();
    await userEvent.keyboard(' ');
    await waitFor(() =>
      expect(
        canvas.queryByRole('columnheader', { hidden: true, name: /Last Name/ }),
      ).toBeNull(),
    );
    await waitFor(() =>
      expect(
        within(menu).getByRole('menuitemcheckbox', { name: 'Last Name' }),
      ).toHaveAttribute('aria-checked', 'false'),
    );
    await userEvent.keyboard('{Enter}');
    await canvas.findByRole('columnheader', {
      hidden: true,
      name: /Last Name/,
    });

    // Tab leaves the row's menu item for the pin buttons beside it.
    await userEvent.tab();
    await waitFor(() => {
      const active = document.activeElement;
      expect(active?.tagName).toBe('BUTTON');
      expect(active?.getAttribute('role')).toBeNull();
      expect(menu.contains(active)).toBe(true);
    });
  },
};

/** A column with an icon shows it before its label in the columns menu. */
export const MenuItemsShowIcons = {
  render: () => (
    <ShadcnTable
      columns={columns.map((column) =>
        column.accessorKey === 'firstName'
          ? { ...column, icon: TypeIcon }
          : column.accessorKey === 'email'
            ? { ...column, icon: MailIcon }
            : column,
      )}
      data={data}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByRole('columnheader', { name: /First Name/ });
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show/Hide columns' }),
    );
    const menu = await body.findByRole('menu');
    const item = (name: string) =>
      within(menu).getByRole('menuitemcheckbox', { name });
    expect(item('First Name').querySelector('svg.lucide-type')).not.toBeNull();
    expect(
      item('Email Address').querySelector('svg.lucide-mail'),
    ).not.toBeNull();
    // A column without an icon shows only the check indicator's svg.
    expect(
      item('Last Name').querySelectorAll('svg:not(.lucide-check)'),
    ).toHaveLength(0);
  },
};
