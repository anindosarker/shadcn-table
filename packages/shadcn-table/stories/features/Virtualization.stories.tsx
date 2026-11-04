import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { expect, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import {
  Building2Icon,
  GlobeIcon,
  type LucideIcon,
  MailIcon,
  MailboxIcon,
  MapIcon,
  MapPinIcon,
  PaletteIcon,
  PawPrintIcon,
  PhoneIcon,
  QuoteIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Virtualization',
};

export default meta;

const longColumns: ST_ColumnDef<(typeof longData)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'middleName',
    header: 'Middle Name',
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
    size: 300,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'zipCode',
    header: 'Zip Code',
    icon: MailboxIcon,
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
    accessorKey: 'country',
    header: 'Country',
    icon: GlobeIcon,
    size: 200,
  },
  {
    accessorKey: 'favoriteColor',
    header: 'Favorite Color',
    icon: PaletteIcon,
  },
  {
    accessorKey: 'favoriteQuote',
    header: 'Favorite Quote',
    icon: QuoteIcon,
    size: 700,
  },
  {
    accessorKey: 'petName',
    header: 'Pet Name',
    icon: PawPrintIcon,
  },
  {
    accessorKey: 'petType',
    header: 'Pet Type',
    icon: PawPrintIcon,
  },
];

// The virtualizers read the container ref, which attaches after the body's
// and the table's layout effects; rows and cells must show on first mount,
// with no interaction.
const expectRowsAndCellsOnMount = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => {
    expect(canvasElement.querySelectorAll('thead th').length).toBeGreaterThan(
      0,
    );
    expect(canvasElement.querySelectorAll('tbody tr').length).toBeGreaterThan(
      0,
    );
    expect(canvasElement.querySelectorAll('tbody td').length).toBeGreaterThan(
      0,
    );
  });
};

const longData = [...Array(5000)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  country: faker.location.country(),
  email: faker.internet.email(),
  favoriteColor: faker.internet.color(),
  favoriteQuote: faker.lorem.sentence(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  middleName: faker.person.firstName(),
  petName: faker.animal.cat(),
  petType: faker.animal.type(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
  zipCode: faker.location.zipCode(),
}));

export const EnableRowVirtualizationDense = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowVirtualization
    initialState={{ density: 'compact' }}
  />
);

export const EnableRowVirtualizationComfortable = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowVirtualization
  />
);

EnableRowVirtualizationComfortable.play = expectRowsAndCellsOnMount;

export const EnableRowVirtualizationSpacious = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowVirtualization
    initialState={{ density: 'spacious' }}
  />
);

export const EnableRowVirtualizationTallContent = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData}
    enableBottomToolbar={false}
    enableColumnResizing
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
  />
);

export const VirtualizationConditionallyWontToggle = () => {
  const [enabled, setEnabled] = useState(true);
  return (
    <ShadcnTable
      columns={longColumns}
      data={longData}
      enableBottomToolbar={false}
      enableColumnVirtualization={enabled}
      enablePagination={false}
      enableRowNumbers
      enableRowVirtualization={enabled}
      initialState={{ density: 'compact' }}
      renderTopToolbarCustomActions={() => (
        <div className="flex flex-row items-center">
          <Button onClick={() => setEnabled(!enabled)}>
            Toggle Virtualization
          </Button>
          * Virtualization features cannot be toggled
        </div>
      )}
    />
  );
};

export const EnableRowVirtualizationWithColumnResizing = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData}
    enableBottomToolbar={false}
    enableColumnResizing
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
  />
);

export const EnableRowVirtualizationWithDetailPanel = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
    renderDetailPanel={() => <div>Detail Panel</div>}
  />
);

export const EnableRowVirtualizationStickyFooter = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        footer: 'First Name',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'middleName',
        footer: 'Middle Name',
        header: 'Middle Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        footer: 'Last Name',
        header: 'Last Name',
        icon: UserIcon,
      },
    ]}
    data={longData}
    enableBottomToolbar={false}
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
    enableStickyFooter
  />
);

export const EnableColumnVirtualization = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData.slice(0, 10)}
    enableColumnVirtualization
    enableRowNumbers
  />
);

EnableColumnVirtualization.play = expectRowsAndCellsOnMount;

export const EnableColumnVirtualizationWithPinning = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData.slice(0, 10)}
    enableColumnPinning
    enableColumnVirtualization
    enableRowNumbers
  />
);

export const EnableColumnVirtualizationShortColumns = () => (
  <ShadcnTable
    columns={longColumns.slice(0, 3)}
    data={longData.slice(0, 10)}
    enableColumnVirtualization
    enableRowNumbers
  />
);

export const EnableColumnVirtualizationWithFooter = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        footer: 'First Name',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'middleName',
        footer: 'Middle Name',
        header: 'Middle Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        footer: 'Last Name',
        header: 'Last Name',
        icon: UserIcon,
      },
    ]}
    data={longData.slice(0, 15)}
    enableColumnVirtualization
    enableRowNumbers
  />
);

