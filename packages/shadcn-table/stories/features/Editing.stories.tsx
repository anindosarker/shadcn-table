import { type ReactNode, useMemo, useState } from 'react';
import { Subscribe } from '@tanstack/react-table';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  type ST_Cell,
  type ST_ColumnDef,
  type ST_Row,
  type ST_TableOptions,
  ST_EditActionButtons,
  ST_Tooltip,
  ShadcnTable,
  createRow,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import {
  Building2Icon,
  HashIcon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  Pencil,
  PencilIcon,
  PhoneIcon,
  Trash2,
  Trash2Icon,
  UserIcon,
  UserPlusIcon,
} from 'lucide-react';
import { ST_BASE } from '../../.storybook/themes';

const meta: Meta = {
  title: 'Features/Editing',
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
          icon: PhoneIcon,
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
      icon: UserIcon,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      icon: UserIcon,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      icon: MapPinIcon,
    },
    {
      accessorKey: 'state',
      header: 'State',
      icon: MapIcon,
    },
    {
      accessorKey: 'phoneNumber',
      enableEditing: false,
      header: 'Phone Number',
      icon: PhoneIcon,
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

/**
 * Row mode: Cancel throws the typed value away and the row shows its old
 * value; Save keeps the typed value.
 */
export const EditingEnabledEditModeRow = {
  render: function EditingEnabledEditModeRowStory() {
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
            icon: UserIcon,
          },
          {
            accessorKey: 'lastName',
            header: 'Last Name',
            icon: UserIcon,
          },
          {
            accessorKey: 'address',
            header: 'Address',
            icon: MapPinIcon,
          },
          {
            accessorKey: 'state',
            header: 'State',
            icon: MapIcon,
          },
          {
            accessorKey: 'phoneNumber',
            enableEditing: false,
            header: 'Phone Number',
            icon: PhoneIcon,
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
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(data[0].firstName);
    const edit = async () => {
      const [firstRowEdit] = canvas.getAllByRole('button', { name: 'Edit' });
      await userEvent.click(firstRowEdit!);
      const input = await within(firstNameCell(canvasElement)).findByRole(
        'textbox',
      );
      await userEvent.clear(input);
      await userEvent.type(input, 'Zelda');
    };
    await edit();
    await userEvent.click(canvas.getByRole('button', { name: 'Cancel' }));
    await waitFor(() =>
      expect(
        within(firstNameCell(canvasElement)).queryByRole('textbox'),
      ).toBeNull(),
    );
    expect(firstNameCell(canvasElement)).toHaveTextContent(data[0].firstName);

    await edit();
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(firstNameCell(canvasElement)).toHaveTextContent(/^Zelda$/),
    );
  },
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
          icon: UserIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
          icon: PhoneIcon,
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

/** Cell mode: double click, type, blur; the cell shows the new value. */
export const EditingEnabledEditModeCell = {
  render: function EditingEnabledEditModeCellStory() {
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
            icon: UserIcon,
          },
          {
            accessorKey: 'lastName',
            header: 'Last Name',
            icon: UserIcon,
          },
          {
            accessorKey: 'address',
            header: 'Address',
            icon: MapPinIcon,
          },
          {
            accessorKey: 'state',
            header: 'State',
            icon: MapIcon,
          },
          {
            accessorKey: 'phoneNumber',
            enableEditing: false,
            header: 'Phone Number',
            icon: PhoneIcon,
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
  },
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(data[0].firstName);
    await userEvent.dblClick(firstNameCell(canvasElement));
    const input = await within(firstNameCell(canvasElement)).findByRole(
      'textbox',
    );
    await userEvent.clear(input);
    await userEvent.type(input, 'Zelda');
    input.blur();
    await waitFor(() =>
      expect(
        within(firstNameCell(canvasElement)).queryByRole('textbox'),
      ).toBeNull(),
    );
    expect(firstNameCell(canvasElement)).toHaveTextContent(/^Zelda$/);
  },
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          editSelectOptions: usStates,
          editVariant: 'select',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
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
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          editSelectOptions: usStates,
          editVariant: 'select',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
          id: 'firstName',
        },
        {
          accessorKey: 'name.lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: (row) => row.original.state.includes('N'),
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: (row) => row.original.state.includes('N'),
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: (row) => row.original.state.includes('N'),
          header: 'Phone Number',
          icon: PhoneIcon,
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
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address',
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
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
          icon: PhoneIcon,
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

const firstNameCell = (canvasElement: HTMLElement) =>
  canvasElement.querySelector<HTMLElement>(
    'tbody tr:first-child td[data-flip-column="firstName"]',
  )!;

/** Modal mode: the dialog's Save writes the typed value into the row. */
export const ModalEditSaves = {
  render: () => <EditingEnabledEditModeModalDefault />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(data[0].firstName);
    const [firstRowEdit] = canvas.getAllByRole('button', { name: 'Edit' });
    await userEvent.click(firstRowEdit!);
    const dialog = await screen.findByRole('dialog');
    const input = within(dialog).getByLabelText('First Name');
    await userEvent.clear(input);
    await userEvent.type(input, 'Zelda');
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(firstNameCell(canvasElement)).toHaveTextContent(/^Zelda$/);
  },
};

