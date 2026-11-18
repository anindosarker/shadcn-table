import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  type ST_ColumnDef,
  type ST_TableOptions,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Building2Icon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Row Pinning',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
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

const data = [...Array(50)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const RowPinningStickyDefaultEnabled = () => (
  <ShadcnTable columns={columns} data={data} enableRowPinning />
);

export const RowPinningEnabledConditionally = () => {
  const [enableRowPinning, setEnableRowPinning] = useState(false);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableRowPinning={enableRowPinning}
      renderTopToolbarCustomActions={() => (
        <Button onClick={() => setEnableRowPinning(!enableRowPinning)}>
          Toggle Row Pinning
        </Button>
      )}
    />
  );
};

export const RowPinningStickyNoPagination = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyCustomRowHeight = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableBodyRowProps={{
      className: 'h-[100px]',
    }}
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="sticky"
  />
);

export const RowPinningSelectStickyMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-sticky"
  />
);

// Select all pins all 50 rows, more than the 600px container holds; the
// pinned rows stay below the head, so the select-all box is still the
// topmost element at its center and unselects them all.
RowPinningSelectStickyMode.play = async ({
  canvas,
  canvasElement,
}: StoryContext) => {
  const pinnedRows = () =>
    canvasElement.querySelectorAll('tbody tr[data-pinned]');
  const selectAll = await canvas.findByRole('checkbox', {
    name: 'Toggle select all',
  });
  await userEvent.click(selectAll);
  await waitFor(() => expect(pinnedRows()).toHaveLength(data.length));
  // The visible box: the React Aria base's checkbox role is a visually hidden
  // input inside it.
  const selectAllBox = selectAll.closest<HTMLElement>(
    '[data-slot="checkbox"]',
  )!;
  await waitFor(() => {
    const { height, left, top, width } = selectAllBox.getBoundingClientRect();
    const hit = document.elementFromPoint(left + width / 2, top + height / 2);
    expect(selectAllBox.contains(hit)).toBe(true);
  });
  await userEvent.click(selectAll);
  await waitFor(() => expect(pinnedRows()).toHaveLength(0));
};

export const RowPinningSelectStickyWithVirtualization = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    enableRowVirtualization
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-sticky"
  />
);

// Select all pins all 50 rows, more than the 600px container holds. The
// table stays virtualized: it renders the rows in view, not every pinned
// row. The pinned rows stay below the head, so the select-all box is still
// the topmost element at its center and unselects them all.
RowPinningSelectStickyWithVirtualization.play = async ({
  canvas,
  canvasElement,
}: StoryContext) => {
  const pinnedRows = () =>
    canvasElement.querySelectorAll('tbody tr[data-pinned]');
  const selectAll = await canvas.findByRole('checkbox', {
    name: 'Toggle select all',
  });
  await userEvent.click(selectAll);
  await waitFor(() => {
    expect(pinnedRows().length).toBeGreaterThan(0);
    expect(selectAll).toBeChecked();
  });
  // Let a render that would mount every pinned row settle first.
  await new Promise((resolve) => setTimeout(resolve, 300));
  expect(bodyRows(canvasElement).length).toBeLessThan(data.length / 2);
  expect(pinnedRows()).toHaveLength(bodyRows(canvasElement).length);
  // The visible box: the React Aria base's checkbox role is a visually hidden
  // input inside it.
  const selectAllBox = selectAll.closest<HTMLElement>(
    '[data-slot="checkbox"]',
  )!;
  await waitFor(() => {
    const { height, left, top, width } = selectAllBox.getBoundingClientRect();
    const hit = document.elementFromPoint(left + width / 2, top + height / 2);
    expect(selectAllBox.contains(hit)).toBe(true);
  });
  await userEvent.click(selectAll);
  await waitFor(() => expect(pinnedRows()).toHaveLength(0));
};

export const RowPinningTopAndBottomMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top-and-bottom"
  />
);

export const RowPinningTopMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    keepPinnedRows={false}
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

export const RowPinningSelectTopMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-top"
  />
);

export const RowPinningBottomMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="bottom"
  />
);

export const RowPinningSelectBottomMode = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowSelection
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="select-bottom"
  />
);

export const RowPinningWithStickyHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableStickyFooter
    enableStickyHeader
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningWithGridLayout = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    layoutMode="grid"
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningStickyWithVirtualization = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

