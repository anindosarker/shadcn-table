import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

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

// API GAP: muiTableContainerProps (minHeight) has no SRT equivalent; dropped.
export const PaginationEnabledDefaultMoreData = () => (
  <ShadcnReactTable columns={columns} data={moreData} />
);

// API GAP: muiPaginationProps (rowsPerPageOptions) and muiTableContainerProps
// (height) have no SRT equivalent; ported with virtualization + initial state.
export const PaginationEnabledDefaultBigData = () => (
  <ShadcnReactTable
    columns={columns}
    data={bigData}
    enableRowVirtualization
    initialState={{ pagination: { pageIndex: 0, pageSize: 1000 } }}
  />
);

// API GAP: muiPaginationProps (rowsPerPageOptions) and muiTableContainerProps
// (height) have no SRT equivalent; ported with localization + virtualization.
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
  />
);

// API GAP: muiPaginationProps (showRowsPerPage: false) has no SRT equivalent;
// this export reduces to the default and is dropped.

// API GAP: muiPaginationProps (SelectProps.native) has no SRT equivalent;
// this export reduces to the default and is dropped.

export const PaginationPagesDisplayMode = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    paginationDisplayMode="pages"
  />
);

// API GAP: muiPaginationProps (showRowsPerPage: false) has no SRT equivalent;
// ported with paginationDisplayMode="pages" only.
export const PaginationPagesDisplayModeNoPagesPerRow = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
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

// API GAP: muiPaginationProps (boundaryCount/shape/variant) has no SRT
// equivalent; ported with paginationDisplayMode="pages" + more data only.
export const CustomPaginationPagesDisplayModeMoreData = () => (
  <ShadcnReactTable
    columns={columns}
    data={moreData}
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

// API GAP: muiPaginationProps (rowsPerPageOptions/showFirstButton/
// showLastButton) has no SRT equivalent; ported with initial page size only.
export const CustomizePaginationComponents = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
  />
);

// API GAP: muiPaginationProps (disabled/rowsPerPageOptions/showFirstButton/
// showLastButton) has no SRT equivalent; ported with initial page size only.
export const DisabledPaginationComponents = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 5 } }}
  />
);