// The exact stories of the docs examples editing-crud, editing-crud-inline-row,
// editing-crud-inline-cell, editing-crud-inline-table and editing-crud-tree:
// the same columns, options and data. Each story gets its own QueryClient, so
// one story's edits never show in another. The docs examples confirm a delete
// in the docs app's AlertDialog; the library ships no AlertDialog, so these
// stories ask the same question with the same buttons under the table.

function WithQueryClient({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

/**
 * The Save button's disabled state on every base: React Aria's Button reads
 * `isDisabled`, the others the native `disabled`.
 */
const disabledProps = (disabled: boolean) =>
  ST_BASE === 'aria' ? { isDisabled: disabled } : { disabled };

function DeleteUserConfirm({
  onCancel,
  onDelete,
  open,
}: {
  onCancel: () => void;
  onDelete: () => void;
  open: boolean;
}) {
  if (!open) return null;
  return (
    <div
      aria-label="Are you sure you want to delete this user?"
      className="mt-4 flex flex-col gap-4 rounded-lg border p-4"
      role="alertdialog"
    >
      <p className="font-medium">Are you sure you want to delete this user?</p>
      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button onClick={onDelete} variant="destructive">
          Delete
        </Button>
      </div>
    </div>
  );
}

//CREATE hook (post new user to api)
function useCreateCrudUser() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CrudUser>({
    mutationFn: async () => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo: CrudUser) => {
      queryClient.setQueryData(
        ['users'],
        (prevUsers: CrudUser[]) =>
          [
            ...prevUsers,
            {
              ...newUserInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as CrudUser[],
      );
    },
  });
}

//READ hook (get users from api)
function useGetCrudUsers() {
  return useQuery<CrudUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(crudUsers);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateCrudUser() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CrudUser>({
    mutationFn: async () => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo: CrudUser) => {
      queryClient.setQueryData(['users'], (prevUsers: CrudUser[]) =>
        prevUsers?.map((prevUser: CrudUser) =>
          prevUser.id === newUserInfo.id ? newUserInfo : prevUser,
        ),
      );
    },
  });
}

//UPDATE hook (put users in api), for the inline cell and table stories
function useUpdateCrudUsers() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, CrudUser[]>({
    mutationFn: async () => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUsers: CrudUser[]) => {
      queryClient.setQueryData(['users'], (prevUsers: CrudUser[]) =>
        prevUsers?.map((user: CrudUser) => {
          const newUser = newUsers.find((u) => u.id === user.id);
          return newUser ? newUser : user;
        }),
      );
    },
  });
}

//DELETE hook (delete user in api)
function useDeleteCrudUser() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async () => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId: string) => {
      queryClient.setQueryData(['users'], (prevUsers: CrudUser[]) =>
        prevUsers?.filter((user: CrudUser) => user.id !== userId),
      );
    },
  });
}

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );

