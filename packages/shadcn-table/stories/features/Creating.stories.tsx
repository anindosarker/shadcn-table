import { useState } from 'react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  type ST_Row,
  type ST_TableOptions,
  createRow,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { MapIcon, MapPinIcon, PhoneIcon, Plus, UserIcon } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const meta: Meta = {
  title: 'Features/Creating Examples',
};

export default meta;

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

const expandingData = [...Array(5)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  subRows: [...Array(faker.number.int(4))].map(() => ({
    address: faker.location.streetAddress(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    subRows: [...Array(3)].map(() => ({
      address: faker.location.streetAddress(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      subRows: [...Array(2)].map(() => ({
        address: faker.location.streetAddress(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
      })),
    })),
  })),
}));

export const CreateRowIndexTop = () => {
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
      positionCreatingRow="top"
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

export const CreateRowIndexBottom = () => {
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
      positionCreatingRow="bottom"
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

export const CreateRowIndexIndex = () => {
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
      positionCreatingRow={5}
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

export const CreateRowIndexIndexVirtualized = () => {
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
      enableRowVirtualization
      onCreatingRowSave={() => {}}
      onEditingRowSave={handleSaveRow}
      positionCreatingRow={5}
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

export const CreateRowIndexIndexExpanding = () => {
  const [creatingRowIndex, setCreatingRowIndex] = useState<
    number | undefined
  >();

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
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
          icon: PhoneIcon,
        },
      ]}
      createDisplayMode="row"
      data={expandingData}
      editDisplayMode="row"
      enableEditing
      enableExpanding
      initialState={{ expanded: true }}
      onCreatingRowSave={() => {}}
      positionCreatingRow={creatingRowIndex}
      renderRowActions={({ row, staticRowIndex, table }) => {
        return (
          <Button
            size="icon"
            onClick={() => {
              setCreatingRowIndex((staticRowIndex || 0) + 1);
              table.setCreatingRow(
                createRow(
                  table,
                  {
                    address: '',
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    subRows: [],
                  },
                  -1,
                  row.depth + 1,
                ),
              );
            }}
          >
            <Plus />
          </Button>
        );
      }}
      renderTopToolbarCustomActions={({ table }) => (
        <Button
          onClick={() => {
            setCreatingRowIndex(0);
            table.setCreatingRow(true);
          }}
        >
          Add
        </Button>
      )}
    />
  );
};

export const CreateWithCustomEditCell = () => {
  const [tableData, setTableData] = useState(data);

  const handleSaveRow: ST_TableOptions<Person>['onEditingRowSave'] = ({
    exitEditingMode,
    row,
    values,
  }) => {
    setTableData(tableData.map((r, i) => (i === row.index ? values : r)));
    exitEditingMode();
  };

  const [creatingRow, setCreatingRow] = useState<ST_Row<Person> | null>(null);

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
          Edit: ({ cell }) => (
            <Select value={cell.getValue<string>()}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Alabama">Alabama</SelectItem>
                <SelectItem value="Alaska">Alaska</SelectItem>
              </SelectContent>
            </Select>
          ),
        },
        {
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
          icon: PhoneIcon,
        },
      ]}
      state={{ creatingRow }}
      onCreatingRowChange={setCreatingRow}
      createDisplayMode="row"
      data={tableData}
      editDisplayMode="row"
      enableEditing={(row) => row.id === creatingRow?.id}
      onCreatingRowSave={() => {}}
      onEditingRowSave={handleSaveRow}
      positionCreatingRow="top"
      renderTopToolbarCustomActions={({ table }) => (
        <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
      )}
    />
  );
};

/**
 * Add opens an empty row in edit at the top; Save hands its values to
 * `onCreatingRowSave`, which appends them to the data.
 */
export const CreateRowAppears = {
  render: function CreateRowAppearsStory() {
    const [tableData, setTableData] = useState(() => data.slice(0, 3));
    const handleCreate: ST_TableOptions<Person>['onCreatingRowSave'] = ({
      exitCreatingMode,
      values,
    }) => {
      setTableData((rows) => [...rows, values]);
      exitCreatingMode();
    };
    return (
      <ShadcnTable
        columns={[
          { accessorKey: 'firstName', header: 'First Name' },
          { accessorKey: 'lastName', header: 'Last Name' },
        ]}
        createDisplayMode="row"
        data={tableData}
        editDisplayMode="row"
        enableEditing
        onCreatingRowSave={handleCreate}
        positionCreatingRow="top"
        renderTopToolbarCustomActions={({ table }) => (
          <Button onClick={() => table.setCreatingRow(true)}>Add</Button>
        )}
      />
    );
  },
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText(data[0].firstName);
    const rows = () => [
      ...canvasElement.querySelectorAll<HTMLElement>('tbody tr'),
    ];
    expect(rows()).toHaveLength(3);
    await userEvent.click(canvas.getByRole('button', { name: 'Add' }));
    await waitFor(() => expect(rows()).toHaveLength(4));
    const creating = rows()[0]!;
    const [firstName, lastName] = within(creating).getAllByRole('textbox');
    expect(firstName).toHaveValue('');
    await userEvent.type(firstName!, 'Zelda');
    await userEvent.type(lastName!, 'Quinn');
    await userEvent.click(
      within(creating).getByRole('button', { name: 'Save' }),
    );
    await waitFor(() =>
      expect(canvasElement.querySelectorAll('tbody input')).toHaveLength(0),
    );
    expect(rows()).toHaveLength(4);
    const last = rows()[3]!;
    expect(
      last.querySelector('td[data-flip-column="firstName"]'),
    ).toHaveTextContent(/^Zelda$/);
    expect(
      last.querySelector('td[data-flip-column="lastName"]'),
    ).toHaveTextContent(/^Quinn$/);
  },
};
