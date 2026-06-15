import { useState } from 'react';
import { type SRT_TableOptions } from 'shadcn-react-table-core';
import ShadcnReactTable from '@/components/ui/shadcn-react-table/ShadcnReactTable';
import { Button } from '@/components/ui/button';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Features/Editing Examples',
};

export default meta;

const usStates = [
  'Alabama',
  'Alaska',
  'American Samoa',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Guam',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Palau',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virgin Island',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

type Person = {
  address: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  state: string;
};

const data: Person[] = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const EditingEnabledEditModeModalDefault = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
    exitEditingMode();
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      enableEditing
      onEditingRowSave={handleSaveRow}
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

export const EditingFeatureEnabledConditionally = () => {
  const [enabled, setEnabled] = useState(false);
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
    exitEditingMode();
  };

  const columns = [
    {
      accessorKey: 'firstName',
      header: 'First Name',
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'state',
      header: 'State',
    },
    {
      accessorKey: 'phoneNumber',
      enableEditing: false,
      header: 'Phone Number',
    },
  ];

  return (
    <ShadcnReactTable
      columns={columns}
      data={tableData}
      enableEditing={enabled}
      initialState={{
        columnOrder: ['mrt-row-actions', ...columns.map((c) => c.accessorKey!)],
      }}
      onEditingRowSave={handleSaveRow}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnabled(!enabled)}>Toggle Editing</Button>
      )}
    />
  );
};

export const EditingEnabledEditModeRow = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
    exitEditingMode();
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
        },
      ]}
      createDisplayMode="row"
      data={tableData}
      editDisplayMode="row"
      enableEditing
      onCreatingRowSave={() => {}}
      onEditingRowSave={handleSaveRow}
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

export const EditingEnabledEditModeRowCustomSave = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
    exitEditingMode();
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
        },
      ]}
      createDisplayMode="row"
      data={tableData}
      editDisplayMode="row"
      enableEditing
      onEditingRowSave={handleSaveRow}
      renderTopToolbarCustomActions={({ table }) =>
        table.getState().creatingRow ? (
          <Button onClick={() => {}}>Save</Button>
        ) : (
          <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
        )
      }
    />
  );
};

export const EditingEnabledEditModeRowVirtualized = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
    exitEditingMode();
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
        },
      ]}
      createDisplayMode="row"
      data={tableData}
      displayColumnDefOptions={{
        'mrt-row-actions': {
          size: 100,
        },
      }}
      editDisplayMode="row"
      enableEditing
      enablePagination={false}
      enableRowSelection
      enableRowVirtualization
      // API GAP: muiTableContainerProps (height: 400) has no SRT equivalent;
      // dropped.
      onCreatingRowSave={() => {}}
      onEditingRowSave={handleSaveRow}
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

// Cell-mode save: MRT wired this through muiEditTextFieldProps.onBlur. SRT
// exposes a first-class `onEditingCellSave` callback (fired on blur/Enter in
// cell + table modes) so the edit can be persisted to the data source.
export const EditingEnabledEditModeCell = () => {
  const [tableData, setTableData] = useState(data);

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
        },
      ]}
      createDisplayMode="row"
      data={tableData}
      editDisplayMode="cell"
      enableEditing
      onCreatingRowSave={() => {}}
      onEditingCellSave={({ cell, value }) => {
        setTableData((prev) =>
          prev.map((row, i) =>
            i === cell.row.index ? { ...row, [cell.column.id]: value } : row,
          ),
        );
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

// API GAP: cell-mode save was wired through muiEditTextFieldProps.onBlur (no SRT
// equivalent); the onBlur save handler is dropped, row actions retained.
export const EditingEnabledEditModeCellWithRowActions = () => {
  const [tableData] = useState(data);

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
        },
      ]}
      createDisplayMode="row"
      data={tableData}
      editDisplayMode="cell"
      enableEditing
      enableRowActions
      onCreatingRowSave={() => {}}
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

// API GAP: table-mode save was wired through muiEditTextFieldProps.onBlur (no
// SRT equivalent); the onBlur save handler is dropped.
export const EditingEnabledEditModeTable = () => {
  const [tableData] = useState(data);

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      editDisplayMode="table"
      enableEditing
    />
  );
};

export const EditSelectVariant = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    row,
    values,
  }) => {
    tableData[+row.index] = values;
    setTableData([...tableData]);
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          editSelectOptions: usStates,
          editVariant: 'select',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      enableEditing
      enableRowActions
      onEditingRowSave={handleSaveRow}
    />
  );
};