function validateCrudUser(user: CrudUser) {
  return {
    firstName: !validateRequired(user.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
    email: !validateEmail(user.email) ? 'Incorrect Email Format' : '',
  };
}

/** The columns of the modal and row examples: errors keyed by column. */
const useCrudColumns = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<ST_ColumnDef<CrudUser>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        header: 'Id',
        enableEditing: false,
        size: 110,
      },
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
        stEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
        stEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        icon: MailIcon,
        header: 'Email',
        stEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
        editVariant: 'select',
        editSelectOptions: crudUsStates,
        stEditTextFieldProps: {
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );
  return { columns, setValidationErrors };
};

/** The modal (editing-crud) and row (editing-crud-inline-row) examples. */
const CrudRowOrModalTable = ({ mode }: { mode: 'modal' | 'row' }) => {
  const { columns, setValidationErrors } = useCrudColumns();

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateCrudUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetCrudUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateCrudUser();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteCrudUser();

  //CREATE action
  const handleCreateUser: ST_TableOptions<CrudUser>['onCreatingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateCrudUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createUser(values);
      table.setCreatingRow(null); //exit creating mode
    };

  //UPDATE action
  const handleSaveUser: ST_TableOptions<CrudUser>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateCrudUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const [deletingRow, setDeletingRow] = useState<ST_Row<CrudUser> | null>(null);
  const openDeleteConfirmModal = (row: ST_Row<CrudUser>) => setDeletingRow(row);

  const table = useShadcnTable<CrudUser>({
    columns,
    data: fetchedUsers,
    createDisplayMode: mode,
    editDisplayMode: mode,
    enableEditing: true,
    positionActionsColumn: 'first',
    getRowId: (row) => row.id,
    stToolbarAlertBannerProps: isLoadingUsersError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    stTableContainerProps: {
      className: 'min-h-[500px]',
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    //optionally customize modal content (the modal example only)
    ...(mode === 'modal'
      ? {
          renderCreateRowDialogContent: ({ row, internalEditComponents }) => (
            <>
              <DialogTitle>Create New User</DialogTitle>
              <div className="flex flex-col gap-4">
                {internalEditComponents}
              </div>
              <DialogFooter>
                <ST_EditActionButtons variant="text" row={row} />
              </DialogFooter>
            </>
          ),
          renderEditRowDialogContent: ({ row, internalEditComponents }) => (
            <>
              <DialogTitle>Edit User</DialogTitle>
              <div className="flex flex-col gap-6">
                {internalEditComponents}
              </div>
              <DialogFooter>
                <ST_EditActionButtons variant="text" row={row} />
              </DialogFooter>
            </>
          ),
        }
      : {}),
    renderRowActions: ({ row, table }) => (
      <div className="flex gap-4">
        <ST_Tooltip title="Edit">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.setEditingRow(row)}
          >
            <Pencil />
          </Button>
        </ST_Tooltip>
        <ST_Tooltip title="Delete">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <Trash2 />
          </Button>
        </ST_Tooltip>
      </div>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
        }}
      >
        Create New User
      </Button>
    ),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return (
    <>
      <ShadcnTable table={table} />
      <DeleteUserConfirm
        onCancel={() => setDeletingRow(null)}
        onDelete={() => {
          if (deletingRow) deleteUser(deletingRow.original.id);
          setDeletingRow(null);
        }}
        open={!!deletingRow}
      />
    </>
  );
};