export const RowPinningTopWithVirtualization = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enablePagination={false}
    enableRowPinning
    enableRowVirtualization
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
    rowPinningDisplayMode="top"
  />
);

/** The table's scroll container: its nearest ancestor that scrolls. */
const scrollBox = (canvasElement: HTMLElement) => {
  let box = canvasElement.querySelector('table')?.parentElement ?? null;
  while (box && getComputedStyle(box).overflowY !== 'auto') {
    box = box.parentElement;
  }
  if (!box) throw new Error('scroll container not found');
  return box;
};

/** The rendered body row of `data[index]`, if any. */
const rowOf = (canvasElement: HTMLElement, index: number) =>
  [...canvasElement.querySelectorAll<HTMLElement>('tbody tr')].find((row) =>
    row.textContent?.includes(data[index].email),
  );

const scrollTo = async (box: HTMLElement, scrollTop: number) => {
  box.scrollTop = scrollTop;
  box.dispatchEvent(new Event('scroll'));
  await waitFor(() =>
    expect(Math.abs(box.scrollTop - scrollTop)).toBeLessThanOrEqual(1),
  );
};

/**
 * Rows 0 and 1 stack directly under the sticky header, rows 48 and 49 at the
 * lower edge of the scroll box, all four inside its visible box.
 */
const expectPinnedRowsInView = (canvasElement: HTMLElement) => {
  const box = scrollBox(canvasElement);
  const boxTop = box.getBoundingClientRect().top + box.clientTop;
  const boxBottom = boxTop + box.clientHeight;
  const headBottom = canvasElement
    .querySelector('thead')!
    .getBoundingClientRect().bottom;
  const [first, second, beforeLast, last] = [0, 1, 48, 49].map((index) => {
    const row = rowOf(canvasElement, index);
    expect(row, `row ${index} rendered`).toBeDefined();
    return row!.getBoundingClientRect();
  });
  for (const rect of [first, second, beforeLast, last]) {
    expect(rect.top).toBeGreaterThanOrEqual(boxTop - 1);
    expect(rect.bottom).toBeLessThanOrEqual(boxBottom + 1);
  }
  expect(Math.abs(first.top - headBottom)).toBeLessThanOrEqual(2);
  expect(Math.abs(second.top - first.bottom)).toBeLessThanOrEqual(2);
  expect(Math.abs(last.bottom - boxBottom)).toBeLessThanOrEqual(2);
  expect(Math.abs(beforeLast.bottom - last.top)).toBeLessThanOrEqual(2);
};

// Two rows pinned at the top of the list and two at the end stay in view
// under the sticky header and at the lower edge while the virtualized rows
// scroll, as `PinRowSticky` does without virtualization.
RowPinningStickyWithVirtualization.play = async ({
  canvasElement,
}: StoryContext) => {
  await within(canvasElement).findAllByText(data[0].firstName);
  expect(getComputedStyle(canvasElement.querySelector('thead')!).position).toBe(
    'sticky',
  );
  const box = scrollBox(canvasElement);
  const pin = async (index: number) => {
    await waitFor(() => expect(rowOf(canvasElement, index)).toBeDefined());
    await userEvent.click(pinButton(rowOf(canvasElement, index)!));
    await waitFor(() =>
      expect(rowOf(canvasElement, index)).toHaveAttribute('data-pinned'),
    );
  };
  await pin(0);
  await pin(1);
  await scrollTo(box, box.scrollHeight - box.clientHeight);
  await pin(48);
  await pin(49);

  await scrollTo(box, (box.scrollHeight - box.clientHeight) / 2);
  await waitFor(() => expectPinnedRowsInView(canvasElement));
  await scrollTo(box, box.scrollHeight - box.clientHeight);
  await waitFor(() => expectPinnedRowsInView(canvasElement));

  // Unpinned, row 48 scrolls with the rest again: out of view below.
  await scrollTo(box, (box.scrollHeight - box.clientHeight) / 2);
  await waitFor(() => expectPinnedRowsInView(canvasElement));
  await userEvent.click(pinButton(rowOf(canvasElement, 48)!));
  await waitFor(() => {
    const row = rowOf(canvasElement, 48);
    if (!row) return;
    expect(row).not.toHaveAttribute('data-pinned');
    const boxBottom =
      box.getBoundingClientRect().top + box.clientTop + box.clientHeight;
    expect(row.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      boxBottom - 1,
    );
  });
};

