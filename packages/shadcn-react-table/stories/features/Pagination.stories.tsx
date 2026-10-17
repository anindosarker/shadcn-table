import { type SRT_ColumnDef } from '@/components/ui/shadcn-react-table';
import { ShadcnReactTable } from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Pagination Examples',
};

export default meta;

const columns: SRT_ColumnDef<(typeof data)[0]>[] = [
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
  <ShadcnReactTable columns={columns} data={data} />
);

export const PaginationEnabledDefaultMoreData = () => (
  <ShadcnReactTable
    columns={columns}
    data={moreData}
    srtTableContainerProps={{
      className: 'min-h-[600px]',
    }}
  />
);

export const PaginationEnabledDefaultBigData = () => (
  <ShadcnReactTable
    columns={columns}
    data={bigData}
    enableRowVirtualization
    initialState={{ pagination: { pageIndex: 0, pageSize: 1000 } }}
    srtPaginationProps={{ rowsPerPageOptions: [100, 1000] }}
    srtTableContainerProps={{
      className: 'h-[600px]',
    }}
  />
);

export const PaginationEnabledDefaultBigDataLanguage = () => (
  <ShadcnReactTable
    columns={columns}
    data={bigData}
    enableRowVirtualization
    localization={{
      language: navigator.language.startsWith('de') ? 'en' : 'de',
    }}
    enableRowSelection
    initialState={{ pagination: { pageIndex: 0, pageSize: 1000 } }}
    srtPaginationProps={{ rowsPerPageOptions: [100, 1000] }}
    srtTableContainerProps={{
      className: 'h-[600px]',
    }}
  />
);

export const PaginationEnabledDefaultNoRowsPerPage = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtPaginationProps={{
      showRowsPerPage: false,
    }}
  />
);

export const PaginationEnabledCustomizeRowsPerPage = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtPaginationProps={{
      SelectProps: {
        native: true,
      },
    }}
  />
);

export const PaginationPagesDisplayMode = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    paginationDisplayMode="pages"
  />
);

export const PaginationPagesDisplayModeNoPagesPerRow = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    srtPaginationProps={{
      showRowsPerPage: false,
    }}
    paginationDisplayMode="pages"
  />
);

// API GAP: muiPaginationProps (shape/variant) has no SRT equivalent; ported
// with paginationDisplayMode="pages" only.
export const CustomPaginationPagesDisplayMode = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    paginationDisplayMode="pages"
  />
);

// API GAP: muiPaginationProps (shape/variant) has no SRT equivalent; ported
// with boundaryCount + paginationDisplayMode="pages" + more data only.
export const CustomPaginationPagesDisplayModeMoreData = () => (
  <ShadcnReactTable
    columns={columns}
    data={moreData}
    srtPaginationProps={{
      boundaryCount: 5,
    }}
    paginationDisplayMode="pages"
  />
);

export const PaginationDisabledOrOverriden = () => (
  <ShadcnReactTable columns={columns} data={data} enablePagination={false} />
);

export const PaginationPositionBottom = () => (
  <ShadcnReactTable columns={columns} data={data} positionPagination="bottom" />
);

export const PaginationPositionTop = () => (
  <ShadcnReactTable columns={columns} data={data} positionPagination="top" />
);

export const PaginationPositionTopAndBottom = () => (
  <ShadcnReactTable columns={columns} data={data} positionPagination="both" />
);

export const PaginationPositionTopAndBottomNoInternalActions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableToolbarInternalActions={false}
    positionPagination="both"
  />
);

export const CustomizePaginationComponents = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
    srtPaginationProps={{
      rowsPerPageOptions: [5, 10, 20],
      showFirstButton: false,
      showLastButton: false,
    }}
  />
);

export const DisabledPaginationComponents = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
    srtPaginationProps={{
      disabled: true,
      rowsPerPageOptions: [5, 10, 20],
      showFirstButton: false,
      showLastButton: false,
    }}
  />
);