/** The cell (editing-crud-inline-cell) and table (editing-crud-inline-table) examples. */
const CrudCellOrTableTable = ({ mode }: { mode: 'cell' | 'table' }) => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  //keep track of rows that have been edited
  const [editedUsers, setEditedUsers] = useState<Record<string, CrudUser>>({});

  const columns = useMemo<ST_ColumnDef<CrudUser>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        header: 'Id',
        enableEditing: false,
        size: 110,
      },
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
        stEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
        stEditTextFieldProps: ({ cell, row }) => ({
          type: 'text',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'email',
        icon: MailIcon,
        header: 'Email',
        stEditTextFieldProps: ({ cell, row }) => ({
          type: 'email',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited user in state to be saved later
          onBlur: (event) => {
            const validationError = !validateEmail(event.currentTarget.value)
              ? 'Incorrect Email Format'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedUsers({ ...editedUsers, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
        editVariant: 'select',
        editSelectOptions: crudUsStates,
        stEditTextFieldProps: ({ row }) => ({
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
          onChange: (event) =>
            setEditedUsers({
              ...editedUsers,
              [row.id]: { ...row.original, state: event.target.value },
            }),
        }),
      },
    ],
    [editedUsers, validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateCrudUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetCrudUsers();
  //call UPDATE hook
  const { mutateAsync: updateUsers, isPending: isUpdatingUsers } =
    useUpdateCrudUsers();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteCrudUser();

  //CREATE action
  const handleCreateUser: ST_TableOptions<CrudUser>['onCreatingRowSave'] =
    async ({ values, table }) => {
      const newValidationErrors = validateCrudUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createUser(values);
      table.setCreatingRow(null); //exit creating mode
    };

  //UPDATE action
  const handleSaveUsers = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updateUsers(Object.values(editedUsers));
    setEditedUsers({});
  };

  //DELETE action
  const [deletingRow, setDeletingRow] = useState<ST_Row<CrudUser> | null>(null);
  const openDeleteConfirmModal = (row: ST_Row<CrudUser>) => setDeletingRow(row);

  const table = useShadcnTable<CrudUser>({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: mode,
    ...(mode === 'cell'
      ? {
          enableCellActions: true,
          enableClickToCopy: 'context-menu' as const,
          enableColumnPinning: true,
        }
      : {}),
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'first',
    getRowId: (row) => row.id,
    stToolbarAlertBannerProps: isLoadingUsersError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    stTableContainerProps: {
      className: 'min-h-[500px]',
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    renderRowActions: ({ row }) => (
      <div className="flex gap-4">
        <ST_Tooltip title="Delete">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <Trash2 />
          </Button>
        </ST_Tooltip>
      </div>
    ),
    renderBottomToolbarCustomActions: () => (
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSaveUsers}
          {...disabledProps(
            Object.keys(editedUsers).length === 0 ||
              Object.values(validationErrors).some((error) => !!error),
          )}
        >
          {isUpdatingUsers ? <Spinner /> : 'Save'}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <p className="text-destructive">Fix errors before submitting</p>
        )}
      </div>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
        }}
      >
        Create New User
      </Button>
    ),
    ...(mode === 'cell'
      ? {
          initialState: {
            columnPinning: {
              start: [],
              end: ['st-row-actions'],
            },
          },
        }
      : {}),
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUsers || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return (
    <>
      <ShadcnTable table={table} />
      <DeleteUserConfirm
        onCancel={() => setDeletingRow(null)}
        onDelete={() => {
          if (deletingRow) deleteUser(deletingRow.original.id);
          setDeletingRow(null);
        }}
        open={!!deletingRow}
      />
    </>
  );
};

type CrudUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state: string;
};

const crudUsers: CrudUser[] = [
  {
    id: '9s41rp',
    firstName: 'Kelvin',
    lastName: 'Langosh',
    email: 'Jerod14@hotmail.com',
    state: 'Ohio',
  },
  {
    id: '08m6rx',
    firstName: 'Molly',
    lastName: 'Purdy',
    email: 'Hugh.Dach79@hotmail.com',
    state: 'Rhode Island',
  },
  {
    id: '5ymtrc',
    firstName: 'Henry',
    lastName: 'Lynch',
    email: 'Camden.Macejkovic@yahoo.com',
    state: 'California',
  },
  {
    id: 'ek5b97',
    firstName: 'Glenda',
    lastName: 'Douglas',
    email: 'Eric0@yahoo.com',
    state: 'Montana',
  },
  {
    id: 'xxtydd',
    firstName: 'Leone',
    lastName: 'Williamson',
    email: 'Ericka_Mueller52@yahoo.com',
    state: 'Colorado',
  },
  {
    id: 'wzxj9m',
    firstName: 'Mckenna',
    lastName: 'Friesen',
    email: 'Veda_Feeney@yahoo.com',
    state: 'New York',
  },
  {
    id: '21dwtz',
    firstName: 'Wyman',
    lastName: 'Jast',
    email: 'Melvin.Pacocha@yahoo.com',
    state: 'Montana',
  },
  {
    id: 'o8oe4k',
    firstName: 'Janick',
    lastName: 'Willms',
    email: 'Delfina12@gmail.com',
    state: 'Nebraska',
  },
];

const crudUsStates = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
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
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Puerto Rico',
];

