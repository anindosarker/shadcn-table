import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Pagination Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
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

export const PaginationEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} />
);

export const PaginationEnabledDefaultMoreData = () => (
  <ShadcnTable
    columns={columns}
    data={moreData}
    stTableContainerProps={{
      className: 'min-h-[600px]',
    }}
  />
);

let moreDataConsoleError: ReturnType<typeof spyOn> | undefined;

PaginationEnabledDefaultMoreData.beforeEach = () => {
  const spy = spyOn(console, 'error');
  moreDataConsoleError = spy;
  return () => spy.mockRestore();
};

// From the last page, a global search that leaves one page moves the table
// back to page index 0 without a console error.
PaginationEnabledDefaultMoreData.play = async ({
  canvasElement,
}: StoryContext) => {
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

export const PaginationEnabledDefaultBigData = () => (
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

export const PaginationEnabledDefaultBigDataLanguage = () => (
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

export const PaginationEnabledDefaultNoRowsPerPage = () => (
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
