import {
  type ST_ColumnDef,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import {
  Building2Icon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  parameters: {
    status: {
      type: 'stable',
    },
  },
  title: 'Styling/Sticky Header',
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
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const StickyHeaderDisabledDefault = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const EnableStickyHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const StickyHeaderShorterTable = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    enableRowSelection
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    stTableContainerProps={{ style: { maxHeight: 400 } }}
  />
);

const columnsWithFooters: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    footer: 'First Name',
    header: 'First Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'lastName',
    footer: 'Last Name',
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'address',
    footer: 'Address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'state',
    footer: 'State',
    header: 'State',
    icon: MapIcon,
  },
  {
    accessorKey: 'phoneNumber',
    footer: 'Phone Number',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

export const disableStickyFooter = () => (
  <ShadcnTable
    columns={columnsWithFooters}
    data={data}
    enableRowNumbers
    enableStickyFooter={false}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    stTableContainerProps={{ style: { maxHeight: 400 } }}
  />
);

export const enableStickyFooter = () => (
  <ShadcnTable
    columns={columnsWithFooters}
    data={data}
    enableRowNumbers
    enableStickyFooter
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    stTableContainerProps={{ style: { maxHeight: 400 } }}
  />
);

// The sticky header stays at the top of the 400px box while the rows scroll.
StickyHeaderShorterTable.play = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByText(data[0]!.firstName);
  const thead = canvasElement.querySelector<HTMLElement>('thead')!;
  expect(getComputedStyle(thead).position).toBe('sticky');
  let box: HTMLElement | null = thead.parentElement;
  while (box && getComputedStyle(box).overflowY !== 'auto') {
    box = box.parentElement;
  }
  expect(box!.getBoundingClientRect().height).toBeLessThanOrEqual(400);
  box!.scrollTop = 300;
  await waitFor(() => expect(box!.scrollTop).toBe(300));
  await waitFor(() =>
    expect(
      Math.abs(
        thead.getBoundingClientRect().top - box!.getBoundingClientRect().top,
      ),
    ).toBeLessThanOrEqual(1),
  );
};

// The docs example `enable-sticky-header`: header and footer stay in view
// while 30 unpaged rows scroll.
type Contact = {
  firstName: string;
  lastName: string;
  email: string;
  city: string;
};

