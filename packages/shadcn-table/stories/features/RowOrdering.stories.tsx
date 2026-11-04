import { useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_Row,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
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

/** Row ordering on 10 rows of its own data, reordered on drop. */
const SlideTable = () => {
  const [data, setData] = useState(() => initData.slice(0, 10));

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
            const next = [...data];
            next.splice(
              (hoveredRow as ST_Row<Person>).index,
              0,
              next.splice(draggingRow.index, 1)[0],
            );
            setData(next);
          }
        },
      })}
    />
  );
};

const bodyRows = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLElement>('tbody tr'),
];

const rowNum = (row: HTMLElement) =>
  row.querySelector('td[data-flip-column="num"]')?.textContent?.trim();

/** Drags the first row's grip onto the third row and drops it there. */
const dragFirstRowTwoDown = async (canvasElement: HTMLElement) => {
  await waitFor(() => expect(bodyRows(canvasElement).length).toBe(10));
  const rows = bodyRows(canvasElement);
  const moved = rowNum(rows[0])!;
  const grip = within(rows[0]).getByRole('button', { name: 'Move' });
  const target = rows[2].querySelector<HTMLElement>(
    'td[data-flip-column="firstName"]',
  )!;
  const browserUserEvent = (
    globalThis as {
      stBrowserUserEvent?: {
        dragAndDrop: (source: Element, target: Element) => Promise<void>;
      };
    }
  ).stBrowserUserEvent;
  if (browserUserEvent) {
    await browserUserEvent.dragAndDrop(grip, target);
  } else {
    fireEvent.dragStart(grip);
    fireEvent.dragEnter(target);
    fireEvent.dragOver(target);
    fireEvent.drop(target);
    fireEvent.dragEnd(grip);
  }
  await waitFor(() => expect(rowNum(bodyRows(canvasElement)[2])).toBe(moved));
  return bodyRows(canvasElement)[2];
};

/** The running translate slides on an element, its highlight excluded. */
const slides = (element: HTMLElement) =>
  element
    .getAnimations()
    .filter((animation) =>
      (animation.effect as KeyframeEffect)
        .getKeyframes()
        .some((keyframe) => keyframe.translate !== undefined),
    );

// A row drop slides the rows between the old and the new index into place
// and the moved row flashes the drop highlight (D57).
export const DropSlidesRows = {
  render: () => <SlideTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const movedRow = await dragFirstRowTwoDown(canvasElement);
    expect(movedRow.getAnimations().length).toBeGreaterThan(0);
    expect(slides(movedRow).length).toBeGreaterThan(0);
    expect(slides(bodyRows(canvasElement)[0]).length).toBeGreaterThan(0);
    // Rows past the new index keep their place.
    expect(slides(bodyRows(canvasElement)[5]).length).toBe(0);
  },
};

// Reduced motion: the rows do not slide, the highlight stays (D57).
export const DropNoSlideReducedMotion = {
  render: () => <SlideTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const matchMedia = window.matchMedia;
    // The library reads the preference through matchMedia.
    window.matchMedia = (query: string) =>
      query.includes('prefers-reduced-motion')
        ? ({
            addEventListener: () => {},
            addListener: () => {},
            dispatchEvent: () => false,
            matches: true,
            media: query,
            onchange: null,
            removeEventListener: () => {},
            removeListener: () => {},
          } as MediaQueryList)
        : matchMedia.call(window, query);
    try {
      const movedRow = await dragFirstRowTwoDown(canvasElement);
      expect(slides(movedRow).length).toBe(0);
      expect(movedRow.getAnimations({ subtree: true }).length).toBeGreaterThan(
        0,
      );
    } finally {
      window.matchMedia = matchMedia;
    }
  },
};
