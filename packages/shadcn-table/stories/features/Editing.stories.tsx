import { useState } from 'react';
import { Subscribe } from '@tanstack/react-table';
import {
  type ST_Cell,
  type ST_TableOptions,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, screen, waitFor, within } from 'storybook/test';

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

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
    exitEditingMode();
  };

  return (
    <ShadcnTable
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

// The row action Edit button hands the modal the live row: the dialog opens
// with one labelled input per data column, seeded from that row.
EditingEnabledEditModeModalDefault.play = async ({
  canvas,
  userEvent,
}: StoryContext) => {
  const [firstRowEdit] = await canvas.findAllByRole('button', {
    name: 'Edit',
  });
  await userEvent.click(firstRowEdit);
  const dialog = await screen.findByRole('dialog');
  await expect(within(dialog).getAllByRole('textbox').length).toBeGreaterThan(
    0,
  );
  await expect(within(dialog).getByLabelText('First Name')).toHaveValue(
    data[0].firstName,
  );
  await userEvent.click(within(dialog).getByRole('button', { name: 'Cancel' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
};

export const EditingFeatureEnabledConditionally = () => {
  const [enabled, setEnabled] = useState(false);
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
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
    <ShadcnTable
      columns={columns}
      data={tableData}
      enableEditing={enabled}
      initialState={{
        columnOrder: ['st-row-actions', ...columns.map((c) => c.accessorKey!)],
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

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
    exitEditingMode();
  };

  return (
    <ShadcnTable
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

export const EditingValidationHelperText = () => {
  const [tableData, setTableData] = useState(() => [
    { ...data[0], firstName: '' },
    ...data.slice(1),
  ]);

  return (
    <ShadcnTable
      columns={[
        {
          accessorKey: 'firstName',
          header: 'First Name',
          // MUI TextField error/helperText: validation text under the input.
          stEditTextFieldProps: ({ cell }) => {
            const empty = !cell.getValue<string>();
            return {
              error: empty,
              helperText: empty ? 'First name is required' : undefined,
              required: true,
            };
          },
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
        },
        {
          accessorKey: 'state',
          header: 'State',
        },
      ]}
      data={tableData}
      editDisplayMode="table"
      enableEditing
      onEditingRowSave={({ exitEditingMode, row, values }) => {
        setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
        exitEditingMode();
      }}
    />
  );
};

EditingValidationHelperText.play = async ({ canvas }: StoryContext) => {
  const helper = await canvas.findByText('First name is required');
  await expect(helper).toBeVisible();
  const input = canvas.getAllByPlaceholderText('First Name')[0];
  await expect(input).toHaveAttribute('aria-invalid', 'true');
};

export const EditingEnabledEditModeRowCustomSave = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
    exitEditingMode();
  };

  return (
    <ShadcnTable
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
      renderTopToolbarCustomActions={({ table }) => (
        // The renderer runs once per toolbar render; Subscribe re-renders the
        // buttons when creatingRow changes.
        <Subscribe source={table.atoms.creatingRow}>
          {(creatingRow) =>
            creatingRow ? (
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => {}}
              >
                Save
              </Button>
            ) : (
              <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
            )
          }
        </Subscribe>
      )}
    />
  );
};

export const EditingEnabledEditModeRowVirtualized = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
    exitEditingMode();
  };

  return (
    <ShadcnTable
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
        'st-row-actions': {
          size: 100,
        },
      }}
      editDisplayMode="row"
      enableEditing
      enablePagination={false}
      enableRowSelection
      enableRowVirtualization
      stTableContainerProps={{ style: { height: 400 } }}
      onCreatingRowSave={() => {}}
      onEditingRowSave={handleSaveRow}
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

export const EditingEnabledEditModeCell = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveCell = (cell: ST_Cell<Person>, value: string) => {
    setTableData(
      tableData.map((r, i) =>
        i === cell.row.index ? { ...r, [cell.column.id]: value } : r,
      ),
    );
  };

  return (
    <ShadcnTable
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
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
      stEditTextFieldProps={({ cell }) => ({
        onBlur: (event) => {
          handleSaveCell(cell, event.target.value);
        },
      })}
    />
  );
};

export const EditingEnabledEditModeCellWithRowActions = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveCell = (cell: ST_Cell<Person>, value: string) => {
    setTableData(
      tableData.map((r, i) =>
        i === cell.row.index ? { ...r, [cell.column.id]: value } : r,
      ),
    );
  };

  return (
    <ShadcnTable
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
      stEditTextFieldProps={({ cell }) => ({
        onBlur: (event) => {
          handleSaveCell(cell, event.target.value);
        },
      })}
    />
  );
};

export const EditingEnabledEditModeTable = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveCell = (cell: ST_Cell<Person>, value: string) => {
    setTableData(
      tableData.map((r, i) =>
        i === +cell.row.index ? { ...r, [cell.column.id]: value } : r,
      ),
    );
    console.info('saved cell with value: ', value);
  };

  return (
    <ShadcnTable
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
      stEditTextFieldProps={({ cell }) => ({
        onBlur: (event) => {
          handleSaveCell(cell, event.target.value);
        },
      })}
    />
  );
};

export const EditSelectVariant = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === +row.index ? values : r)));
  };

  return (
    <ShadcnTable
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

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
  };

  return (
    <ShadcnTable
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
// ST does not expose. Ported using ST's editVariant/editSelectOptions instead.
export const EditingCustomizeInput = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
  };

  return (
    <ShadcnTable
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

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    row,
    values,
  }) => {
    setIsSaving(true);
    setTimeout(() => {
      setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
      setIsSaving(false);
    }, 1500);
  };

  return (
    <ShadcnTable
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
    <ShadcnTable
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
        const saved = {
          address: row._valuesCache.address,
          name: {
            firstName: values.firstName,
            lastName: values['name.lastName'],
          },
          phoneNumber: row._valuesCache.phoneNumber,
          state: row._valuesCache.state,
        };
        setTableData(tableData.map((r, i) => (i === row.index ? saved : r)));
      }}
    />
  );
};

export const EditingEnabledEditModeTableWithGroupedRows = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
    exitEditingMode();
  };

  return (
    <ShadcnTable
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

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
    exitEditingMode();
  };

  return (
    <ShadcnTable
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

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
    exitEditingMode();
  };

  return (
    <ShadcnTable
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

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
    exitEditingMode();
  };

  return (
    <ShadcnTable
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

export const EditingCellManualOnChange = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveCell = (cell: ST_Cell<Person>, value: string) => {
    setTableData(
      tableData.map((r, i) =>
        i === cell.row.index ? { ...r, [cell.column.id]: value } : r,
      ),
    );
  };

  return (
    <ShadcnTable
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
          stEditTextFieldProps: ({ cell }) => ({
            onBlur: (event) => {
              handleSaveCell(cell, event.target.value);
            },
            onChange: (event) =>
              console.log('state col onChange', event.target.value),
          }),
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
      stEditTextFieldProps={({ cell }) => ({
        onBlur: (event) => {
          handleSaveCell(cell, event.target.value);
        },
        onChange: (event) =>
          console.log('all col onChange', event.target.value),
      })}
    />
  );
};