type TreeUser = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  state: string;
  managerId: string | null;
  subRows?: TreeUser[];
};

const treeUsers: TreeUser[] = [
  {
    id: '1',
    firstName: 'Dylan',
    lastName: 'Murray',
    city: 'East Daphne',
    state: 'Kentucky',
    managerId: null,
    subRows: [
      {
        id: '1.1',
        firstName: 'Ervin',
        lastName: 'Reinger',
        city: 'South Linda',
        state: 'West Virginia',
        managerId: '1',
        subRows: [
          {
            id: '1.1.1',
            firstName: 'Jordane',
            lastName: 'Homenick',
            city: 'South Linda',
            state: 'West Virginia',
            managerId: '1.1',
          },
          {
            id: '1.1.2',
            firstName: 'Jordan',
            lastName: 'Clarkson',
            city: 'San Francisco',
            state: 'California',
            managerId: '1.1',
          },
        ],
      },
      {
        id: '1.2',
        firstName: 'Brittany',
        lastName: 'McCullough',
        city: 'Lincoln',
        state: 'Nebraska',
        managerId: '1',
      },
    ],
  },
  {
    id: '2',
    firstName: 'Raquel',
    lastName: 'Kohler',
    city: 'Columbus',
    state: 'Ohio',
    managerId: null,
    subRows: [
      {
        id: '2.1',
        firstName: 'Branson',
        lastName: 'Frami',
        city: 'Charleston',
        state: 'South Carolina',
        managerId: '2',
      },
    ],
  },
  {
    id: '3',
    firstName: 'Jordon',
    lastName: 'Harris',
    city: 'Perth',
    state: 'Western Australia',
    managerId: null,
    subRows: [
      {
        id: '3.1',
        firstName: 'Eldora',
        lastName: 'Koch',
        city: 'Perth',
        state: 'Western Australia',
        managerId: '3',
      },
      {
        id: '3.2',
        firstName: 'Glenn',
        lastName: 'Crist',
        city: 'Darwin',
        state: 'Northern Territory',
        managerId: '3',
      },
    ],
  },
];

const treeUsStates = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
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
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Puerto Rico',
  'Western Australia',
  'Northern Territory',
  'South Australia',
  'Queensland',
];

function findTreeUser(
  managerId: string | null,
  users: TreeUser[],
): TreeUser | null {
  for (let i = 0; i < users.length; i++) {
    if (users[i]!.id === managerId) {
      return users[i]!;
    }
    if (users[i]!.subRows) {
      const found = findTreeUser(managerId, users[i]!.subRows!);
      if (found) return found;
    }
  }
  return null;
}

//CREATE hook (post new user to api)
function useCreateTreeUser() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, TreeUser>({
    mutationFn: async () => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo: TreeUser) => {
      queryClient.setQueryData(['users'], (_prevUsers: TreeUser[]) => {
        const prevUsers: TreeUser[] = JSON.parse(JSON.stringify(_prevUsers));
        newUserInfo.subRows = [];
        if (newUserInfo.managerId) {
          const manager = findTreeUser(newUserInfo.managerId, prevUsers);
          if (manager) {
            manager.subRows = [
              ...(manager.subRows || []),
              {
                ...newUserInfo,
                id: `${manager.id}.${(manager.subRows?.length || 0) + 1}`,
              },
            ];
          }
        } else {
          prevUsers.push({
            ...newUserInfo,
            id: `${prevUsers.length + 1}`,
          });
        }
        return [...prevUsers];
      });
    },
  });
}

//READ hook (get users from api)
function useGetTreeUsers() {
  return useQuery<TreeUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(treeUsers);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put user in api)
function useUpdateTreeUser() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, TreeUser>({
    mutationFn: async () => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newUserInfo: TreeUser) => {
      queryClient.setQueryData(['users'], (prevUsers: TreeUser[]) => {
        const newUsers: TreeUser[] = JSON.parse(JSON.stringify(prevUsers));
        const user = findTreeUser(newUserInfo.id, newUsers);
        if (user) Object.assign(user, newUserInfo);
        return newUsers;
      });
    },
  });
}

