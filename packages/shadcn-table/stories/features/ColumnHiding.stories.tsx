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
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';

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
            : column.accessorKey === 'lastName'
              ? { ...column, icon: undefined }
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

/** The menu row around a column's item, with the drag handle beside it. */
const menuRow = (menu: HTMLElement, name: string) => {
  let row: HTMLElement | null = within(menu).getByRole('menuitemcheckbox', {
    name,
  });
  while (row && !row.querySelector('button[aria-label="Move"]')) {
    row = row.parentElement;
  }
  if (!row) throw new Error(`menu row ${name} not found`);
  return row;
};

const headerLeft = (canvasElement: HTMLElement, id: string) =>
  canvasElement
    .querySelector<HTMLElement>(`thead th[data-flip-column="${id}"]`)!
    .getBoundingClientRect().left;

/** The start shift of a header's running slide, 0 when it does not slide. */
const slideStart = (canvasElement: HTMLElement, id: string) => {
  const th = canvasElement.querySelector<HTMLElement>(
    `thead th[data-flip-column="${id}"]`,
  )!;
  const slide = th
    .getAnimations()
    .map((animation) => (animation.effect as KeyframeEffect).getKeyframes())
    .find((keyframes) => keyframes[0]?.translate !== undefined);
  return slide ? parseFloat(String(slide[0].translate)) : 0;
};

// A Columns menu reorder slides each header by the distance it moved, not by
// the table's offset from the page edge (F30).
export const MenuReorderWithTableOffset = {
  render: () => (
    <div style={{ marginLeft: 200 }}>
      <ShadcnTable columns={columns} data={data} enableColumnOrdering />
    </div>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByRole('columnheader', { name: /First Name/ });
    const before = new Map(
      ['firstName', 'lastName', 'address', 'state', 'zip'].map((id) => [
        id,
        headerLeft(canvasElement, id),
      ]),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show/Hide columns' }),
    );
    const menu = await within(document.body).findByRole('menu');
    const handle = within(menuRow(menu, 'Address')).getByRole('button', {
      name: 'Move',
    });
    fireEvent.dragStart(handle);
    fireEvent.dragEnter(menuRow(menu, 'First Name'));
    fireEvent.dragOver(menuRow(menu, 'First Name'));
    fireEvent.dragEnd(handle);
    await waitFor(() =>
      expect(
        canvas.getAllByRole('columnheader')[0].getAttribute('data-flip-column'),
      ).toBe('address'),
    );
    // Columns after the moved range keep their place and do not slide.
    expect(slideStart(canvasElement, 'state')).toBe(0);
    expect(slideStart(canvasElement, 'zip')).toBe(0);
    // A shifted header slides from where it sat by the distance it moved.
    for (const id of ['firstName', 'lastName', 'address']) {
      const th = canvasElement.querySelector<HTMLElement>(
        `thead th[data-flip-column="${id}"]`,
      )!;
      const shift = parseFloat(getComputedStyle(th).translate) || 0;
      const now = th.getBoundingClientRect().left - shift;
      expect(
        Math.abs(slideStart(canvasElement, id) - (before.get(id)! - now)),
      ).toBeLessThanOrEqual(1);
    }
  },
};