const contacts: Contact[] = [
  {
    firstName: 'Dylan',
    lastName: 'Murray',
    email: 'dmurray@yopmail.com',
    city: 'East Daphne',
  },
  {
    firstName: 'Raquel',
    lastName: 'Kohler',
    email: 'rkholer33@yopmail.com',
    city: 'Columbus',
  },
  {
    firstName: 'Ervin',
    lastName: 'Reinger',
    email: 'ereinger@mailinator.com',
    city: 'South Linda',
  },
  {
    firstName: 'Brittany',
    lastName: 'McCullough',
    email: 'bmccullough44@mailinator.com',
    city: 'Lincoln',
  },
  {
    firstName: 'Branson',
    lastName: 'Frami',
    email: 'bframi@yopmain.com',
    city: 'New York',
  },
  {
    firstName: 'Ben',
    lastName: 'Murray',
    email: 'benm@email.com',
    city: 'Salt Lake City',
  },
  {
    firstName: 'Elena',
    lastName: 'Smith',
    email: 'esmith@yopmail.com',
    city: 'Los Angeles',
  },
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'mjohnson@mailinator.com',
    city: 'Chicago',
  },
  {
    firstName: 'Sophia',
    lastName: 'Brown',
    email: 'sbrown@yopmail.com',
    city: 'Houston',
  },
  {
    firstName: 'Lucas',
    lastName: 'Davis',
    email: 'ldavis@mailinator.com',
    city: 'Phoenix',
  },
  {
    firstName: 'Olivia',
    lastName: 'Garcia',
    email: 'ogarcia@yopmail.com',
    city: 'Philadelphia',
  },
  {
    firstName: 'Liam',
    lastName: 'Rodriguez',
    email: 'lrodriguez@mailinator.com',
    city: 'San Antonio',
  },
  {
    firstName: 'Emma',
    lastName: 'Martinez',
    email: 'emartinez@yopmail.com',
    city: 'San Diego',
  },
  {
    firstName: 'Noah',
    lastName: 'Hernandez',
    email: 'nhernandez@mailinator.com',
    city: 'Dallas',
  },
  {
    firstName: 'Ava',
    lastName: 'Lopez',
    email: 'alopez@yopmail.com',
    city: 'San Jose',
  },
  {
    firstName: 'William',
    lastName: 'Gonzalez',
    email: 'wgonzalez@mailinator.com',
    city: 'Austin',
  },
  {
    firstName: 'Isabella',
    lastName: 'Wilson',
    email: 'iwilson@yopmail.com',
    city: 'Jacksonville',
  },
  {
    firstName: 'James',
    lastName: 'Anderson',
    email: 'janderson@mailinator.com',
    city: 'Fort Worth',
  },
  {
    firstName: 'Mia',
    lastName: 'Thomas',
    email: 'mthomas@yopmail.com',
    city: 'Columbus',
  },
  {
    firstName: 'Alexander',
    lastName: 'Taylor',
    email: 'ataylor@mailinator.com',
    city: 'Charlotte',
  },
  {
    firstName: 'Grace',
    lastName: 'Moore',
    email: 'gmoore@yopmail.com',
    city: 'Indianapolis',
  },
  {
    firstName: 'Ethan',
    lastName: 'White',
    email: 'ewhite@mailinator.com',
    city: 'San Francisco',
  },
  {
    firstName: 'Lily',
    lastName: 'Harris',
    email: 'lharris@yopmail.com',
    city: 'Seattle',
  },
  {
    firstName: 'Daniel',
    lastName: 'Martin',
    email: 'dmartin@mailinator.com',
    city: 'Denver',
  },
  {
    firstName: 'Zoe',
    lastName: 'Jackson',
    email: 'zjackson@yopmail.com',
    city: 'Boston',
  },
  {
    firstName: 'Matthew',
    lastName: 'Thompson',
    email: 'mthompson@mailinator.com',
    city: 'Nashville',
  },
  {
    firstName: 'Ella',
    lastName: 'Garcia',
    email: 'egarcia@yopmail.com',
    city: 'Detroit',
  },
  {
    firstName: 'David',
    lastName: 'Martinez',
    email: 'dmartinez@mailinator.com',
    city: 'Portland',
  },
  {
    firstName: 'Aria',
    lastName: 'Robinson',
    email: 'arobinson@yopmail.com',
    city: 'Las Vegas',
  },
  {
    firstName: 'Joseph',
    lastName: 'Clark',
    email: 'jclark@mailinator.com',
    city: 'Baltimore',
  },
];

const contactColumns: ST_ColumnDef<Contact>[] = [
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'First Name',
    footer: 'First Name',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'Last Name',
    footer: 'Last Name',
  },
  {
    accessorKey: 'email',
    icon: MailIcon,
    header: 'Email',
    footer: 'Email',
  },
  {
    accessorKey: 'city',
    icon: Building2Icon,
    header: 'City',
    footer: 'City',
  },
];

const StickyHeaderExample = () => {
  const table = useShadcnTable({
    columns: contactColumns,
    data: contacts,
    enableBottomToolbar: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    enablePagination: false,
    stTableContainerProps: { className: 'max-h-[400px]' },
    stTableBodyCellProps: {
      className: 'bg-muted',
    },
  });

  return <ShadcnTable table={table} />;
};

export const StickyHeader = {
  render: () => <StickyHeaderExample />,
  // Every row renders unpaged; header and footer stay at the edges of the
  // scroll box while the rows scroll.
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText(contacts[0]!.email);
    expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(
      contacts.length,
    );
    const thead = canvasElement.querySelector<HTMLElement>('thead')!;
    const tfoot = canvasElement.querySelector<HTMLElement>('tfoot')!;
    expect(getComputedStyle(thead).position).toBe('sticky');
    expect(getComputedStyle(tfoot).position).toBe('sticky');
    let box: HTMLElement | null = thead.parentElement;
    while (box && getComputedStyle(box).overflowY !== 'auto') {
      box = box.parentElement;
    }
    box!.scrollTop = 300;
    await waitFor(() => expect(box!.scrollTop).toBe(300));
    await waitFor(() => {
      const rect = box!.getBoundingClientRect();
      expect(
        Math.abs(thead.getBoundingClientRect().top - rect.top),
      ).toBeLessThanOrEqual(1);
      // The visible bottom edge, above a horizontal scrollbar if one shows.
      const bottom = rect.top + box!.clientTop + box!.clientHeight;
      expect(
        Math.abs(tfoot.getBoundingClientRect().bottom - bottom),
      ).toBeLessThanOrEqual(1);
    });
  },
};
