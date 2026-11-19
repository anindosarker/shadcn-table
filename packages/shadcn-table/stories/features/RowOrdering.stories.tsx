import { useMemo, useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_Row,
  ShadcnTable,
  useShadcnTable,
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
  title: 'Features/Row Ordering',
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

/**
 * Records every `element.animate()` call while `run` runs, so a play reads
 * the drop animations even when a loaded machine returns from the drag after
 * the 200 ms slide has finished.
 */
const recordAnimations = async <T,>(run: () => Promise<T>) => {
  const started: { element: Element; keyframes: Keyframe[] }[] = [];
  const animate = Element.prototype.animate;
  Element.prototype.animate = function (
    this: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions,
  ) {
    if (Array.isArray(keyframes)) started.push({ element: this, keyframes });
    return animate.call(this, keyframes, options);
  };
  try {
    return { result: await run(), started };
  } finally {
    Element.prototype.animate = animate;
  }
};

type Started = { element: Element; keyframes: Keyframe[] }[];

/** The translate slides started on `element`. */
const slidesOn = (started: Started, element: Element) =>
  started.filter(
    (animation) =>
      animation.element === element &&
      animation.keyframes.some((keyframe) => keyframe.translate !== undefined),
  );

/** The highlights started on `element`'s cells. */
const highlightsIn = (started: Started, element: Element) =>
  started.filter(
    (animation) =>
      animation.element.parentElement === element &&
      animation.keyframes.some((keyframe) => keyframe.boxShadow !== undefined),
  );

/**
 * Mounts the story again (.storybook/preview.tsx), so each step of a play
 * that holds merged checks (D106) starts from the story's first render.
 */
const remountStory = () => {
  const remount = (globalThis as { __stRemountStory?: () => Promise<void> })
    .__stRemountStory;
  if (!remount) throw new Error('__stRemountStory is not set (preview.tsx)');
  return remount();
};

const dropSlidesRowsPlay = async ({ canvasElement }: StoryContext) => {
  const { result: movedRow, started } = await recordAnimations(() =>
    dragFirstRowTwoDown(canvasElement),
  );
  expect(slidesOn(started, movedRow).length).toBeGreaterThan(0);
  expect(highlightsIn(started, movedRow).length).toBeGreaterThan(0);
  expect(slidesOn(started, bodyRows(canvasElement)[0]).length).toBe(1);
  // Rows past the new index keep their place.
  expect(slidesOn(started, bodyRows(canvasElement)[5]).length).toBe(0);
};

// Reduced motion: the rows do not slide, the highlight stays (D57).
const dropNoSlideReducedMotionPlay = async ({
  canvasElement,
}: StoryContext) => {
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
    const { result: movedRow, started } = await recordAnimations(() =>
      dragFirstRowTwoDown(canvasElement),
    );
    expect(slidesOn(started, movedRow).length).toBe(0);
    expect(highlightsIn(started, movedRow).length).toBeGreaterThan(0);
  } finally {
    window.matchMedia = matchMedia;
  }
};

/**
 * Dragging the first row's grip onto the third row moves it there, with the
 * mouse and by touch.
 */
const dragReordersRowsPlay = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(bodyRows(canvasElement).length).toBe(10));
  const before = bodyRows(canvasElement).map(rowNum);
  // A mouse drag draws no ghost at any moment of the drag.
  const ghosts: Element[] = [];
  const observer = new MutationObserver((records) =>
    records.forEach((record) =>
      record.addedNodes.forEach((node) => {
        if (node instanceof Element && node.matches('[data-st-touch-ghost]')) {
          ghosts.push(node);
        }
      }),
    ),
  );
  observer.observe(document.body, { childList: true });
  await dragFirstRowTwoDown(canvasElement);
  observer.disconnect();
  expect(ghosts).toEqual([]);
  const moved = [before[1], before[2], before[0], ...before.slice(3)];
  await waitFor(() =>
    expect(bodyRows(canvasElement).map(rowNum)).toEqual(moved),
  );

  // Touch: the grip drags at once, back and then as the mouse moved it.
  await touchDragRow({ canvasElement, from: 2, to: 0 });
  await waitFor(() =>
    expect(bodyRows(canvasElement).map(rowNum)).toEqual(before),
  );
  await touchDragRow({ canvasElement, from: 0, to: 2 });
  await waitFor(() =>
    expect(bodyRows(canvasElement).map(rowNum)).toEqual(moved),
  );
};

