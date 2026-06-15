import { useEffect, useState } from 'react';
import {
  type SRT_ColumnDef,
  type SRT_ColumnFiltersState,
} from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { Button } from '@/components/ui/button';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Filtering Examples',
};

export default meta;

const columns: SRT_ColumnDef<(typeof data)[0]>[] = [
  {
    Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
    accessorKey: 'isActive',
    header: 'Is Active',
    size: 110,
  },
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
    filterVariant: 'range',
    header: 'Age',
  },
  {
    Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
    accessorFn: (row) => new Date(row.birthDate), //transform data before processing so sorting works
    filterFn: 'lessThan',
    filterVariant: 'date',
    header: 'Birth Date',
    id: 'birthDate',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'state',
    filterSelectOptions: [
      { label: 'AL', value: 'Alabama' },
      { label: 'AZ', value: 'Arizona' },
      { label: 'CA', value: 'California' },
      { label: 'FL', value: 'Florida' },
      { label: 'GA', value: 'Georgia' },
      { label: 'NY', value: 'New York' },
      { label: 'TX', value: 'Texas' },
    ],
    filterVariant: 'multi-select',
    header: 'State',
  },
];

const data = [...Array(120)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(100),
  arrivalTime: faker.date.recent(),
  birthDate: faker.date.birthdate({ max: 2020, min: 1980, mode: 'age' }),
  departureTime: faker.date.recent(),
  firstName: faker.person.firstName(),
  gender: Math.random() < 0.8 ? faker.person.sex() : faker.person.gender(),
  hireDate: faker.date.birthdate({ max: 2024, min: 2011, mode: 'age' }),
  isActive: faker.datatype.boolean(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const FilteringEnabledDefault = () => (
  <ShadcnReactTable columns={columns} data={data} />
);

export const PopoverDisplayMode = () => (
  <ShadcnReactTable
    columnFilterDisplayMode="popover"
    columns={columns}
    data={data}
  />
);

export const PopoverDisplayModeNoSorting = () => (
  <ShadcnReactTable
    columnFilterDisplayMode="popover"
    columns={columns}
    data={data}
    enableSorting={false}
  />
);

export const ColumnFilteringDisabled = () => (
  <ShadcnReactTable columns={columns} data={data} enableColumnFilters={false} />
);

export const FilteringDisabled = () => (
  <ShadcnReactTable columns={columns} data={data} enableFilters={false} />
);

export const FilterHighlightingDisabled = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    enableFilterMatchHighlighting={false}
  />
);

export const FilterFnAndFilterVariants = () => (
  <ShadcnReactTable
    columns={[
      {
        Cell: ({ cell }) => (cell.getValue() === 'true' ? 'Yes' : 'No'),
        accessorFn: (originalRow) => (originalRow.isActive ? 'true' : 'false'),
        filterVariant: 'checkbox',
        header: 'Is Active',
        id: 'isActive',
        size: 200,
      },
      {
        accessorKey: 'firstName',
        filterFn: 'fuzzy', // default
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        filterFn: 'contains',
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        filterVariant: 'range',
        header: 'Age',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.birthDate), //transform data before processing so sorting works
        filterFn: 'lessThan',
        filterVariant: 'date',
        header: 'Birth Date',
        id: 'birthDate',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.hireDate), //transform data before processing so sorting works
        filterVariant: 'date-range',
        header: 'Hire Date',
        id: 'hireDate',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.arrivalTime), //transform data before processing so sorting works
        filterVariant: 'datetime-range',
        header: 'Arrival time',
        id: 'arrivalTime',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.departureTime), //transform data before processing so sorting works
        filterVariant: 'time-range',
        header: 'Departure Time',
        id: 'departureTime',
      },
      {
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        filterVariant: 'select',
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        filterFn: 'includesStringSensitive',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        filterSelectOptions: [
          { label: 'AL', value: 'Alabama' },
          { label: 'AZ', value: 'Arizona' },
          { label: 'CA', value: 'California' },
          { label: 'FL', value: 'Florida' },
          { label: 'GA', value: 'Georgia' },
          { label: 'NY', value: 'New York' },
          { label: 'TX', value: 'Texas' },
        ],
        filterVariant: 'multi-select',
        header: 'State',
      },
    ]}
    data={data}
    initialState={{ showColumnFilters: true }}
  />
);