export const RowAndColumnPinning = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    enablePagination={false}
    enableRowPinning
    initialState={{
      columnPinning: {
        start: ['firstName'],
        end: ['lastName'],
      },
      rowPinning: {
        bottom: [],
        top: ['3', '5'],
      },
    }}
    stTableContainerProps={{
      style: {
        maxHeight: '600px',
      },
    }}
  />
);

const bodyRows = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLElement>('tbody tr'),
];

const pinButton = (row: HTMLElement) =>
  within(row).getByRole('button', { name: 'Pin' });

/**
 * `rowPinningDisplayMode: 'top'`: a pinned row moves to the top of the body
 * and leaves its old place.
 */
RowPinningTopMode.play = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByText(data[0].firstName);
  const target = bodyRows(canvasElement)[9]!;
  await userEvent.click(pinButton(target));
  await waitFor(() => {
    const first = bodyRows(canvasElement)[0]!;
    expect(first).toHaveAttribute('data-pinned');
    expect(first).toHaveTextContent(data[9].email);
  });
  expect(
    bodyRows(canvasElement).filter((row) =>
      row.textContent?.includes(data[9].email),
    ),
  ).toHaveLength(1);
};

RowPinningStickyDefaultEnabled.play = async ({
  canvasElement,
  step,
}: StoryContext) => {
  await within(canvasElement).findAllByText(data[0].firstName);
  // A second click on the pin button unpins the row: back to static. Runs
  // first, so no row is pinned when it counts the pinned rows.
  await step('UnpinRow', async () => {
    await userEvent.click(pinButton(bodyRows(canvasElement)[2]!));
    await waitFor(() =>
      expect(bodyRows(canvasElement)[2]).toHaveAttribute('data-pinned'),
    );
    await userEvent.click(pinButton(bodyRows(canvasElement)[2]!));
    await waitFor(() =>
      expect(bodyRows(canvasElement)[2]).not.toHaveAttribute('data-pinned'),
    );
    const row = bodyRows(canvasElement)[2]!;
    expect(row).toHaveTextContent(data[2].email);
    expect(getComputedStyle(row).position).not.toBe('sticky');
    expect(
      canvasElement.querySelectorAll('tbody tr[data-pinned]'),
    ).toHaveLength(0);
  });
  // Default sticky mode: the pinned row keeps its index and turns sticky.
  await step('PinRowSticky', async () => {
    expect(getComputedStyle(bodyRows(canvasElement)[4]!).position).not.toBe(
      'sticky',
    );
    await userEvent.click(pinButton(bodyRows(canvasElement)[4]!));
    await waitFor(() =>
      expect(bodyRows(canvasElement)[4]).toHaveAttribute('data-pinned'),
    );
    const row = bodyRows(canvasElement)[4]!;
    expect(row).toHaveTextContent(data[4].email);
    expect(getComputedStyle(row).position).toBe('sticky');
  });
};

type PinPerson = {
  city: string;
  email: string;
  firstName: string;
  lastName: string;
};