//DELETE hook (delete user in api)
function useDeleteTreeUser() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async () => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (userId: string) => {
      queryClient.setQueryData(['users'], (prevUsers: TreeUser[]) => {
        const newUsers: TreeUser[] = JSON.parse(JSON.stringify(prevUsers));
        //remove user
        const user = findTreeUser(userId, newUsers);
        if (user) {
          const manager = findTreeUser(user.managerId, newUsers);
          if (manager) {
            manager.subRows = manager.subRows?.filter(
              (subUser) => subUser.id !== user.id,
            );
          } else {
            return newUsers.filter((user) => user.id !== userId);
          }
        }
        return [...newUsers];
      });
    },
  });
}

function validateTreeUser(user: TreeUser) {
  return {
    firstName: !validateRequired(user.firstName)
      ? 'First Name is Required'
      : '',
    lastName: !validateRequired(user.lastName) ? 'Last Name is Required' : '',
  };
}

/** The editing-crud-tree example. */
const CrudTreeTable = () => {
  const [creatingRowIndex, setCreatingRowIndex] = useState<
    number | undefined
  >();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<ST_ColumnDef<TreeUser>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        header: 'Id',
        enableEditing: false,
        size: 110,
      },
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
        stEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.firstName,
          helperText: validationErrors?.firstName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
          //optionally add validation checking for onBlur or onChange
        },
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
        stEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.lastName,
          helperText: validationErrors?.lastName,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
        stEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.city,
          helperText: validationErrors?.city,
          //remove any previous validation errors when user focuses on the input
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              city: undefined,
            }),
        },
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
        editVariant: 'select',
        editSelectOptions: treeUsStates,
        stEditTextFieldProps: {
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
        },
      },
    ],
    [validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createUser, isPending: isCreatingUser } =
    useCreateTreeUser();
  //call READ hook
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useGetTreeUsers();
  //call UPDATE hook
  const { mutateAsync: updateUser, isPending: isUpdatingUser } =
    useUpdateTreeUser();
  //call DELETE hook
  const { mutateAsync: deleteUser, isPending: isDeletingUser } =
    useDeleteTreeUser();

  //CREATE action
  const handleCreateUser: ST_TableOptions<TreeUser>['onCreatingRowSave'] =
    async ({ values, row, table }) => {
      const newValidationErrors = validateTreeUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createUser({ ...values, managerId: row.original.managerId });
      table.setCreatingRow(null); //exit creating mode
    };

  //UPDATE action
  const handleSaveUser: ST_TableOptions<TreeUser>['onEditingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateTreeUser(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateUser(values);
    table.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const [deletingRow, setDeletingRow] = useState<ST_Row<TreeUser> | null>(null);
  const openDeleteConfirmModal = (row: ST_Row<TreeUser>) => setDeletingRow(row);

  const table = useShadcnTable({
    columns,
    data: fetchedUsers,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'row', // ('modal', 'cell', 'table', and 'custom' are also available)
    enableColumnPinning: true,
    enableEditing: true,
    positionActionsColumn: 'first',
    enableExpanding: true,
    positionCreatingRow: creatingRowIndex, //index where new row is inserted before
    getRowId: (row) => row.id,
    stToolbarAlertBannerProps: isLoadingUsersError
      ? {
          className: 'border-destructive text-destructive',
          children: 'Error loading data',
        }
      : undefined,
    stTableContainerProps: {
      className: 'min-h-[500px]',
    },
    stTableBodyRowProps: ({ row }) => ({
      //conditional styling based on row depth
      className:
        row.depth === 0
          ? '[&>td]:bg-muted/20'
          : row.depth === 1
            ? '[&>td]:bg-muted/50'
            : '[&>td]:bg-muted',
    }),
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    renderRowActions: ({ row, staticRowIndex, table }) => (
      <div className="flex gap-4">
        <ST_Tooltip title="Edit">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.setEditingRow(row)}
          >
            <PencilIcon />
          </Button>
        </ST_Tooltip>
        <ST_Tooltip title="Delete">
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => openDeleteConfirmModal(row)}
          >
            <Trash2Icon />
          </Button>
        </ST_Tooltip>
        <ST_Tooltip title="Add Subordinate">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setCreatingRowIndex((staticRowIndex || 0) + 1);
              table.setCreatingRow(
                createRow(
                  table,
                  {
                    id: null!,
                    firstName: '',
                    lastName: '',
                    city: '',
                    state: '',
                    managerId: row.id,
                    subRows: [],
                  },
                  -1,
                  row.depth + 1,
                ),
              );
            }}
          >
            <UserPlusIcon />
          </Button>
        </ST_Tooltip>
      </div>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          setCreatingRowIndex(table.getRowModel().rows.length); //create new row at bottom of table
          table.setCreatingRow(true);
        }}
      >
        <UserPlusIcon />
        Create New User
      </Button>
    ),
    initialState: {
      columnPinning: { start: ['st-row-actions'], end: [] },
      expanded: true,
      pagination: { pageSize: 20, pageIndex: 0 },
    },
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
    },
  });

  return (
    <>
      <ShadcnTable table={table} />
      <DeleteUserConfirm
        onCancel={() => setDeletingRow(null)}
        onDelete={() => {
          if (deletingRow) deleteUser(deletingRow.original.id);
          setDeletingRow(null);
        }}
        open={!!deletingRow}
      />
    </>
  );
};

