import { useState } from 'react';
import { type Meta } from '@storybook/react';
import { type SRT_ColumnDef } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { makeData, type Person } from '../makeData';

const meta: Meta = {
  title: 'Features/Search Examples',
};

export default meta;

const columns: SRT_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  { accessorKey: 'age', header: 'Age' },
  { accessorKey: 'address', header: 'Address' },
  { accessorKey: 'state', header: 'State' },
  { accessorKey: 'phoneNumber', header: 'Phone Number' },
];

const data = makeData(200);

export const SearchEnabledDefault = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

export const SearchInitialState = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ globalFilter: 'John' }}
  />
);

export const SearchInitializedState = () => {
  const [globalFilter, setGlobalFilter] = useState('John');

  return (
    <ShadcnReactTable
      columns={columns}
      data={data}
      state={{ globalFilter }}
      onGlobalFilterChange={setGlobalFilter}
    />
  );
};

export const SearchContains = () => (
  <ShadcnReactTable columns={columns} data={data} globalFilterFn="contains" />
);

export const CustomGlobalFilterFn = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    filterFns={{
      myCustomFilterFn: (row, id, filterValue) =>
        row.getValue<string>(id).startsWith(filterValue),
    }}
    globalFilterFn="myCustomFilterFn"
  />
);

export const SearchGlobalFilterModes = () => (
  <ShadcnReactTable columns={columns} data={data} enableGlobalFilterModes />
);

export const SearchGlobalFilterModeOptions = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableGlobalFilterModes
    globalFilterModeOptions={['asfd', 'contains', 'fuzzy']}
  />
);

export const SearchRankedResultsEnabledByDefault = () => (
  <ShadcnReactTable columns={columns} data={data} enableRowNumbers />
);

export const SearchDisableRankedResults = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableGlobalFilterRankedResults={false}
    enableRowNumbers
  />
);

export const ShowSearchRightBoxByDefault = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
  />
);

export const ShowSearchBoxLeftByDefault = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
    positionGlobalFilter="left"
  />
);

export const ShowSearchBoxLeftByDefaultWithSelection = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableRowSelection
    initialState={{ showGlobalFilter: true }}
    positionGlobalFilter="left"
  />
);

export const JustASearchBox = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableToolbarInternalActions={false}
    initialState={{ showGlobalFilter: true }}
  />
);

export const SearchDisabled = () => (
  <ShadcnReactTable columns={columns} data={data} enableGlobalFilter={false} />
);

// API GAP: MRT customized the search field via `muiSearchTextFieldProps`
// (label / placeholder / variant). SRT has not implemented that MUI prop, so
// the customization is dropped; the search box is shown via initial state.
export const CustomizeSearchTextBox = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
  />
);