// The rows of the docs row pinning examples (enable-row-pinning-*/makeData.ts).
const pinData: PinPerson[] = [
  {
    firstName: 'Dylan',
    lastName: 'Murray',
    email: 'dmurray@yopmail.com',
    city: 'East Daphne',
  },
  {
    firstName: 'Raquel',
    lastName: 'Kohler',
    email: 'rkholer33@yopmail.com',
    city: 'Columbus',
  },
  {
    firstName: 'Ervin',
    lastName: 'Reinger',
    email: 'ereinger@mailinator.com',
    city: 'South Linda',
  },
  {
    firstName: 'Brittany',
    lastName: 'McCullough',
    email: 'bmccullough44@mailinator.com',
    city: 'Lincoln',
  },
  {
    firstName: 'Branson',
    lastName: 'Frami',
    email: 'bframi@yopmain.com',
    city: 'New York',
  },
  {
    firstName: 'Ben',
    lastName: 'Murray',
    email: 'benm@email.com',
    city: 'Salt Lake City',
  },
  {
    firstName: 'Elena',
    lastName: 'Smith',
    email: 'esmith@yopmail.com',
    city: 'Los Angeles',
  },
  {
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'mjohnson@mailinator.com',
    city: 'Chicago',
  },
  {
    firstName: 'Sophia',
    lastName: 'Brown',
    email: 'sbrown@yopmail.com',
    city: 'Houston',
  },
  {
    firstName: 'Lucas',
    lastName: 'Davis',
    email: 'ldavis@mailinator.com',
    city: 'Phoenix',
  },
  {
    firstName: 'Olivia',
    lastName: 'Garcia',
    email: 'ogarcia@yopmail.com',
    city: 'Philadelphia',
  },
  {
    firstName: 'Liam',
    lastName: 'Rodriguez',
    email: 'lrodriguez@mailinator.com',
    city: 'San Antonio',
  },
  {
    firstName: 'Emma',
    lastName: 'Martinez',
    email: 'emartinez@yopmail.com',
    city: 'San Diego',
  },
  {
    firstName: 'Noah',
    lastName: 'Hernandez',
    email: 'nhernandez@mailinator.com',
    city: 'Dallas',
  },
  {
    firstName: 'Ava',
    lastName: 'Lopez',
    email: 'alopez@yopmail.com',
    city: 'San Jose',
  },
  {
    firstName: 'William',
    lastName: 'Gonzalez',
    email: 'wgonzalez@mailinator.com',
    city: 'Austin',
  },
  {
    firstName: 'Isabella',
    lastName: 'Wilson',
    email: 'iwilson@yopmail.com',
    city: 'Jacksonville',
  },
  {
    firstName: 'James',
    lastName: 'Anderson',
    email: 'janderson@mailinator.com',
    city: 'Fort Worth',
  },
  {
    firstName: 'Mia',
    lastName: 'Thomas',
    email: 'mthomas@yopmail.com',
    city: 'Columbus',
  },
  {
    firstName: 'Alexander',
    lastName: 'Taylor',
    email: 'ataylor@mailinator.com',
    city: 'Charlotte',
  },
  {
    firstName: 'Grace',
    lastName: 'Moore',
    email: 'gmoore@yopmail.com',
    city: 'Indianapolis',
  },
  {
    firstName: 'Ethan',
    lastName: 'White',
    email: 'ewhite@mailinator.com',
    city: 'San Francisco',
  },
  {
    firstName: 'Lily',
    lastName: 'Harris',
    email: 'lharris@yopmail.com',
    city: 'Seattle',
  },
  {
    firstName: 'Daniel',
    lastName: 'Martin',
    email: 'dmartin@mailinator.com',
    city: 'Denver',
  },
  {
    firstName: 'Zoe',
    lastName: 'Jackson',
    email: 'zjackson@yopmail.com',
    city: 'Boston',
  },
  {
    firstName: 'Matthew',
    lastName: 'Thompson',
    email: 'mthompson@mailinator.com',
    city: 'Nashville',
  },
  {
    firstName: 'Ella',
    lastName: 'Garcia',
    email: 'egarcia@yopmail.com',
    city: 'Detroit',
  },
  {
    firstName: 'David',
    lastName: 'Martinez',
    email: 'dmartinez@mailinator.com',
    city: 'Portland',
  },
  {
    firstName: 'Aria',
    lastName: 'Robinson',
    email: 'arobinson@yopmail.com',
    city: 'Las Vegas',
  },
  {
    firstName: 'Joseph',
    lastName: 'Clark',
    email: 'jclark@mailinator.com',
    city: 'Baltimore',
  },
];

/** The columns of the docs row pinning examples. */
const usePinColumns = () =>
  useMemo<ST_ColumnDef<PinPerson>[]>(
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
        accessorKey: 'email',
        icon: MailIcon,
        header: 'Email',
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
      },
    ],
    [],
  );

/** A fixed height for pinned rows: the library's row height per density. */
const pinnedRowHeight: ST_TableOptions<PinPerson>['stTableBodyRowProps'] = ({
  row,
  table,
}) => {
  const density = table.atoms.density.get();
  return {
    style: {
      height: row.getIsPinned()
        ? `${density === 'compact' ? 40 : density === 'comfortable' ? 48 : 56}px`
        : undefined,
    },
  };
};

const pinnedEmails = (canvasElement: HTMLElement) =>
  [
    ...canvasElement.querySelectorAll<HTMLElement>(
      'tbody tr[data-pinned] td[data-flip-column="email"]',
    ),
  ].map((cell) => cell.textContent?.trim());

const rowWith = (canvasElement: HTMLElement, email: string) =>
  bodyRows(canvasElement).find((row) => row.textContent?.includes(email))!;

