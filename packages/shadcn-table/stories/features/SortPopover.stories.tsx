import { CircleDotIcon, FlagIcon, TypeIcon } from 'lucide-react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import {
  type ST_ColumnDef,
  type ST_TableOptions,
  ShadcnTable,
} from '@/components/ui/shadcn-table';

// The sort editor: the toolbar button opens the column picker while no sort
// exists and the editor otherwise; a chip in the chip row opens the editor.
const meta: Meta = {
  title: 'Features/Sort Popover Examples',
};

export default meta;

type Task = { name: string; priority: string; status: string };

const data: Task[] = [
  { name: 'Build search index', priority: 'High', status: 'Done' },
  { name: 'Plan audit log', priority: 'Low', status: 'In Progress' },
  { name: 'Review billing page', priority: 'High', status: 'Not Started' },
  { name: 'Ship export job', priority: 'Medium', status: 'Done' },
];

const columns: ST_ColumnDef<Task>[] = [
  { accessorKey: 'name', header: 'Name', icon: TypeIcon },
  { accessorKey: 'status', header: 'Status', icon: CircleDotIcon },
  { accessorKey: 'priority', header: 'Priority', icon: FlagIcon },
];

const options: Partial<ST_TableOptions<Task>> = {
  columnFilterDisplayMode: 'chips',
  enableSortPopover: true,
  enableViewSettings: true,
};

export const SortPopoverDefault = () => (
  <ShadcnTable columns={columns} data={data} {...options} />
);

export const SortPopoverSeeded = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{
      sorting: [
        { desc: false, id: 'status' },
        { desc: true, id: 'name' },
      ],
    }}
    {...options}
  />
);

export const SortPopoverSingleSort = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableMultiSort={false}
    initialState={{ sorting: [{ desc: false, id: 'name' }] }}
    {...options}
  />
);

const firstColumnTexts = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('tbody tr')].map(
    (row) => row.querySelector('td')?.textContent ?? '',
  );

const ruleIds = () =>
  [...document.body.querySelectorAll<HTMLElement>('[data-sort-rule]')].map(
    (rule) => rule.dataset.sortRule,
  );

export const PickerThenEditor = {
  render: SortPopoverDefault,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    // No sort: the button opens the column picker.
    await userEvent.click(canvas.getByRole('button', { name: 'Sort' }));
    await userEvent.click(await body.findByRole('option', { name: 'Status' }));
    await waitFor(() =>
      expect(firstColumnTexts(canvasElement)[0]).toContain(
        'Build search index',
      ),
    );
    // The open popover swaps to the editor.
    await waitFor(() => expect(ruleIds()).toEqual(['status']));
    expect(body.queryByRole('option', { name: 'Name' })).toBeNull();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(ruleIds()).toEqual([]));

    // One sort: the chip shows the column label and opens the editor.
    const chip = await canvas.findByRole('button', { name: 'Status' });
    await userEvent.click(chip);
    await waitFor(() => expect(ruleIds()).toEqual(['status']));

    await userEvent.click(body.getByRole('button', { name: 'Add sort' }));
    await userEvent.click(
      await body.findByRole('option', { name: 'Priority' }),
    );
    await waitFor(() => expect(ruleIds()).toEqual(['status', 'priority']));
    await canvas.findByRole('button', { name: '2 sorts' });
  },
};

export const ReorderRemoveDelete = {
  render: SortPopoverSeeded,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    // Status ascending, then Name descending.
    await waitFor(() =>
      expect(firstColumnTexts(canvasElement)[1]).toContain(
        'Build search index',
      ),
    );
    await userEvent.click(canvas.getByRole('button', { name: '2 sorts' }));
    await waitFor(() => expect(ruleIds()).toEqual(['status', 'name']));

    // Drag the second rule's handle onto the first row.
    const rules =
      document.body.querySelectorAll<HTMLElement>('[data-sort-rule]');
    const handle = within(rules[1]).getByRole('img', {
      name: 'Drag to reorder',
    });
    const dataTransfer = new DataTransfer();
    fireEvent.dragStart(handle, { dataTransfer });
    fireEvent.dragOver(rules[0], { dataTransfer });
    await waitFor(() => expect(rules[0].className).toContain('bg-muted'));
    fireEvent.drop(rules[0], { dataTransfer });
    fireEvent.dragEnd(handle, { dataTransfer });
    await waitFor(() => expect(ruleIds()).toEqual(['name', 'status']));
    await waitFor(() =>
      expect(firstColumnTexts(canvasElement)[1]).toContain(
        'Review billing page',
      ),
    );

    await userEvent.click(
      body.getByRole('button', { name: 'Remove sort on Name' }),
    );
    await waitFor(() => expect(ruleIds()).toEqual(['status']));
    await canvas.findByRole('button', { name: 'Status' });

    await userEvent.click(body.getByRole('button', { name: 'Delete sort' }));
    await waitFor(() => expect(ruleIds()).toEqual([]));
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Status' })).toBeNull(),
    );
    expect(
      canvas.getByRole('button', { name: 'Sort' }).getAttribute('data-variant'),
    ).not.toBe('secondary');
  },
};

export const SingleSortHasNoAdd = {
  render: SortPopoverSingleSort,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(canvas.getByRole('button', { name: 'Sort' }));
    await waitFor(() => expect(ruleIds()).toEqual(['name']));
    expect(body.queryByRole('button', { name: 'Add sort' })).toBeNull();
  },
};
