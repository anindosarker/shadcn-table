import { useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_Row,
  type ST_TableOptions,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { CakeIcon, HashIcon, MailIcon, MapIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Features/Row Dragging Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof initData)[0]>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
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
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
];

const initData = [...Array(25)].map(() => ({
  age: faker.number.int(20) + 18,
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  id: faker.string.alphanumeric(6),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowDraggingEnabled = () => {
  const [data] = useState(() => initData);

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowDragging
    />
  );
};

export const RowDraggingEnabledGrid = () => {
  const [data] = useState(() => initData);

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowDragging
      layoutMode="grid"
    />
  );
};

export const RowDraggingEnabledGridNoGrow = () => {
  const [data] = useState(() => initData);

  return (
    <ShadcnTable
      autoResetPageIndex={false}
      columns={columns}
      data={data}
      enableRowDragging
      layoutMode="grid-no-grow"
    />
  );
};

type Person = (typeof initData)[0];

/** Two tables; a row dropped on the other table moves there (docs example). */
const TwoTables = () => {
  const [data1, setData1] = useState(() => initData.slice(0, 3));
  const [data2, setData2] = useState(() => initData.slice(3, 5));
  const [draggingRow, setDraggingRow] = useState<ST_Row<Person> | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const commonTableProps: Partial<ST_TableOptions<Person>> & {
    columns: ST_ColumnDef<Person>[];
  } = {
    columns: columns.slice(0, 3),
    enableFullScreenToggle: false,
    enableRowDragging: true,
    onDraggingRowChange: setDraggingRow,
    state: { draggingRow },
  };

  const table1 = useShadcnTable({
    ...commonTableProps,
    data: data1,
    getRowId: (row) => `table-1-${row.id}`,
    renderTopToolbarCustomActions: () => <span>Nice List</span>,
    stRowDragHandleProps: {
      onDragEnd: () => {
        if (hoveredTable === 'table-2') {
          setData2((rows) => [...rows, draggingRow!.original]);
          setData1((rows) =>
            rows.filter((row) => row !== draggingRow!.original),
          );
        }
        setHoveredTable(null);
      },
    },
    stTableLayoutProps: { onDragEnter: () => setHoveredTable('table-1') },
  });

  const table2 = useShadcnTable({
    ...commonTableProps,
    data: data2,
    getRowId: (row) => `table-2-${row.id}`,
    renderTopToolbarCustomActions: () => <span>Naughty List</span>,
    stRowDragHandleProps: {
      onDragEnd: () => {
        if (hoveredTable === 'table-1') {
          setData1((rows) => [...rows, draggingRow!.original]);
          setData2((rows) =>
            rows.filter((row) => row !== draggingRow!.original),
          );
        }
        setHoveredTable(null);
      },
    },
    stTableLayoutProps: { onDragEnter: () => setHoveredTable('table-2') },
  });

  return (
    <div className="grid grid-cols-2 gap-4">
      <ShadcnTable table={table1} />
      <ShadcnTable table={table2} />
    </div>
  );
};

/**
 * Dragging a row of the first table onto the second moves it: it leaves
 * the source table and appears at the end of the target.
 */
export const DragBetweenTables = {
  render: () => <TwoTables />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText(initData[0]!.firstName);
    const [source, target] = canvas.getAllByRole('table');
    const ids = (table: HTMLElement) =>
      [...table.querySelectorAll('tbody td[data-flip-column="id"]')].map(
        (cell) => (cell.textContent ?? '').trim(),
      );
    expect(ids(source!)).toEqual(initData.slice(0, 3).map((row) => row.id));
    expect(ids(target!)).toEqual(initData.slice(3, 5).map((row) => row.id));
    const grip = within(
      source!.querySelector<HTMLElement>('tbody tr')!,
    ).getByRole('button', { name: 'Move' });
    const drop = target!.querySelector<HTMLElement>('tbody td')!;
    const browserUserEvent = (
      globalThis as {
        stBrowserUserEvent?: {
          dragAndDrop: (source: Element, target: Element) => Promise<void>;
        };
      }
    ).stBrowserUserEvent;
    if (browserUserEvent) {
      await browserUserEvent.dragAndDrop(grip, drop);
    } else {
      fireEvent.dragStart(grip);
      fireEvent.dragEnter(drop);
      fireEvent.dragOver(drop);
      fireEvent.drop(drop);
      fireEvent.dragEnd(grip);
    }
    await waitFor(() =>
      expect(ids(target!)).toEqual(
        [...initData.slice(3, 5), initData[0]!].map((row) => row.id),
      ),
    );
    expect(ids(source!)).toEqual(initData.slice(1, 3).map((row) => row.id));
  },
};
