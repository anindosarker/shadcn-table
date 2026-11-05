import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import {
  Building2Icon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Column Dragging Examples',
};

export default meta;

type Person = {
  address: string;
  city: string;
  email: string;
  firstName: string;
  lastName: string;
  state: string;
};

const columns: ST_ColumnDef<Person>[] = [
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

const data = [...Array(100)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  email: faker.internet.email(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

const headerNames = (canvasElement: HTMLElement) =>
  Array.from(canvasElement.querySelectorAll('thead th')).map((th) =>
    (th.textContent ?? '').trim(),
  );

const headerCell = (canvasElement: HTMLElement, name: string) =>
  [...canvasElement.querySelectorAll<HTMLElement>('thead th')].find((th) =>
    (th.textContent ?? '').trim().startsWith(name),
  ) as HTMLElement;

const bodyCell = (canvasElement: HTMLElement, id: string) =>
  canvasElement.querySelector<HTMLElement>(
    `tbody [data-flip-column="${id}"]`,
  ) as HTMLElement;

/** Ends the drag with `dropEffect`: `none` is Escape or a drop outside. */
const dragEnd = (element: HTMLElement, dropEffect: 'move' | 'none') => {
  const event = new DragEvent('dragend', { bubbles: true });
  Object.defineProperty(event, 'dataTransfer', { value: { dropEffect } });
  fireEvent(element, event);
};

/** A dragover on the table with the pointer over the middle of `target`. */
const dragOverSlot = (canvasElement: HTMLElement, target: HTMLElement) => {
  const rect = target.getBoundingClientRect();
  fireEvent.dragOver(canvasElement.querySelector('table') as HTMLElement, {
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height / 2,
  });
};

/**
 * The header cell is the drag source: mid-drag only the headers slide, the
 * body stays still; the drop reorders and the body cells catch up.
 */
export const ColumnDraggingEnabled = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnDragging
      enableColumnOrdering
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const headers = await canvas.findAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('First Name');
    expect(headers[0]).toHaveAttribute('draggable', 'true');
    expect(
      within(headers[0]).queryByRole('button', { name: 'Move' }),
    ).toBeNull();

    const source = headerCell(canvasElement, 'First Name');
    fireEvent.dragStart(source);
    dragOverSlot(canvasElement, headerCell(canvasElement, 'Last Name'));
    await waitFor(() =>
      expect(
        parseFloat(headerCell(canvasElement, 'Last Name').style.translate),
      ).toBeLessThan(0),
    );
    expect(bodyCell(canvasElement, 'lastName').style.translate).toBe('');
    expect(
      getComputedStyle(bodyCell(canvasElement, 'lastName')).translate,
    ).toBe('none');

    dragEnd(source, 'move');
    await waitFor(() =>
      expect(headerNames(canvasElement)).toEqual([
        'Last Name',
        'First Name',
        'Email Address',
        'Address',
        'City',
        'State',
      ]),
    );
    expect(
      bodyCell(canvasElement, 'firstName').getAnimations().length,
    ).toBeGreaterThan(0);
    expect(headerCell(canvasElement, 'Last Name').style.translate).toBe('');
  },
};

/** Escape (a drag that ends with no drop effect) reorders nothing. */
export const ColumnDraggingCancelled = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnDragging
      enableColumnOrdering
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByRole('columnheader');
    const source = headerCell(canvasElement, 'First Name');
    fireEvent.dragStart(source);
    dragOverSlot(canvasElement, headerCell(canvasElement, 'City'));
    await waitFor(() =>
      expect(headerCell(canvasElement, 'City').style.translate).not.toBe(''),
    );
    dragEnd(source, 'none');
    await waitFor(() =>
      expect(headerCell(canvasElement, 'City').style.translate).toBe(''),
    );
    expect(headerNames(canvasElement)).toEqual([
      'First Name',
      'Last Name',
      'Email Address',
      'Address',
      'City',
      'State',
    ]);
  },
};

/**
 * A locked column looks normal at rest and shows the striped Fixed overlay
 * only while another column drags.
 */
export const ColumnDraggingLockedColumn = {
  render: () => (
    <ShadcnTable
      columns={columns.map((column) =>
        column.header === 'Email Address'
          ? { ...column, enableColumnOrdering: false }
          : column,
      )}
      data={data}
      enableColumnOrdering
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByRole('columnheader');
    const locked = headerCell(canvasElement, 'Email Address');
    expect(locked).not.toHaveAttribute('draggable');
    const overlay = within(locked).getByText('Fixed').closest('span');
    expect(overlay).toHaveClass('opacity-0');

    const source = headerCell(canvasElement, 'First Name');
    fireEvent.dragStart(source);
    await waitFor(() => expect(overlay).toHaveClass('opacity-100'));
    dragOverSlot(canvasElement, locked);
    expect(locked.style.translate).toBe('');
    dragEnd(source, 'none');
    await waitFor(() => expect(overlay).toHaveClass('opacity-0'));
    expect(headerNames(canvasElement)[2]).toMatch(/^Email Address/);
  },
};

