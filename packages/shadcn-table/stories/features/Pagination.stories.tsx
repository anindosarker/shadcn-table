import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { expect, waitFor } from 'storybook/test';
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
