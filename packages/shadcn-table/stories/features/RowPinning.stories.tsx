import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
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
  title: 'Features/Row Pinning Examples',
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
export const PinRowTopMode = {
  render: () => <RowPinningTopMode />,
  play: async ({ canvasElement }: StoryContext) => {
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
  },
};

/** Default sticky mode: the pinned row keeps its index and turns sticky. */
export const PinRowSticky = {
  render: () => <RowPinningStickyDefaultEnabled />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(data[0].firstName);
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
  },
};

/** A second click on the pin button unpins the row: back to static. */
export const UnpinRow = {
  render: () => <RowPinningStickyDefaultEnabled />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(data[0].firstName);
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
  },
};