/** With `showColumnDragHandle` the grip renders and drags the column too. */
export const ColumnDraggingWithGrip = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnDragging
      enableColumnOrdering
      showColumnDragHandle
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const headers = await canvas.findAllByRole('columnheader');
    const handle = within(headers[0]).getByRole('button', { name: 'Move' });
    fireEvent.dragStart(handle);
    fireEvent.dragEnter(headers[2]);
    fireEvent.dragOver(headers[2]);
    fireEvent.drop(headers[2]);
    fireEvent.dragEnd(handle);
    await waitFor(() =>
      expect(headerNames(canvasElement)).toEqual([
        'Last Name',
        'Email Address',
        'First Name',
        'Address',
        'City',
        'State',
      ]),
    );
  },
};

export const ColumnDraggingDisabledPerColumn = () => (
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
        enableColumnDragging: false,
        header: 'State',
        icon: MapIcon,
      },
    ]}
    data={data}
    enableColumnDragging
  />
);

/**
 * The elements that started a box-shadow highlight while `run` ran, read
 * from `element.animate()` calls so a loaded machine cannot miss the 600 ms
 * flash.
 */
const recordHighlights = async (run: () => Promise<void>) => {
  const highlighted = new Set<Element>();
  const animate = Element.prototype.animate;
  Element.prototype.animate = function (
    this: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions,
  ) {
    if (
      Array.isArray(keyframes) &&
      keyframes.some((keyframe) => keyframe.boxShadow !== undefined)
    ) {
      highlighted.add(this);
    }
    return animate.call(this, keyframes, options);
  };
  try {
    await run();
  } finally {
    Element.prototype.animate = animate;
  }
  return highlighted;
};

/**
 * On drop the moved column, header and body cells, flashes the primary tint
 * (D37); the other columns do not.
 */
export const DropHighlightsColumn = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnDragging
      enableColumnOrdering
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByRole('columnheader');
    const source = headerCell(canvasElement, 'First Name');
    fireEvent.dragStart(source);
    dragOverSlot(canvasElement, headerCell(canvasElement, 'Last Name'));
    await waitFor(() =>
      expect(
        parseFloat(headerCell(canvasElement, 'Last Name').style.translate),
      ).toBeLessThan(0),
    );
    const highlighted = await recordHighlights(async () => {
      dragEnd(source, 'move');
      await waitFor(() =>
        expect(headerNames(canvasElement).slice(0, 2)).toEqual([
          'Last Name',
          'First Name',
        ]),
      );
    });
    const highlights = (element: Element) => highlighted.has(element);
    const firstNameCells = canvasElement.querySelectorAll(
      'tbody td[data-flip-column="firstName"]',
    );
    expect(firstNameCells.length).toBeGreaterThan(0);
    for (const cell of firstNameCells) expect(highlights(cell)).toBe(true);
    expect(highlights(headerCell(canvasElement, 'First Name'))).toBe(true);
    for (const cell of canvasElement.querySelectorAll(
      'tbody td[data-flip-column="email"]',
    )) {
      expect(highlights(cell)).toBe(false);
    }
  },
};

/** Whether the topmost element at the centre of `cell`'s drawn box is in it. */
const drawnOnTop = (cell: HTMLElement) => {
  const rect = cell.getBoundingClientRect();
  const hit = document.elementFromPoint(
    rect.left + rect.width / 2,
    rect.top + rect.height / 2,
  );
  return !!hit && cell.contains(hit);
};

/**
 * On drop the moved column slides on top of the cells it passes (F47): at
 * every moment of the first 100 ms of the slide, the topmost element at the
 * centre of its header and first body cell is that cell. Once the slide ends
 * the cells keep no inline stacking.
 */
export const MovedColumnOnTop = {
  render: () => (
    <ShadcnTable
      columns={columns.map((column) => ({ ...column, size: 60 }))}
      data={data.slice(0, 5)}
      enableColumnDragging
      enableColumnOrdering
      layoutMode="grid-no-grow"
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByRole('columnheader');
    const source = headerCell(canvasElement, 'City');
    fireEvent.dragStart(source);
    dragOverSlot(canvasElement, headerCell(canvasElement, 'Email Address'));
    await waitFor(() =>
      expect(
        parseFloat(headerCell(canvasElement, 'Email Address').style.translate),
      ).toBeGreaterThan(0),
    );
    dragEnd(source, 'move');
    await waitFor(() =>
      expect(headerNames(canvasElement).slice(0, 5)).toEqual([
        'First Name',
        'Last Name',
        'City',
        'Email Address',
        'Address',
      ]),
    );
    const table = canvasElement.querySelector('table') as HTMLElement;
    const slides = table
      .getAnimations({ subtree: true })
      .filter((animation) =>
        (animation.effect as KeyframeEffect | null)
          ?.getKeyframes()
          .some((keyframe) => keyframe.translate !== undefined),
      );
    expect(slides.length).toBeGreaterThan(0);
    const header = headerCell(canvasElement, 'City');
    const cell = bodyCell(canvasElement, 'city');
    for (const animation of slides) animation.pause();
    for (let time = 0; time <= 100; time += 10) {
      for (const animation of slides) animation.currentTime = time;
      expect({ time, header: drawnOnTop(header) }).toEqual({
        time,
        header: true,
      });
      expect({ time, body: drawnOnTop(cell) }).toEqual({ time, body: true });
    }
    for (const animation of slides) animation.finish();
    await waitFor(() => expect(cell.style.zIndex).toBe(''));
    expect(header.style.zIndex).toBe('');
  },
};
