import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { CakeIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Features/Pagination Examples',
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
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
];
const data = [...Array(21)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

const moreData = [...Array(551)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

const bigData = [...Array(11_111)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
}));

export const PaginationEnabled = () => (
  <ShadcnTable columns={columns} data={data} />
);

export const PaginationCompactMoreData = () => (
  <ShadcnTable
    columns={columns}
    data={moreData}
    paginationDisplayMode="compact"
    stTableContainerProps={{
      className: 'min-h-[600px]',
    }}
  />
);

let moreDataConsoleError: ReturnType<typeof spyOn> | undefined;

PaginationCompactMoreData.beforeEach = () => {
  const spy = spyOn(console, 'error');
  moreDataConsoleError = spy;
  return () => spy.mockRestore();
};

// From the last page, a global search that leaves one page moves the table
// back to page index 0 without a console error.
PaginationCompactMoreData.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const rangeText = () =>
    canvas.getByText(
      (_, element) =>
        element?.tagName === 'SPAN' &&
        /^\d+-\d+ of \d+$/.test(element.textContent ?? ''),
    ).textContent;
  await waitFor(() => expect(rangeText()).toBe('1-10 of 551'));
  await userEvent.click(canvas.getAllByLabelText('Go to last page')[0]);
  await waitFor(() => expect(rangeText()).toBe('551-551 of 551'));
  await userEvent.click(canvas.getByLabelText('Show/Hide search'));
  await userEvent.type(
    canvas.getByPlaceholderText('Search'),
    moreData[0].address,
  );
  await waitFor(() => expect(rangeText()).toMatch(/^1-(\d+) of \1$/));
  await expect(moreDataConsoleError).not.toHaveBeenCalled();
};

export const PaginationEnabledBigData = () => (
  <ShadcnTable
    columns={columns}
    data={bigData}
    enableRowVirtualization
    initialState={{ pagination: { pageIndex: 0, pageSize: 1000 } }}
    stPaginationProps={{ rowsPerPageOptions: [100, 1000] }}
    stTableContainerProps={{
      className: 'h-[600px]',
    }}
  />
);

export const PaginationEnabledBigDataLanguage = () => (
  <ShadcnTable
    columns={columns}
    data={bigData}
    enableRowVirtualization
    localization={{
      language: navigator.language.startsWith('de') ? 'en' : 'de',
    }}
    enableRowSelection
    initialState={{ pagination: { pageIndex: 0, pageSize: 1000 } }}
    stPaginationProps={{ rowsPerPageOptions: [100, 1000] }}
    stTableContainerProps={{
      className: 'h-[600px]',
    }}
  />
);

export const PaginationEnabledNoRowsPerPage = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stPaginationProps={{
      showRowsPerPage: false,
    }}
  />
);

export const PaginationEnabledCustomizeRowsPerPage = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stPaginationProps={{
      SelectProps: {
        native: true,
      },
    }}
  />
);

export const PaginationPagesDisplayMode = () => (
  <ShadcnTable columns={columns} data={data} paginationDisplayMode="pages" />
);

export const PaginationPagesDisplayModeNoPagesPerRow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    stPaginationProps={{
      showRowsPerPage: false,
    }}
    paginationDisplayMode="pages"
  />
);

// API GAP: muiPaginationProps (shape/variant) has no ST equivalent; ported
// with paginationDisplayMode="pages" only.
export const CustomPaginationPagesDisplayMode = () => (
  <ShadcnTable columns={columns} data={data} paginationDisplayMode="pages" />
);

// API GAP: muiPaginationProps (shape/variant) has no ST equivalent; ported
// with boundaryCount + paginationDisplayMode="pages" + more data only.
export const CustomPaginationPagesDisplayModeMoreData = () => (
  <ShadcnTable
    columns={columns}
    data={moreData}
    stPaginationProps={{
      boundaryCount: 5,
    }}
    paginationDisplayMode="pages"
  />
);

export const PaginationDisabledOrOverriden = () => (
  <ShadcnTable columns={columns} data={data} enablePagination={false} />
);

// With pagination off, `manualPagination={false}` still shows every row.
export const PaginationDisabledManualPaginationFalse = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    manualPagination={false}
  />
);

PaginationDisabledManualPaginationFalse.play = async ({
  canvasElement,
}: StoryContext) => {
  await waitFor(() =>
    expect(canvasElement.querySelectorAll('tbody tr').length).toBe(data.length),
  );
};

export const PaginationPositionBottom = () => (
  <ShadcnTable columns={columns} data={data} positionPagination="bottom" />
);