/** The docs example `sticky-row-pinning`: the same columns, options and data. */
const StickyRowPinningTable = () => {
  const columns = usePinColumns();

  const table = useShadcnTable({
    columns,
    data: pinData,
    enableRowPinning: true,
    enablePagination: false,
    enableStickyHeader: true,
    getRowId: (row) => row.email,
    initialState: {
      rowPinning: {
        top: ['rkholer33@yopmail.com', 'egarcia@yopmail.com'],
        bottom: [],
      },
    },
    stTableContainerProps: {
      className: 'max-h-[400px]',
    },
    stTableBodyRowProps: pinnedRowHeight,
  });

  return <ShadcnTable table={table} />;
};

/** The two rows pinned at the start are sticky; a pinned row unpins. */
export const StickyRowPinning = {
  render: () => <StickyRowPinningTable />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(pinData[0]!.firstName);
    await waitFor(() =>
      expect(pinnedEmails(canvasElement)).toEqual([
        'rkholer33@yopmail.com',
        'egarcia@yopmail.com',
      ]),
    );
    const pinned = rowWith(canvasElement, 'egarcia@yopmail.com');
    expect(getComputedStyle(pinned).position).toBe('sticky');
    await userEvent.click(within(pinned).getByRole('button', { name: 'Pin' }));
    await waitFor(() =>
      expect(pinnedEmails(canvasElement)).toEqual(['rkholer33@yopmail.com']),
    );
  },
};

/** The docs example `static-row-pinning`: the same columns, options and data. */
const StaticRowPinningTable = () => {
  const columns = usePinColumns();

  const table = useShadcnTable({
    columns,
    data: pinData,
    enableRowPinning: true,
    enablePagination: false,
    enableStickyHeader: true,
    rowPinningDisplayMode: 'top-and-bottom',
    getRowId: (row) => row.email,
    stTableContainerProps: {
      className: 'max-h-[400px]',
    },
  });

  return <ShadcnTable table={table} />;
};

/**
 * Each row has two pin buttons: the first pins it to the top of the body,
 * the second to the bottom.
 */
export const StaticRowPinning = {
  render: () => <StaticRowPinningTable />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(pinData[0]!.firstName);
    expect(pinnedEmails(canvasElement)).toEqual([]);
    const toTop = pinData[5]!.email;
    await userEvent.click(
      within(rowWith(canvasElement, toTop)).getAllByRole('button', {
        name: 'Pin',
      })[0]!,
    );
    await waitFor(() => {
      const first = bodyRows(canvasElement)[0]!;
      expect(first).toHaveAttribute('data-pinned');
      expect(first).toHaveTextContent(toTop);
    });
    const toBottom = pinData[6]!.email;
    await userEvent.click(
      within(rowWith(canvasElement, toBottom)).getAllByRole('button', {
        name: 'Pin',
      })[1]!,
    );
    await waitFor(() => {
      const last = bodyRows(canvasElement).at(-1)!;
      expect(last).toHaveAttribute('data-pinned');
      expect(last).toHaveTextContent(toBottom);
    });
  },
};

/** The docs example `sticky-row-selection`: the same columns, options and data. */
const StickyRowSelectionTable = () => {
  const columns = usePinColumns();

  const table = useShadcnTable({
    columns,
    data: pinData,
    enablePagination: false,
    enableRowPinning: true,
    enableRowSelection: true,
    enableStickyHeader: true,
    rowPinningDisplayMode: 'select-sticky',
    getRowId: (row) => row.email,
    initialState: {
      rowPinning: {
        bottom: [],
        top: ['ereinger@mailinator.com'],
      },
      rowSelection: {
        'ereinger@mailinator.com': true,
      },
    },
    stTableContainerProps: {
      className: 'max-h-[400px]',
    },
    stTableBodyRowProps: pinnedRowHeight,
  });

  return <ShadcnTable table={table} />;
};

/** The selected row starts pinned; selecting another row pins it too. */
export const StickyRowSelection = {
  render: () => <StickyRowSelectionTable />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(pinData[0]!.firstName);
    await waitFor(() =>
      expect(pinnedEmails(canvasElement)).toEqual(['ereinger@mailinator.com']),
    );
    await userEvent.click(
      within(rowWith(canvasElement, pinData[4]!.email)).getByRole('checkbox', {
        name: 'Toggle select row',
      }),
    );
    await waitFor(() =>
      expect(pinnedEmails(canvasElement)).toEqual([
        'ereinger@mailinator.com',
        pinData[4]!.email,
      ]),
    );
  },
};
