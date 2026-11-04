import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { MapIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Features/Layout Mode Examples',
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

// The stock layout: grid, data columns grow in proportion (D31).
export const DefaultGrid = () => (
  <ShadcnTable columns={columns} data={data} enableRowSelection />
);

export const Semantic = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    layoutMode="semantic"
  />
);

export const Grid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    layoutMode="grid"
  />
);

export const GridNoGrow = () => (
  <ShadcnTable
    columns={columns.slice(0, 2)}
    data={data}
    enableRowSelection
    layoutMode="grid-no-grow"
  />
);

export const GridWithResizing = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    layoutMode="grid"
  />
);

export const GridNoGrowWithResizing = () => (
  <ShadcnTable
    columns={columns.slice(0, 2)}
    data={data}
    enableRowSelection
    layoutMode="grid-no-grow"
  />
);

const headerWidth = (canvasElement: HTMLElement, id: string) =>
  canvasElement
    .querySelector<HTMLElement>(`thead th[data-flip-column="${id}"]`)!
    .getBoundingClientRect().width;

const dataIds = ['firstName', 'lastName', 'address', 'state', 'phoneNumber'];

/**
 * The default grid layout spreads spare width over the data columns in
 * proportion; the select column keeps its own width (D31).
 */
export const GridGrowsColumns = {
  render: () => <DefaultGrid />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText(data[0].firstName);
    const table = canvasElement.querySelector('table')!;
    expect(getComputedStyle(table).display).toBe('grid');
    const select = canvasElement.querySelector<HTMLElement>('thead th')!;
    expect(select.getAttribute('data-flip-column')).toBe('st-row-select');
    const selectWidth = select.getBoundingClientRect().width;
    const widths = dataIds.map((id) => headerWidth(canvasElement, id));
    // Equal sizes grow equally, and together they fill the table.
    for (const width of widths) {
      expect(Math.abs(width - widths[0]!)).toBeLessThanOrEqual(1);
      expect(width).toBeGreaterThan(selectWidth * 2);
    }
    const total = selectWidth + widths.reduce((sum, width) => sum + width, 0);
    expect(
      Math.abs(total - table.getBoundingClientRect().width),
    ).toBeLessThanOrEqual(2);
    expect(selectWidth).toBeLessThanOrEqual(64);
  },
};

/** `layoutMode="semantic"` renders a native table layout. */
export const SemanticLayoutRenders = {
  render: () => <Semantic />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findByText(data[0].firstName);
    const table = canvasElement.querySelector('table')!;
    await waitFor(() => expect(getComputedStyle(table).display).toBe('table'));
    expect(
      getComputedStyle(canvasElement.querySelector('tbody tr')!).display,
    ).toBe('table-row');
    for (const id of dataIds) {
      const cell = canvasElement.querySelector<HTMLElement>(
        `tbody tr:first-child td[data-flip-column="${id}"]`,
      )!;
      expect(
        Math.abs(
          cell.getBoundingClientRect().width - headerWidth(canvasElement, id),
        ),
      ).toBeLessThanOrEqual(1);
    }
  },
};