/** A disabled button: the `disabled` attribute, or React Aria's data mark. */
const isDisabled = (button: HTMLElement) =>
  button.hasAttribute('disabled') || button.hasAttribute('data-disabled');

/** Waits out the examples' one second fake fetch. */
const slow = { timeout: 5000 };

/** The cell of one column in the row whose Id cell reads `rowId`. */
const crudCell = (canvasElement: HTMLElement, rowId: string, column: string) =>
  [...canvasElement.querySelectorAll<HTMLElement>('tbody tr')]
    .find(
      (tr) =>
        tr.querySelector('td[data-flip-column="id"]')?.textContent?.trim() ===
        rowId,
    )
    ?.querySelector<HTMLElement>(`td[data-flip-column="${column}"]`);

/** The docs example editing-crud: create and edit in a dialog. */
export const EditingCrud = {
  name: 'Editing CRUD',
  render: () => (
    <WithQueryClient>
      <CrudRowOrModalTable mode="modal" />
    </WithQueryClient>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Kelvin', {}, slow);
    const [firstRowEdit] = canvas.getAllByRole('button', { name: 'Edit' });
    await userEvent.click(firstRowEdit!);
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Edit User')).toBeInTheDocument();
    await userEvent.clear(within(dialog).getByLabelText(/First Name/));
    await userEvent.click(within(dialog).getByRole('button', { name: 'Save' }));
    await within(dialog).findByText('First Name is Required');
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Cancel' }),
    );
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());

    await userEvent.click(
      canvas.getByRole('button', { name: 'Create New User' }),
    );
    const createDialog = await screen.findByRole('dialog');
    await waitFor(() =>
      expect(within(createDialog).getByText('Create New User')).toBeVisible(),
    );
    expect(within(createDialog).getByLabelText(/First Name/)).toHaveValue('');
  },
};

/** The docs example editing-crud-inline-row: edit and create in the row. */
export const InlineEditing = {
  render: () => (
    <WithQueryClient>
      <CrudRowOrModalTable mode="row" />
    </WithQueryClient>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Kelvin', {}, slow);
    const [firstRowEdit] = canvas.getAllByRole('button', { name: 'Edit' });
    await userEvent.click(firstRowEdit!);
    const input = await within(
      crudCell(canvasElement, '9s41rp', 'firstName')!,
    ).findByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'Kevin');
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await waitFor(
      () =>
        expect(
          crudCell(canvasElement, '9s41rp', 'firstName'),
        ).toHaveTextContent(/^Kevin$/),
      slow,
    );

    await userEvent.click(
      canvas.getByRole('button', { name: 'Create New User' }),
    );
    // The new row opens at the top, its inputs empty.
    const firstRow = canvasElement.querySelector('tbody tr')!;
    await waitFor(() =>
      expect(
        within(firstRow as HTMLElement).getAllByRole('textbox')[0],
      ).toHaveValue(''),
    );
  },
};