export const FilterFnAndFilterVariantsFaceted = () => (
  <ShadcnReactTable
    columns={[
      {
        accessorKey: 'firstName',
        filterSelectOptions: data.map((row) => ({
          label: row.firstName.toUpperCase().split('').reverse().join(''),
          value: row.firstName,
        })), //hard coded
        filterVariant: 'autocomplete',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        filterVariant: 'autocomplete', //faceted auto generated select options
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        filterVariant: 'range-slider',
        header: 'Age',
      },
      {
        accessorKey: 'gender',
        filterVariant: 'select',
        header: 'Gender',
      },
      {
        accessorKey: 'state',
        filterVariant: 'multi-select',
        header: 'State',
      },
    ]}
    data={data}
    enableFacetedValues
    initialState={{ showColumnFilters: true }}
  />
);

export const FilteringChangeModeEnabled = () => (
  <ShadcnReactTable
    columns={[
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
        filterFn: 'between',
        header: 'Age',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.birthDate), //transform data before processing so sorting works
        filterVariant: 'date',
        header: 'Birth Date',
        id: 'birthDate',
      },
      {
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]}
    data={data}
    enableColumnFilterModes
    initialState={{ showColumnFilters: true }}
  />
);

export const FilteringChangeModeEnabledFaceted = () => (
  <ShadcnReactTable
    columns={[
      {
        accessorKey: 'firstName',
        filterFn: 'fuzzy', // default
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        filterVariant: 'autocomplete',
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        filterVariant: 'range-slider',
        header: 'Age',
      },
      {
        accessorKey: 'gender',
        filterVariant: 'select',
        header: 'Gender',
      },
      {
        accessorKey: 'state',
        filterVariant: 'multi-select',
        header: 'State',
      },
    ]}
    data={data}
    enableColumnFilterModes
    enableFacetedValues
    initialState={{ showColumnFilters: true }}
  />
);

export const FilteringChangeModeEnabledHidden = () => (
  <ShadcnReactTable
    columns={[
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
        filterFn: 'between',
        header: 'Age',
      },
      {
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]}
    data={data}
    enableColumnFilterModes
  />
);

export const DisableSomeFilterTypesForCertainColumns = () => (
  <ShadcnReactTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        columnFilterModeOptions: [
          'startsWith',
          'endsWith',
          'empty',
          'notEmpty',
        ],
        filterFn: 'startsWith',
        header: 'Last Name',
      },
      {
        accessorKey: 'age',
        header: 'Age',
      },
      {
        accessorKey: 'gender',
        columnFilterModeOptions: ['equals', 'notEquals'],
        filterFn: 'equals',
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]}
    data={data}
    enableColumnFilterModes
    initialState={{ showColumnFilters: true }}
  />
);

export const FilteringDisabledForCertainColumns = () => (
  <ShadcnReactTable
    columns={[
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
        enableColumnFilter: false,
        header: 'Age',
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        enableColumnFilter: false,
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]}
    data={data}
    initialState={{ showColumnFilters: true }}
  />
);

export const CustomFilterFunctionPerColumn = () => (
  <ShadcnReactTable
    columns={[
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
        accessorKey: 'gender',
        filterFn: (row, _columnIds, filterValue) =>
          row
            .getValue<string>('gender')
            .toLowerCase()
            .startsWith(filterValue.toLowerCase()),
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        filterFn: (row, _columnIds, filterValue) =>
          row
            .getValue<string>('state')
            .toLowerCase()
            .startsWith(filterValue.toLowerCase()),
        header: 'State',
      },
    ]}
    data={data}
    initialState={{ showColumnFilters: true }}
  />
);

