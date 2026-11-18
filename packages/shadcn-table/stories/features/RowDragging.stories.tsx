import { useMemo, useState } from 'react';
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
import {
  Building2Icon,
  CakeIcon,
  HashIcon,
  MailIcon,
  MapIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Row Dragging',
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

const centreOf = (element: Element) => {
  const rect = element.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

/** A finger's pointer event, sent to the element it went down on. */
const touch = ({
  at,
  element,
  type,
}: {
  at: { x: number; y: number };
  element: Element;
  type: 'pointerdown' | 'pointermove' | 'pointerup';
}) =>
  fireEvent(
    element,
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: at.x,
      clientY: at.y,
      isPrimary: true,
      pointerId: 11,
      pointerType: 'touch',
    }),
  );

const ghost = () =>
  document.querySelector<HTMLElement>('[data-st-touch-ghost]');

/** Drags the last row of table `from` by its grip onto table `to`'s first row. */
const touchDragRow = async ({
  from,
  to,
}: {
  from: HTMLElement;
  to: HTMLElement;
}) => {
  const grip = within(
    [...from.querySelectorAll<HTMLElement>('tbody tr')].at(-1)!,
  ).getByRole('button', { name: 'Move' });
  const start = centreOf(grip);
  const end = centreOf(to.querySelector<HTMLElement>('tbody td')!);
  touch({ at: start, element: grip, type: 'pointerdown' });
  touch({
    at: { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 },
    element: grip,
    type: 'pointermove',
  });
  await waitFor(() => expect(ghost()).not.toBeNull());
  touch({ at: end, element: grip, type: 'pointermove' });
  await new Promise((done) => setTimeout(done, 50));
  touch({ at: end, element: grip, type: 'pointerup' });
  await waitFor(() => expect(ghost()).toBeNull());
};

/**
 * Dragging a row of the first table onto the second moves it: it leaves
 * the source table and appears at the end of the target. The same by touch.
 */
export const DragBetweenTables = {
  render: () => <TwoTables />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(initData[0]!.firstName);
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

    // Touch: the row goes back by its grip, then over as the mouse moved it.
    await touchDragRow({ from: target!, to: source! });
    await waitFor(() =>
      expect(ids(source!)).toEqual(
        [...initData.slice(1, 3), initData[0]!].map((row) => row.id),
      ),
    );
    expect(ids(target!)).toEqual(initData.slice(3, 5).map((row) => row.id));
    await touchDragRow({ from: source!, to: target! });
    await waitFor(() =>
      expect(ids(target!)).toEqual(
        [...initData.slice(3, 5), initData[0]!].map((row) => row.id),
      ),
    );
    expect(ids(source!)).toEqual(initData.slice(1, 3).map((row) => row.id));
  },
};

type ListPerson = {
  city: string;
  firstName: string;
  lastName: string;
};

// The rows of the docs example `row-dragging` (enable-row-dragging/makeData.ts).
const listData: ListPerson[] = [
  { firstName: 'Dylan', lastName: 'Murray', city: 'East Daphne' },
  { firstName: 'Raquel', lastName: 'Kohler', city: 'Columbus' },
  { firstName: 'Ervin', lastName: 'Reinger', city: 'South Linda' },
  { firstName: 'Brittany', lastName: 'McCullough', city: 'Lincoln' },
  { firstName: 'Branson', lastName: 'Frami', city: 'Charleston' },
];

/** The docs example `row-dragging`: the same columns, options and data. */
const RowDraggingTables = () => {
  const columns = useMemo<ST_ColumnDef<ListPerson>[]>(
    () => [
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
      },
    ],
    [],
  );

  const [data1, setData1] = useState<ListPerson[]>(() => listData.slice(0, 3));
  const [data2, setData2] = useState<ListPerson[]>(() => listData.slice(3, 5));

  const [draggingRow, setDraggingRow] = useState<ST_Row<ListPerson> | null>(
    null,
  );
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  const commonTableProps: Partial<ST_TableOptions<ListPerson>> & {
    columns: ST_ColumnDef<ListPerson>[];
  } = {
    columns,
    enableRowDragging: true,
    enableFullScreenToggle: false,
    stTableContainerProps: {
      className: 'min-h-[320px]',
    },
    onDraggingRowChange: setDraggingRow,
    state: { draggingRow },
  };

  const table1 = useShadcnTable({
    ...commonTableProps,
    data: data1,
    getRowId: (originalRow) => `table-1-${originalRow.firstName}`,
    stRowDragHandleProps: {
      onDragEnd: () => {
        if (hoveredTable === 'table-2') {
          setData2((data2) => [...data2, draggingRow!.original]);
          setData1((data1) => data1.filter((d) => d !== draggingRow!.original));
        }
        setHoveredTable(null);
      },
    },
    stTableLayoutProps: {
      onDragEnter: () => setHoveredTable('table-1'),
      className:
        hoveredTable === 'table-1'
          ? 'outline-2 outline-dashed outline-pink-400'
          : undefined,
    },
    renderTopToolbarCustomActions: () => (
      <span className="text-2xl font-semibold text-green-600">Nice List</span>
    ),
  });

  const table2 = useShadcnTable({
    ...commonTableProps,
    data: data2,
    getRowId: (originalRow) => `table-2-${originalRow.firstName}`,
    stRowDragHandleProps: {
      onDragEnd: () => {
        if (hoveredTable === 'table-1') {
          setData1((data1) => [...data1, draggingRow!.original]);
          setData2((data2) => data2.filter((d) => d !== draggingRow!.original));
        }
        setHoveredTable(null);
      },
    },
    stTableLayoutProps: {
      onDragEnter: () => setHoveredTable('table-2'),
      className:
        hoveredTable === 'table-2'
          ? 'outline-2 outline-dashed outline-pink-400'
          : undefined,
    },
    renderTopToolbarCustomActions: () => (
      <span className="text-2xl font-semibold text-destructive">
        Naughty List
      </span>
    ),
  });

  return (
    // Side by side only when the wrapper is wide enough for both tables.
    <div className="@container">
      <div className="grid grid-cols-1 gap-4 overflow-auto p-1 @4xl:grid-cols-2">
        <ShadcnTable table={table1} />
        <ShadcnTable table={table2} />
      </div>
    </div>
  );
};

/**
 * Dragging the first row of the Nice List onto the Naughty List moves it:
 * it leaves the Nice List and appears at the end of the Naughty List.
 */
export const RowDragging = {
  render: () => <RowDraggingTables />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText(listData[0]!.firstName);
    const [source, target] = canvas.getAllByRole('table');
    const names = (table: HTMLElement) =>
      [...table.querySelectorAll('tbody td[data-flip-column="firstName"]')].map(
        (cell) => (cell.textContent ?? '').trim(),
      );
    expect(names(source!)).toEqual(['Dylan', 'Raquel', 'Ervin']);
    expect(names(target!)).toEqual(['Brittany', 'Branson']);
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
      expect(names(target!)).toEqual(['Brittany', 'Branson', 'Dylan']),
    );
    expect(names(source!)).toEqual(['Raquel', 'Ervin']);
  },
};