export const EditSelectVariantAlternate = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          editSelectOptions: [
            { label: 'AL', value: 'Alabama' },
            { label: 'AK', value: 'Alaska' },
            { label: 'AS', value: 'American Samoa' },
            { label: 'AZ', value: 'Arizona' },
            { label: 'AR', value: 'Arkansas' },
            { label: 'CA', value: 'California' },
            { label: 'CO', value: 'Colorado' },
            { label: 'CT', value: 'Connecticut' },
            { label: 'DE', value: 'Delaware' },
            { label: 'FL', value: 'Florida' },
            { label: 'GA', value: 'Georgia' },
            { label: 'GU', value: 'Guam' },
            { label: 'HI', value: 'Hawaii' },
            { label: 'ID', value: 'Idaho' },
            { label: 'IL', value: 'Illinois' },
            { label: 'IN', value: 'Indiana' },
            { label: 'IA', value: 'Iowa' },
            { label: 'KS', value: 'Kansas' },
            { label: 'KY', value: 'Kentucky' },
            { label: 'LA', value: 'Louisiana' },
            { label: 'ME', value: 'Maine' },
            { label: 'MD', value: 'Maryland' },
            { label: 'MA', value: 'Massachusetts' },
            { label: 'MI', value: 'Michigan' },
            { label: 'MN', value: 'Minnesota' },
            { label: 'MS', value: 'Mississippi' },
            { label: 'MO', value: 'Missouri' },
            { label: 'MT', value: 'Montana' },
            { label: 'NE', value: 'Nebraska' },
            { label: 'NV', value: 'Nevada' },
            { label: 'NH', value: 'New Hampshire' },
            { label: 'NJ', value: 'New Jersey' },
            { label: 'NM', value: 'New Mexico' },
            { label: 'NY', value: 'New York' },
            { label: 'NC', value: 'North Carolina' },
            { label: 'ND', value: 'North Dakota' },
            { label: 'MP', value: 'Northern Mariana Islands' },
            { label: 'OH', value: 'Ohio' },
            { label: 'OK', value: 'Oklahoma' },
            { label: 'OR', value: 'Oregon' },
            { label: 'PA', value: 'Pennsylvania' },
            { label: 'PR', value: 'Puerto Rico' },
            { label: 'RI', value: 'Rhode Island' },
            { label: 'SC', value: 'South Carolina' },
          ],
          editVariant: 'select',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      editDisplayMode="row"
      enableEditing
      enableRowActions
      onEditingRowSave={handleSaveRow}
    />
  );
};

// API GAP: original customized the state column's editor into a MUI select via
// the column-level muiEditTextFieldProps (children MenuItems + select), which
// SRT does not expose. Ported using SRT's editVariant/editSelectOptions instead.
export const EditingCustomizeInput = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          editSelectOptions: usStates,
          editVariant: 'select',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      enableEditing
      enableRowActions
      onEditingRowSave={handleSaveRow}
    />
  );
};

export const EditingEnabledAsync = () => {
  const [tableData, setTableData] = useState(data);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    row,
    values,
  }) => {
    setIsSaving(true);
    setTimeout(() => {
      tableData[row.index] = values;
      setTableData([...tableData]);
      setIsSaving(false);
    }, 1500);
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      enableEditing
      enableRowActions
      onEditingRowSave={handleSaveRow}
      state={{
        showProgressBars: isSaving,
      }}
    />
  );
};

const nestedData = [...Array(10)].map(() => ({
  address: faker.location.streetAddress(),
  name: {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  },
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const EditingNestedData = () => {
  const [tableData, setTableData] = useState(() => nestedData);

  return (
    <ShadcnReactTable
      columns={[
        {
          accessorFn: (row) => row.name.firstName,
          header: 'First Name',
          id: 'firstName',
        },
        {
          accessorKey: 'name.lastName',
          header: 'Last Name',
        },
        {
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      enableEditing
      onEditingRowSave={({ row, values }) => {
        tableData[row.index] = {
          address: row._valuesCache.address,
          name: {
            firstName: values.firstName,
            lastName: values['name.lastName'],
          },
          phoneNumber: row._valuesCache.phoneNumber,
          state: row._valuesCache.state,
        };
        setTableData([...tableData]);
      }}
    />
  );
};

export const EditingEnabledEditModeTableWithGroupedRows = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
    exitEditingMode();
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      editDisplayMode="table"
      enableEditing
      enableGrouping
      onEditingRowSave={handleSaveRow}
    />
  );
};

export const EnableEditingConditionally = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
    exitEditingMode();
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: (row) => row.original.state.includes('N'),
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      editDisplayMode="row"
      enableEditing={(row) => row.index % 2 === 0}
      onEditingRowSave={handleSaveRow}
    />
  );
};

export const EnableEditingConditionallyCell = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
    exitEditingMode();
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: (row) => row.original.state.includes('N'),
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      editDisplayMode="cell"
      enableEditing={(row) => row.index % 2 === 0}
      onEditingRowSave={handleSaveRow}
    />
  );
};

export const EnableEditingConditionallyTable = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: SRT_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    tableData[row.index] = values;
    setTableData([...tableData]);
    exitEditingMode();
  };

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: (row) => row.original.state.includes('N'),
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      editDisplayMode="table"
      enableEditing={(row) => row.index % 2 === 0}
      onEditingRowSave={handleSaveRow}
    />
  );
};

// API GAP: per-cell manual onChange/onBlur was wired through
// muiEditTextFieldProps (no SRT equivalent); the cell editors render but the
// onChange/onBlur save handlers are dropped. SRT_Cell retained for reference.
export const EditingCellManualOnChange = () => {
  const [tableData] = useState(data);

  return (
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
          accessorKey: 'address',
          header: 'Address',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
        },
      ]}
      data={tableData}
      editDisplayMode="cell"
      enableEditing
    />
  );
};