export const PaginationPositionTop = () => (
  <ShadcnTable columns={columns} data={data} positionPagination="top" />
);

export const PaginationPositionTopAndBottom = () => (
  <ShadcnTable columns={columns} data={data} positionPagination="both" />
);

export const PaginationPositionTopAndBottomNoInternalActions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableToolbarInternalActions={false}
    positionPagination="both"
  />
);

export const CustomizePaginationComponents = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
    stPaginationProps={{
      rowsPerPageOptions: [5, 10, 20],
      showFirstButton: false,
      showLastButton: false,
    }}
  />
);

export const DisabledPaginationComponents = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
    stPaginationProps={{
      disabled: true,
      rowsPerPageOptions: [5, 10, 20],
      showFirstButton: false,
      showLastButton: false,
    }}
  />
);

const bodyRows = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('tbody tr');

const firstRowFirstName = (canvasElement: HTMLElement) =>
  canvasElement.querySelector(
    'tbody tr:first-child td[data-flip-column="firstName"]',
  )?.textContent;

/** Next page shows the next ten rows. */
export const NextPageChangesRows = {
  render: () => <PaginationEnabled />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(data[0].firstName);
    expect(bodyRows(canvasElement).length).toBe(10);
    await userEvent.click(canvas.getAllByLabelText('Go to next page')[0]!);
    await waitFor(() =>
      expect(firstRowFirstName(canvasElement)).toBe(data[10].firstName),
    );
    expect(bodyRows(canvasElement).length).toBe(10);
    expect(canvas.getByRole('button', { name: 'page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

/** Choosing 20 rows per page renders 20 rows. */
export const PageSizeChangesCount = {
  render: () => <CustomizePaginationComponents />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(data[0].firstName);
    expect(bodyRows(canvasElement).length).toBe(5);
    await userEvent.click(
      canvas
        .getAllByLabelText('Rows per page')
        .find((element) => element.tagName === 'BUTTON')!,
    );
    await userEvent.click(
      await within(document.body).findByRole('option', { name: '20' }),
    );
    await waitFor(() => expect(bodyRows(canvasElement).length).toBe(20));
  },
};

/**
 * Pages mode shows page numbers, the last one included (D13); clicking it
 * shows the last row alone.
 */
export const PagesModeNumbers = {
  render: () => <CustomPaginationPagesDisplayModeMoreData />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(moreData[0].firstName);
    expect(canvas.getByRole('button', { name: 'page 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      canvas.getByRole('button', { name: 'Go to page 2' }),
    ).toHaveTextContent('2');
    const last = canvas.getByRole('button', { name: 'Go to page 56' });
    await userEvent.click(last);
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'page 56' })).toHaveAttribute(
        'aria-current',
        'page',
      ),
    );
    expect(bodyRows(canvasElement).length).toBe(1);
    expect(firstRowFirstName(canvasElement)).toBe(moreData[550].firstName);
  },
};

// Fixed rows: only the first one matches the search `Liam`.
const searchData = [...Array(21)].map((_, index) => ({
  address: `${index + 1} Oak Street`,
  age: 20 + index,
  firstName: index === 0 ? 'Liam' : 'Noah',
  lastName: `Row ${index + 1}`,
}));

const footerRangeText = (canvasElement: HTMLElement) =>
  within(canvasElement).getByText(
    (_, element) =>
      element?.tagName === 'SPAN' &&
      /^\d+-\d+ of \d+$/.test(element.textContent ?? ''),
  ).textContent;

/**
 * The pages footer shows the row range (D6); a global search that leaves one
 * page shows the filtered count and a single page button.
 */
export const PagesFooterRowRange = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={searchData}
      paginationDisplayMode="pages"
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(footerRangeText(canvasElement)).toBe('1-10 of 21'),
    );
    await userEvent.click(canvas.getByLabelText('Show/Hide search'));
    await userEvent.type(canvas.getByPlaceholderText('Search'), 'Liam');
    await waitFor(() =>
      expect(footerRangeText(canvasElement)).toMatch(/^1-(\d+) of \1$/),
    );
    expect(
      canvas.getAllByRole('button', { name: /^(Go to )?page \d+$/ }),
    ).toHaveLength(1);
  },
};

/** The compact footer shows the row range and four navigation buttons (D6). */
export const CompactFooter = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      paginationDisplayMode="compact"
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(footerRangeText(canvasElement)).toBe('1-10 of 21'),
    );
    expect(
      canvas.getAllByRole('button', {
        name: /^Go to (first|previous|next|last) page$/,
      }),
    ).toHaveLength(4);
  },
};