/** The docs example editing-crud-inline-cell: edit cells, save in a batch. */
export const EditingCrudInlineCell = {
  name: 'Editing CRUD Inline Cell',
  render: () => (
    <WithQueryClient>
      <CrudCellOrTableTable mode="cell" />
    </WithQueryClient>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Kelvin', {}, slow);
    const save = canvas.getByRole('button', { name: 'Save' });
    expect(isDisabled(save)).toBe(true);
    await userEvent.dblClick(crudCell(canvasElement, '9s41rp', 'firstName')!);
    const input = await within(
      crudCell(canvasElement, '9s41rp', 'firstName')!,
    ).findByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'Kevin{Enter}');
    await waitFor(() =>
      expect(crudCell(canvasElement, '9s41rp', 'firstName')).toHaveTextContent(
        /^Kevin$/,
      ),
    );
    await waitFor(() => expect(isDisabled(save)).toBe(false));
    await userEvent.click(save);
    await waitFor(() => expect(isDisabled(save)).toBe(true), slow);
    expect(crudCell(canvasElement, '9s41rp', 'firstName')).toHaveTextContent(
      /^Kevin$/,
    );
  },
};

/** The docs example editing-crud-inline-table: every cell is an input. */
export const EditingCrudInlineTable = {
  name: 'Editing CRUD Inline Table',
  render: () => (
    <WithQueryClient>
      <CrudCellOrTableTable mode="table" />
    </WithQueryClient>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const input = await within(
      await waitFor(() => {
        const cell = crudCell(canvasElement, '9s41rp', 'firstName');
        expect(cell).toBeTruthy();
        return cell!;
      }, slow),
    ).findByRole('textbox');
    expect(input).toHaveValue('Kelvin');
    await userEvent.clear(input);
    await userEvent.type(input, 'Kevin');
    input.blur();
    const save = canvas.getByRole('button', { name: 'Save' });
    await waitFor(() => expect(isDisabled(save)).toBe(false));
    await userEvent.click(save);
    await waitFor(() => expect(isDisabled(save)).toBe(true), slow);
    expect(
      within(crudCell(canvasElement, '9s41rp', 'firstName')!).getByRole(
        'textbox',
      ),
    ).toHaveValue('Kevin');

    const [firstRowDelete] = canvas.getAllByRole('button', { name: 'Delete' });
    await userEvent.click(firstRowDelete!);
    const confirm = await canvas.findByRole('alertdialog');
    await userEvent.click(
      within(confirm).getByRole('button', { name: 'Delete' }),
    );
    await waitFor(() =>
      expect(crudCell(canvasElement, '9s41rp', 'firstName')).toBeUndefined(),
    );
  },
};

/** The docs example editing-crud-tree: edit a tree of managers. */
export const EditingCrudTree = {
  name: 'Editing CRUD Tree',
  render: () => (
    <WithQueryClient>
      <CrudTreeTable />
    </WithQueryClient>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Dylan', {}, slow);
    // Every row starts expanded: row 1's sub-row shows.
    expect(canvas.getByText('Ervin')).toBeVisible();
    const rowOne = crudCell(canvasElement, '1', 'id')!.closest('tr')!;
    await userEvent.click(
      within(rowOne).getByRole('button', { name: 'Expand' }),
    );
    await waitFor(() => expect(canvas.queryByText('Ervin')).toBeNull());

    const rowTwo = crudCell(canvasElement, '2', 'id')!.closest('tr')!;
    const rowsBefore = canvasElement.querySelectorAll('tbody tr').length;
    await userEvent.click(
      within(rowTwo).getByRole('button', { name: 'Add Subordinate' }),
    );
    // An empty row opens right under row 2.
    await waitFor(() =>
      expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(
        rowsBefore + 1,
      ),
    );
    const next = rowTwo.nextElementSibling as HTMLElement;
    expect(within(next).getAllByRole('textbox')[0]).toHaveValue('');
  },
};
