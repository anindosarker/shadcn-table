import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { MapIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  parameters: {
    status: {
      type: 'stable',
    },
  },
  title: 'Styling/Sticky Header Examples',
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
];

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const StickyHeaderDisabledDefault = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const EnableStickyHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
  />
);

export const StickyHeaderShorterTable = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnPinning
    enableRowSelection
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    stTableContainerProps={{ style: { maxHeight: 400 } }}
  />
);

const columnsWithFooters: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    footer: 'First Name',
    header: 'First Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'lastName',
    footer: 'Last Name',
    header: 'Last Name',
    icon: UserIcon,
  },
  {
    accessorKey: 'address',
    footer: 'Address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'state',
    footer: 'State',
    header: 'State',
    icon: MapIcon,
  },
  {
    accessorKey: 'phoneNumber',
    footer: 'Phone Number',
    header: 'Phone Number',
    icon: PhoneIcon,
  },
];

export const disableStickyFooter = () => (
  <ShadcnTable
    columns={columnsWithFooters}
    data={data}
    enableRowNumbers
    enableStickyFooter={false}
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    stTableContainerProps={{ style: { maxHeight: 400 } }}
  />
);

export const enableStickyFooter = () => (
  <ShadcnTable
    columns={columnsWithFooters}
    data={data}
    enableRowNumbers
    enableStickyFooter
    enableStickyHeader
    initialState={{ pagination: { pageIndex: 0, pageSize: 25 } }}
    stTableContainerProps={{ style: { maxHeight: 400 } }}
  />
);

// The sticky header stays at the top of the 400px box while the rows scroll.
StickyHeaderShorterTable.play = async ({ canvasElement }: StoryContext) => {
  await within(canvasElement).findAllByText(data[0]!.firstName);
  const thead = canvasElement.querySelector<HTMLElement>('thead')!;
  expect(getComputedStyle(thead).position).toBe('sticky');
  let box: HTMLElement | null = thead.parentElement;
  while (box && getComputedStyle(box).overflowY !== 'auto') {
    box = box.parentElement;
  }
  expect(box!.getBoundingClientRect().height).toBeLessThanOrEqual(400);
  box!.scrollTop = 300;
  await waitFor(() => expect(box!.scrollTop).toBe(300));
  await waitFor(() =>
    expect(
      Math.abs(
        thead.getBoundingClientRect().top - box!.getBoundingClientRect().top,
      ),
    ).toBeLessThanOrEqual(1),
  );
};

const isStuck = (canvasElement: HTMLElement) => {
  const thead = canvasElement.querySelector<HTMLElement>('thead')!;
  const th = thead.querySelector<HTMLElement>('th')!;
  return (
    getComputedStyle(thead).position === 'sticky' ||
    getComputedStyle(th).position === 'sticky'
  );
};

/**
 * Starts a pointer drag on the right half of a column's resize grip, on
 * whatever element is drawn there, and expects the column to grow.
 */
const dragGripRightHalf = async (
  canvasElement: HTMLElement,
  columnId: string,
  dx: number,
) => {
  const th = canvasElement.querySelector<HTMLElement>(
    `thead th[data-flip-column="${columnId}"]`,
  )!;
  const grip = th.querySelector<HTMLElement>('.cursor-col-resize')!;
  grip.scrollIntoView({ block: 'nearest', inline: 'center' });
  const before = th.getBoundingClientRect().width;
  const box = grip.getBoundingClientRect();
  const point = {
    clientX: box.left + box.width * 0.75,
    clientY: box.top + box.height / 2,
  };
  const hit = document.elementFromPoint(point.clientX, point.clientY)!;
  fireEvent.mouseDown(hit, point);
  fireEvent.mouseMove(document, { ...point, clientX: point.clientX + dx });
  fireEvent.mouseUp(document, { ...point, clientX: point.clientX + dx });
  await waitFor(() =>
    expect(th.getBoundingClientRect().width - before).toBeGreaterThanOrEqual(
      dx / 2,
    ),
  );
};

// The option sets how the table starts; the View settings switch then turns
// the sticky header off and on (D120). Full screen keeps it sticky with the
// switch off. With the header sticky, a resize drag starts from the right
// half of the grip too (D126).
EnableStickyHeader.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  await canvas.findAllByText(data[0]!.firstName);
  expect(isStuck(canvasElement)).toBe(true);

  await userEvent.click(canvas.getByRole('button', { name: 'View settings' }));
  const toggle = await body.findByRole('switch', { name: 'Sticky header' });
  expect(toggle).toBeChecked();
  await userEvent.click(toggle);
  await waitFor(() => expect(isStuck(canvasElement)).toBe(false));
  await userEvent.click(toggle);
  await waitFor(() => expect(isStuck(canvasElement)).toBe(true));
  await userEvent.keyboard('{Escape}');
  await waitFor(() =>
    expect(body.queryByRole('switch', { name: 'Sticky header' })).toBeNull(),
  );

  await dragGripRightHalf(canvasElement, 'lastName', 60);

  await userEvent.click(canvas.getByRole('button', { name: 'View settings' }));
  await userEvent.click(
    await body.findByRole('switch', { name: 'Sticky header' }),
  );
  await waitFor(() => expect(isStuck(canvasElement)).toBe(false));
  await userEvent.keyboard('{Escape}');
  const fullScreen = canvas.getByRole('button', { name: 'Toggle full screen' });
  await userEvent.click(fullScreen);
  await waitFor(() => expect(isStuck(canvasElement)).toBe(true));
  await userEvent.click(fullScreen);
  await waitFor(() => expect(isStuck(canvasElement)).toBe(false));
};