// A row drop slides the rows between the old and the new index into place
// and the moved row flashes the drop highlight (D57).
export const DropSlidesRows = {
  render: () => <SlideTable />,
  play: async (context: StoryContext) => {
    await context.step('Drop Slides Rows', () => dropSlidesRowsPlay(context));
    await remountStory();
    await context.step('Drop No Slide Reduced Motion', () =>
      dropNoSlideReducedMotionPlay(context),
    );
    await remountStory();
    await context.step('Drag Reorders Rows', () =>
      dragReordersRowsPlay(context),
    );
  },
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
  type: 'pointercancel' | 'pointerdown' | 'pointermove' | 'pointerup';
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

const pause = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** The copy of the dragged row that follows the finger. */
const ghost = () =>
  document.querySelector<HTMLElement>('[data-st-touch-ghost]');

/**
 * Drags the grip of the row at `from` by touch onto the row at `to`. The
 * ghost shows while the drag is on, follows the finger and is gone after
 * the drop.
 */
const touchDragRow = async ({
  canvasElement,
  from,
  to,
}: {
  canvasElement: HTMLElement;
  from: number;
  to: number;
}) => {
  await waitFor(() =>
    expect(canvasElement.getAnimations({ subtree: true }).length).toBe(0),
  );
  const rows = bodyRows(canvasElement);
  const grip = within(rows[from]).getByRole('button', { name: 'Move' });
  const start = centreOf(grip);
  const end = centreOf(
    rows[to].querySelector<HTMLElement>('td[data-flip-column="firstName"]')!,
  );
  touch({ at: start, element: grip, type: 'pointerdown' });
  touch({
    at: { x: start.x, y: (start.y + end.y) / 2 },
    element: grip,
    type: 'pointermove',
  });
  await waitFor(() => expect(ghost()).not.toBeNull());
  const halfway = ghost()?.style.translate;
  touch({ at: end, element: grip, type: 'pointermove' });
  await waitFor(() => expect(ghost()?.style.translate).not.toBe(halfway));
  await pause(50);
  touch({ at: end, element: grip, type: 'pointerup' });
  await waitFor(() => expect(ghost()).toBeNull());
};

type DndPerson = {
  city: string;
  firstName: string;
  lastName: string;
};

// The rows of the docs example `row-ordering` (enable-row-ordering/makeData.ts).
const dndData: DndPerson[] = [
  { firstName: 'Dylan', lastName: 'Murray', city: 'East Daphne' },
  { firstName: 'Raquel', lastName: 'Kohler', city: 'Columbus' },
  { firstName: 'Ervin', lastName: 'Reinger', city: 'South Linda' },
  { firstName: 'Brittany', lastName: 'McCullough', city: 'Lincoln' },
  { firstName: 'Branson', lastName: 'Frami', city: 'Charleston' },
];

/** The docs example `row-ordering`: the same columns, options and data. */
const RowDndOrderingTable = () => {
  const columns = useMemo<ST_ColumnDef<DndPerson>[]>(
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

  const [data, setData] = useState(() => dndData);

  const table = useShadcnTable({
    autoResetPageIndex: false,
    columns,
    data,
    enableRowOrdering: true,
    enableSorting: false,
    stRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const draggingRow = table.atoms.draggingRow.get();
        const hoveredRow = table.atoms.hoveredRow.get();
        if (hoveredRow && draggingRow) {
          data.splice(
            (hoveredRow as ST_Row<DndPerson>).index,
            0,
            data.splice(draggingRow.index, 1)[0],
          );
          setData([...data]);
        }
      },
    }),
  });

  return <ShadcnTable table={table} />;
};

const firstNames = (canvasElement: HTMLElement) =>
  bodyRows(canvasElement).map((row) =>
    row.querySelector('td[data-flip-column="firstName"]')?.textContent?.trim(),
  );

/** Dragging the first row's grip onto the third row moves it there. */
export const RowDndOrdering = {
  name: 'Row DnD Ordering',
  render: () => <RowDndOrderingTable />,
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => expect(bodyRows(canvasElement).length).toBe(5));
    const before = firstNames(canvasElement);
    const rows = bodyRows(canvasElement);
    const grip = within(rows[0]!).getByRole('button', { name: 'Move' });
    const target = rows[2]!.querySelector<HTMLElement>(
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
    await waitFor(() =>
      expect(firstNames(canvasElement)).toEqual([
        before[1],
        before[2],
        before[0],
        ...before.slice(3),
      ]),
    );
  },
};

/**
 * A table without a scroll of its own on a page that scrolls: a finger held
 * near the bottom of the screen scrolls the page, as a mouse drag does.
 */
export const TouchDragScrollsPage = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={initData}
      enablePagination={false}
      enableRowOrdering
      enableSorting={false}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => expect(bodyRows(canvasElement).length).toBe(100));
    const page = document.scrollingElement as HTMLElement;
    page.scrollTop = 0;
    expect(page.scrollHeight).toBeGreaterThan(window.innerHeight);
    const grip = within(bodyRows(canvasElement)[0]).getByRole('button', {
      name: 'Move',
    });
    const start = centreOf(grip);
    const edge = { x: start.x, y: window.innerHeight - 4 };
    touch({ at: start, element: grip, type: 'pointerdown' });
    touch({ at: edge, element: grip, type: 'pointermove' });
    await waitFor(() => expect(ghost()).not.toBeNull());
    await waitFor(() => expect(page.scrollTop).toBeGreaterThan(0));
    touch({ at: edge, element: grip, type: 'pointercancel' });
    await waitFor(() => expect(ghost()).toBeNull());
    page.scrollTop = 0;
  },
};