export const CustomFilterFns = () => (
  <ShadcnReactTable
    columns={[
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
        accessorKey: 'gender',
        filterFn: 'customFn',
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        filterFn: 'customFn',
        header: 'State',
      },
    ]}
    data={data}
    filterFns={{
      customFn: (row, _columnIds, filterValue) => {
        console.info('customFn', row, _columnIds, filterValue);
        return row
          .getValue<string>('state')
          .toLowerCase()
          .startsWith(filterValue.toLowerCase());
      },
    }}
    initialState={{ showColumnFilters: true }}
  />
);

// API GAP: original custom Filter used MUI TextField/MenuItem; ported with a
// native <select> rendered through SRT's column-level `Filter` render prop.
export const CustomFilterComponent = () => (
  <ShadcnReactTable
    columns={[
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
        Filter: ({ header }) => (
          <select
            onChange={(e) =>
              header.column.setFilterValue(e.target.value || undefined)
            }
            style={{ width: '100%' }}
            value={(header.column.getFilterValue() as string) ?? ''}
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ),
        accessorKey: 'gender',
        filterFn: (row, _columnIds, filterValue) =>
          row.getValue<string>('gender').toLowerCase() ===
          filterValue.toLowerCase(),
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]}
    data={data}
    initialState={{ showColumnFilters: true }}
  />
);

// API GAP: muiFilterTextFieldProps (variant: 'outlined') has no SRT equivalent;
// ported with the select filter variant only.
export const CustomizeFilterTextFields = () => (
  <ShadcnReactTable
    columns={[
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
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        filterVariant: 'select',
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]}
    data={data}
    initialState={{ showColumnFilters: true }}
  />
);

export const ManualFiltering = () => {
  const [rows, setRows] = useState(() => [...data]);
  const [columnFilters, setColumnFilters] = useState<SRT_ColumnFiltersState>(
    [],
  );

  //this kind of logic would actually live on a server, not client-side
  useEffect(() => {
    if (columnFilters?.length) {
      let filteredRows = [...data];
      columnFilters.map((filter) => {
        const { id: columnId, value: filterValue } = filter;
        filteredRows = filteredRows.filter((row) => {
          return row[columnId as keyof typeof row]
            ?.toString()
            ?.toLowerCase()
            ?.includes?.((filterValue as string).toLowerCase());
        });
      });
      setRows(filteredRows);
    } else {
      setRows([...data]);
    }
  }, [columnFilters]);

  return (
    <ShadcnReactTable
      columnFilterModeOptions={null}
      columns={columns}
      data={rows}
      manualFiltering
      onColumnFiltersChange={setColumnFilters}
      state={{ columnFilters }}
    />
  );
};

export const ExternalSetFilterValue = () => (
  <ShadcnReactTable
    columns={columns}
    data={data}
    initialState={{ showColumnFilters: true }}
    renderTopToolbarCustomActions={({ table }) => (
      <div>
        <Button
          onClick={() =>
            table.setColumnFilters((prev) => [
              ...prev,
              { id: 'firstName', value: 'Joe' },
            ])
          }
        >
          Find Joes
        </Button>
        <Button
          onClick={() =>
            table.setColumnFilters((prev) => [
              ...prev,
              { id: 'age', value: [18, 25] },
            ])
          }
        >
          Find 18-25 Age Range
        </Button>
        <Button onClick={() => table.resetColumnFilters()}>
          Reset Filters
        </Button>
      </div>
    )}
  />
);

export const InitialFilters = () => (
  <ShadcnReactTable
    columns={[
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
        filterFn: 'between',
        header: 'Age',
      },
      {
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        header: 'Gender',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
    ]}
    data={data}
    enableColumnFilterModes
    initialState={{
      columnFilters: [
        { id: 'firstName', value: 'Jo' },
        { id: 'age', value: [18, 100] },
      ],
    }}
  />
);
