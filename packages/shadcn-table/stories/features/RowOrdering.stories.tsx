import { useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_Row,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';
import {
  Building2Icon,
  HashIcon,
  type LucideIcon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Row Ordering Examples',
};

export default meta;

type Person = {
  address: string;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  num: number;
  state: string;
};

const columns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'num',
    header: '#',
    icon: HashIcon,
  },
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
    accessorKey: 'email',
    header: 'Email Address',
    icon: MailIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'city',
    header: 'City',
    icon: Building2Icon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
];

const initData = [...Array(100)].map((_, i) => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  num: i,
  state: faker.location.state(),
}));

export const RowOrderingEnabled = () => {
  const [data, setData] = useState(() => initData);

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowOrdering
      enableSorting={false}
      stRowDragHandleProps={({ table }) => ({
        onDragEnd: () => {
          const draggingRow = table.atoms.draggingRow.get();
          const hoveredRow = table.atoms.hoveredRow.get();
          if (hoveredRow && draggingRow) {
            data.splice(
              (hoveredRow as ST_Row<Person>).index,
              0,
              data.splice(draggingRow.index, 1)[0],
            );
            setData([...data]);
          }
        },
      })}
    />
  );
};

export const RowOrderingWithSelect = () => {
  const [data, setData] = useState(() => initData);
  const [draggingRow, setDraggingRow] = useState<ST_Row<Person> | null>(null);
  const [hoveredRow, setHoveredRow] = useState<Partial<ST_Row<Person>> | null>(
    null,
  );

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowOrdering
      enableRowSelection
      enableSorting={false}
      getRowId={(row) => row.email}
      stRowDragHandleProps={{
        onDragEnd: () => {
          if (hoveredRow && draggingRow) {
            data.splice(
              hoveredRow?.index ?? 0,
              0,
              data.splice(draggingRow.index, 1)[0],
            );
            setData([...data]);
          }
        },
      }}
      onDraggingRowChange={setDraggingRow}
      onHoveredRowChange={setHoveredRow}
      state={{
        draggingRow,
        hoveredRow,
      }}
    />
  );
};

export const RowOrderingWithPinning = () => {
  const [data, setData] = useState(() => initData);
  const [draggingRow, setDraggingRow] = useState<ST_Row<Person> | null>(null);
  const [hoveredRow, setHoveredRow] = useState<Partial<ST_Row<Person>> | null>(
    null,
  );

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableColumnPinning
      enableRowOrdering
      enableSorting={false}
      stRowDragHandleProps={{
        onDragEnd: () => {
          if (hoveredRow && draggingRow) {
            data.splice(
              hoveredRow?.index ?? 0,
              0,
              data.splice(draggingRow.index, 1)[0],
            );
            setData([...data]);
          }
        },
      }}
      onDraggingRowChange={setDraggingRow}
      onHoveredRowChange={setHoveredRow}
      state={{
        draggingRow,
        hoveredRow,
      }}
    />
  );
};

export const RowAndColumnOrdering = () => {
  const [data, setData] = useState(() => initData);
  const [draggingRow, setDraggingRow] = useState<ST_Row<Person> | null>(null);
  const [hoveredRow, setHoveredRow] = useState<Partial<ST_Row<Person>> | null>(
    null,
  );

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableColumnOrdering
      enableColumnPinning
      enableRowOrdering
      enableSorting={false}
      stRowDragHandleProps={{
        onDragEnd: () => {
          if (hoveredRow && draggingRow) {
            data.splice(
              hoveredRow.index ?? 0,
              0,
              data.splice(draggingRow.index, 1)[0],
            );
            setData([...data]);
          }
        },
      }}
      onDraggingRowChange={setDraggingRow}
      onHoveredRowChange={setHoveredRow}
      state={{
        draggingRow,
        hoveredRow,
      }}
    />
  );
};

export const RowOrderingWithRowVirtualization = () => {
  const [data, setData] = useState(() => initData);

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enablePagination={false}
      enableRowOrdering
      enableRowVirtualization
      enableSorting={false}
      stRowDragHandleProps={({ table }) => ({
        onDragEnd: () => {
          const draggingRow = table.atoms.draggingRow.get();
          const hoveredRow = table.atoms.hoveredRow.get();
          if (hoveredRow && draggingRow) {
            data.splice(
              (hoveredRow as ST_Row<Person>).index,
              0,
              data.splice(draggingRow.index, 1)[0],
            );
            setData([...data]);
          }
        },
      })}
    />
  );
};

// Icons by column key; every fake column holds first names, so none is
// listed and each falls back to the name icon.
const fakeColumnIcons: Record<string, LucideIcon> = {};

const fakeColumns = [...Array(500)].map((_, i) => {
  return {
    accessorKey: i.toString(),
    header: 'Column ' + i.toString(),
    icon: fakeColumnIcons[i.toString()] ?? UserIcon,
  };
});

const fakeData = [...Array(500)].map(() => ({
  ...Object.fromEntries(
    fakeColumns.map((col) => [col.accessorKey, faker.person.firstName()]),
  ),
}));

export const RowOrderingWithColumnVirtualization = () => {
  const [data, setData] = useState(() => fakeData);

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={fakeColumns}
      data={data}
      displayColumnDefOptions={{
        'st-row-drag': {
          enableColumnDragging: true,
          enableColumnOrdering: true,
        },
      }}
      enableColumnOrdering
      enableColumnVirtualization
      enableRowOrdering
      enableSorting={false}
      stRowDragHandleProps={({ table }) => ({
        onDragEnd: () => {
          const draggingRow = table.atoms.draggingRow.get();
          const hoveredRow = table.atoms.hoveredRow.get();
          if (hoveredRow && draggingRow) {
            data.splice(
              (hoveredRow as ST_Row<(typeof fakeData)[0]>).index,
              0,
              data.splice(draggingRow.index, 1)[0],
            );
            setData([...data]);
          }
        },
      })}
    />
  );
};
