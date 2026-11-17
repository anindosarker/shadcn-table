import {
  type ST_ColumnDef,
  type ST_Localization,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { CakeIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Features/Sub Row Tree Examples',
};

export default meta;

// Partial Hebrew localization for the RTL stories. The full locale ships as its
// own registry file under shared/locales; the stories import only the barrel.
const localizationHE: Partial<ST_Localization> = {
  language: 'he',
  actions: 'פעולות',
  collapse: 'צמצום',
  collapseAll: 'צמצום הכל',
  expand: 'הרחב',
  expandAll: 'הרחב הכל',
  goToNextPage: 'לדף הבא',
  goToPreviousPage: 'לדף הקודם',
  of: 'מתוך',
  rowsPerPage: 'שורות לעמוד',
  search: 'חיפוש',
  showHideColumns: 'הצג/הסתר עמודות',
  showHideFilters: 'הצג/הסתר סינונים',
  showHideSearch: 'הצג/הסתר חיפוש',
  toggleDensity: 'שנה צפיפות',
  toggleFullScreen: 'מסך מלא',
};

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
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

const data = [...Array(5)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  subRows: [...Array(faker.number.int(4))].map(() => ({
    address: faker.location.streetAddress(),
    age: faker.number.int(80),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    subRows: [...Array(3)].map(() => ({
      address: faker.location.streetAddress(),
      age: faker.number.int(80),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      subRows: [...Array(2)].map(() => ({
        address: faker.location.streetAddress(),
        age: faker.number.int(80),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
      })),
    })),
  })),
}));

export const SubRowTreeEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} enableExpanding />
);

export const SubRowTreeLayoutGrid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        // size: 100,
      },
    }}
    enableExpanding
    initialState={{ expanded: true }}
    layoutMode="grid"
  />
);

export const SubRowTreeLayoutGridNoGrow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        // size: 100,
      },
    }}
    enableExpanding
    initialState={{ expanded: true }}
    layoutMode="grid-no-grow"
  />
);

export const SubRowTreeEnabledPositionLast = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    positionExpandColumn="last"
  />
);

// Note: MUI ThemeProvider direction -> dir="rtl" on the wrapper.
export const SubRowTreeEnabledDefaultRTL = () => (
  <div dir="rtl" style={{ direction: 'rtl' }}>
    <ShadcnTable
      columns={columns}
      data={data}
      enableExpanding
      localization={localizationHE}
    />
  </div>
);

export const SubRowTreeEnabledDefaultRTLAndPositionLast = () => (
  <div dir="rtl" style={{ direction: 'rtl' }}>
    <ShadcnTable
      columns={columns}
      data={data}
      enableExpanding
      localization={localizationHE}
      positionActionsColumn="last"
    />
  </div>
);

export const SubRowTreeDisableExpandAll = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpandAll={false}
    enableExpanding
  />
);

export const SubRowTreeFilterFromLeafRows = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    filterFromLeafRows
    columnFilterDisplayMode="subheader"
    initialState={{ expanded: true, showColumnFilters: true }}
  />
);

export const SubRowTreeMaxLeafRowFilterDepth0 = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    columnFilterDisplayMode="subheader"
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={0}
  />
);

export const SubRowTreeMaxLeafRowFilterDepth1 = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    columnFilterDisplayMode="subheader"
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={1}
  />
);

export const SubRowTreeMaxLeafRowFilterDepthAndFilterFromLeafRows = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    filterFromLeafRows
    columnFilterDisplayMode="subheader"
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={0}
  />
);

export const SubRowTreeWithSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    enableRowSelection
  />
);

export const SubRowTreeWithSelectionNoSubRowSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    enableRowSelection
    enableSubRowSelection={false}
  />
);

export const SubRowTreeWithSingleSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enableMultiRowSelection={false}
    enablePagination={false}
    enableRowSelection
  />
);

type Node = { firstName: string; subRows?: Node[] };

const rowFirstNames = (canvasElement: HTMLElement) =>
  [
    ...canvasElement.querySelectorAll(
      'tbody tr td[data-flip-column="firstName"]',
    ),
  ].map((cell) => (cell.textContent ?? '').trim());

/** Expanding a parent row shows its direct children right under it. */
export const ExpandShowsChildren = {
  render: () => <SubRowTreeEnabledDefault />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(data[0].firstName);
    expect(rowFirstNames(canvasElement)).toEqual(
      data.map((person) => person.firstName),
    );
    const index = data.findIndex((person) => person.subRows.length > 0);
    const parent =
      canvasElement.querySelectorAll<HTMLElement>('tbody tr')[index]!;
    await userEvent.click(
      within(parent).getByRole('button', { name: 'Expand' }),
    );
    const children = data[index]!.subRows.map((child) => child.firstName);
    await waitFor(() =>
      expect(rowFirstNames(canvasElement)).toEqual([
        ...data.slice(0, index + 1).map((person) => person.firstName),
        ...children,
        ...data.slice(index + 1).map((person) => person.firstName),
      ]),
    );
  },
};

