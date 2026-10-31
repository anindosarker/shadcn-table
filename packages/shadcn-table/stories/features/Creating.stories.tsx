import { useState } from 'react';
import { type Meta } from '@storybook/react-vite';
import {
  type ST_Row,
  type ST_TableOptions,
  createRow,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { Plus } from 'lucide-react';
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
          accessorKey: 'phoneNumber',
          enableEditing: false,
          header: 'Phone Number',
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