export const EnableColumnVirtualizationStickyFooter = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        footer: 'First Name',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'middleName',
        footer: 'Middle Name',
        header: 'Middle Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        footer: 'Last Name',
        header: 'Last Name',
        icon: UserIcon,
      },
    ]}
    data={longData.slice(0, 50)}
    enableColumnVirtualization
    enableRowNumbers
    enableStickyFooter
  />
);

export const RowAndColumnVirtualization = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData}
    enableBottomToolbar={false}
    enableColumnVirtualization
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
  />
);

RowAndColumnVirtualization.play = expectRowsAndCellsOnMount;

export const RowAndColumnVirtualizationWithFeatures = () => (
  <ShadcnTable
    columns={longColumns}
    data={longData}
    enableBottomToolbar={false}
    enableColumnOrdering
    enableColumnPinning
    enableColumnResizing
    enableColumnVirtualization
    enablePagination={false}
    enableRowNumbers
    enableRowSelection
    enableRowVirtualization
  />
);

// Icons by column key; every fake column holds first names, so none is
// listed and each falls back to the name icon.
const fakeColumnIcons: Record<string, LucideIcon> = {};

const fakeColumns = [...Array(500)].map((_, i) => {
  return {
    accessorKey: i.toString(),
    header: 'Column ' + i.toString(),
    icon: fakeColumnIcons[i.toString()] ?? UserIcon,
  };
});

const fakeData = [...Array(500)].map(() => ({
  ...Object.fromEntries(
    fakeColumns.map((col) => [col.accessorKey, faker.person.firstName()]),
  ),
}));

export const MaxVirtualization = () => (
  <ShadcnTable
    columns={fakeColumns}
    data={fakeData}
    enableBottomToolbar={false}
    enableColumnPinning
    enableColumnResizing
    enableColumnVirtualization
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
    stTableContainerProps={{ style: { maxHeight: 500 } }}
    stTableLayoutProps={{ className: 'mx-auto max-w-[1000px]' }}
  />
);

MaxVirtualization.play = expectRowsAndCellsOnMount;

export const EmptyDataVirtualization = () => (
  <ShadcnTable
    columns={fakeColumns}
    data={[]}
    enableBottomToolbar={false}
    enableColumnPinning
    enableColumnResizing
    enableColumnVirtualization
    enablePagination={false}
    enableRowNumbers
    enableRowVirtualization
    stTableContainerProps={{ style: { maxHeight: 500 } }}
    stTableLayoutProps={{ className: 'mx-auto max-w-[1000px]' }}
  />
);

/** The table's scroll container: its nearest ancestor that scrolls. */
const scrollBox = (canvasElement: HTMLElement) => {
  let box = canvasElement.querySelector('table')?.parentElement ?? null;
  while (box && getComputedStyle(box).overflowY !== 'auto') {
    box = box.parentElement;
  }
  if (!box) throw new Error('scroll container not found');
  return box;
};

const indexes = (elements: NodeListOf<Element>) =>
  [...elements].map((element) => Number(element.getAttribute('data-index')));

/**
 * Row virtualization renders a window of the 500 rows; scrolling down
 * renders rows further in the data.
 */
export const ScrollRendersFurtherRows = {
  render: () => <MaxVirtualization />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(fakeData[0]!['0']!);
    const rows = () => canvasElement.querySelectorAll('tbody tr[data-index]');
    expect(rows().length).toBeGreaterThan(0);
    expect(rows().length).toBeLessThan(fakeData.length);
    const lastBefore = Math.max(...indexes(rows()));
    const box = scrollBox(canvasElement);
    box.scrollTop = box.scrollHeight / 2;
    box.dispatchEvent(new Event('scroll'));
    await waitFor(() =>
      expect(Math.min(...indexes(rows()))).toBeGreaterThan(lastBefore),
    );
    const first = Math.min(...indexes(rows()));
    expect(
      canvasElement.querySelector(`tbody tr[data-index="${first}"]`),
    ).toHaveTextContent(fakeData[first]!['0']!);
    expect(rows().length).toBeLessThan(fakeData.length);
  },
};

/**
 * Column virtualization renders a window of the 500 columns; scrolling
 * sideways brings later headers in, the body cells with them.
 */
export const ColumnVirtualizationScrollsHeaders = {
  render: () => <MaxVirtualization />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(fakeData[0]!['0']!);
    const headers = () =>
      canvasElement.querySelectorAll('thead th[data-flip-column]');
    expect(headers().length).toBeLessThan(fakeColumns.length);
    expect(canvasElement.querySelector('thead')).not.toHaveTextContent(
      'Column 250',
    );
    const box = scrollBox(canvasElement);
    box.scrollLeft = box.scrollWidth / 2;
    box.dispatchEvent(new Event('scroll'));
    await waitFor(() =>
      expect(
        canvasElement.querySelector('thead th[data-flip-column="250"]'),
      ).toHaveTextContent('Column 250'),
    );
    expect(headers().length).toBeLessThan(fakeColumns.length);
    expect(
      canvasElement.querySelector('thead th[data-flip-column="0"]'),
    ).toBeNull();
    const row = canvasElement.querySelector('tbody tr[data-index="0"]')!;
    expect(row.querySelector('td[data-flip-column="250"]')).toHaveTextContent(
      fakeData[0]!['250']!,
    );
  },
};
