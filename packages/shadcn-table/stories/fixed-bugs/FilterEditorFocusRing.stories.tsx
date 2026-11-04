import { CircleDotIcon, FlagIcon, TypeIcon } from 'lucide-react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';

// The focused filter input shows the stock 3 px focus ring and its rounded
// edge: no ancestor of its input group clips within 3 px of the group, in the
// chip editor and in the subheader filter row (F31).

const meta: Meta = {
  title: 'Fixed Bugs/Filter Editor Focus Ring',
};

export default meta;

type Task = { name: string; priority: string; status: string };

const data: Task[] = [
  { name: 'Build search index', priority: 'High', status: 'Done' },
  { name: 'Plan audit log', priority: 'Low', status: 'In Progress' },
];

const columns: ST_ColumnDef<Task>[] = [
  { accessorKey: 'name', header: 'Name', icon: TypeIcon },
  { accessorKey: 'status', header: 'Status', icon: CircleDotIcon },
  { accessorKey: 'priority', header: 'Priority', icon: FlagIcon },
];

const RING = 3;

const clipsOverflow = (element: Element) => {
  const { overflowX, overflowY } = getComputedStyle(element);
  return overflowX !== 'visible' || overflowY !== 'visible';
};

// Every ancestor that clips its overflow keeps the group's rect, grown by the
// ring on every side, inside its padding box.
const expectRingNotClipped = (input: HTMLElement) => {
  const group = input.closest<HTMLElement>('[data-slot="input-group"]');
  if (!group) throw new Error('input group not found');
  expect(getComputedStyle(group).boxShadow).not.toBe('none');

  // The filter container, when it clips, pads the group by at least the ring,
  // and its height still measures the whole input with the padding.
  const container = group.closest<HTMLElement>(
    '[data-slot="collapsible-content"]',
  );
  if (!container) throw new Error('filter container not found');
  if (clipsOverflow(container)) {
    const style = getComputedStyle(container);
    for (const side of ['top', 'right', 'bottom', 'left']) {
      expect(
        parseFloat(style.getPropertyValue(`padding-${side}`)),
        `filter container padding-${side}`,
      ).toBeGreaterThanOrEqual(RING);
    }
    expect(container.scrollHeight).toBeLessThanOrEqual(container.clientHeight);
  }

  const rect = group.getBoundingClientRect();
  for (
    let ancestor = group.parentElement;
    ancestor && ancestor !== document.body;
    ancestor = ancestor.parentElement
  ) {
    if (!clipsOverflow(ancestor)) continue;
    const box = ancestor.getBoundingClientRect();
    const left = box.left + ancestor.clientLeft;
    const top = box.top + ancestor.clientTop;
    const label = `${ancestor.tagName.toLowerCase()}.${ancestor.className}`;
    expect(rect.left - RING, label).toBeGreaterThanOrEqual(left - 0.5);
    expect(rect.top - RING, label).toBeGreaterThanOrEqual(top - 0.5);
    expect(rect.right + RING, label).toBeLessThanOrEqual(
      left + ancestor.clientWidth + 0.5,
    );
    expect(rect.bottom + RING, label).toBeLessThanOrEqual(
      top + ancestor.clientHeight + 0.5,
    );
  }
};

export const ChipEditorRing = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="chips"
      columns={columns}
      data={data}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'Status' }));
    const input = await body.findByPlaceholderText('Filter by Status');
    await userEvent.click(input);
    await waitFor(() => expect(document.activeElement).toBe(input));
    await waitFor(() => expectRingNotClipped(input));
  },
};

export const SubheaderRowRing = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="subheader"
      columns={columns}
      data={data}
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Plan audit log');

    const input = await canvas.findByPlaceholderText('Filter by Status');
    await userEvent.click(input);
    await waitFor(() => expect(document.activeElement).toBe(input));
    await waitFor(() => expectRingNotClipped(input));
  },
};