/** Expand all opens every level in tree order; collapse all closes them. */
export const ExpandAllCollapseAll = {
  render: () => <SubRowTreeEnabledDefault />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(data[0].firstName);
    const flat = (nodes: Node[]): string[] =>
      nodes.flatMap((node) => [node.firstName, ...flat(node.subRows ?? [])]);
    await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
    // Expanded rows paginate: the first page holds the first ten in order.
    await waitFor(() =>
      expect(rowFirstNames(canvasElement)).toEqual(flat(data).slice(0, 10)),
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Expand all' }));
    await waitFor(() =>
      expect(rowFirstNames(canvasElement)).toEqual(
        data.map((person) => person.firstName),
      ),
    );
  },
};

/** The select control (checkbox or radio) of each body row, in order. */
const selectControls = (canvasElement: HTMLElement) =>
  [
    ...canvasElement.querySelectorAll<HTMLElement>(
      'tbody td[data-flip-column="st-row-select"]',
    ),
  ].map(
    (cell) =>
      within(cell).queryByRole('checkbox') ?? within(cell).getByRole('radio'),
  );

/**
 * Opens the first parent row that has sub-rows and returns its index and the
 * number of its direct sub-rows, which then sit right under it.
 */
const expandFirstParent = async (canvasElement: HTMLElement) => {
  await within(canvasElement).findAllByText(data[0].firstName);
  const index = data.findIndex((person) => person.subRows.length > 0);
  const count = data[index]!.subRows.length;
  const parent =
    canvasElement.querySelectorAll<HTMLElement>('tbody tr')[index]!;
  await userEvent.click(within(parent).getByRole('button', { name: 'Expand' }));
  await waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(
      data.length + count,
    ),
  );
  return { count, index };
};

const isChecked = (control: HTMLElement) =>
  control.matches(':checked, [aria-checked="true"], [data-checked]');

/** The checked state of the parent and of each of its direct sub-rows. */
const parentAndSubRows = (
  canvasElement: HTMLElement,
  index: number,
  count: number,
) =>
  selectControls(canvasElement)
    .slice(index, index + count + 1)
    .map(isChecked);

// Ticking a parent ticks its sub-rows, unticking it unticks them, and ticking
// the last unticked sub-row ticks the parent (D125).
SubRowTreeWithSelection.play = async ({ canvasElement }: StoryContext) => {
  const { count, index } = await expandFirstParent(canvasElement);
  await userEvent.click(selectControls(canvasElement)[index]!);
  await waitFor(() =>
    expect(parentAndSubRows(canvasElement, index, count)).toEqual(
      Array(count + 1).fill(true),
    ),
  );
  await userEvent.click(selectControls(canvasElement)[index]!);
  await waitFor(() =>
    expect(parentAndSubRows(canvasElement, index, count)).toEqual(
      Array(count + 1).fill(false),
    ),
  );
  for (let child = 1; child <= count; child++) {
    await userEvent.click(selectControls(canvasElement)[index + child]!);
    await waitFor(() =>
      expect(parentAndSubRows(canvasElement, index, count)).toEqual([
        child === count,
        ...Array.from({ length: count }, (_, i) => i < child),
      ]),
    );
  }
};

// Without sub-row selection, ticking a parent ticks that row alone.
SubRowTreeWithSelectionNoSubRowSelection.play = async ({
  canvasElement,
}: StoryContext) => {
  const { count, index } = await expandFirstParent(canvasElement);
  await userEvent.click(selectControls(canvasElement)[index]!);
  await waitFor(() =>
    expect(parentAndSubRows(canvasElement, index, count)).toEqual([
      true,
      ...Array(count).fill(false),
    ]),
  );
};

// Single selection: one row at a time, a parent included.
SubRowTreeWithSingleSelection.play = async ({
  canvasElement,
}: StoryContext) => {
  const { count, index } = await expandFirstParent(canvasElement);
  await userEvent.click(selectControls(canvasElement)[index + 1]!);
  await waitFor(() =>
    expect(selectControls(canvasElement).map(isChecked)).toEqual(
      selectControls(canvasElement).map((_, i) => i === index + 1),
    ),
  );
  await userEvent.click(selectControls(canvasElement)[index]!);
  await waitFor(() =>
    expect(parentAndSubRows(canvasElement, index, count)).toEqual([
      true,
      ...Array(count).fill(false),
    ]),
  );
};
