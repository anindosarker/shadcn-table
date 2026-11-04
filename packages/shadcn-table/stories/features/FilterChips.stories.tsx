import { CircleDotIcon, FlagIcon, TypeIcon } from 'lucide-react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  type ST_ColumnDef,
  type ST_TableOptions,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';

// Chips mode: filters live as chips in the toolbar, added from the column
// picker, edited in one value editor that stays where it was opened.
const meta: Meta = {
  title: 'Features/Filter Chips Examples',
};

export default meta;

type Task = { name: string; priority: string; status: string };

const data: Task[] = [
  { name: 'Build search index', priority: 'High', status: 'Done' },
  { name: 'Plan audit log', priority: 'Low', status: 'In Progress' },
  { name: 'Review billing page', priority: 'High', status: 'Done' },
  { name: 'Ship export job', priority: 'Medium', status: 'Not Started' },
];

const columns: ST_ColumnDef<Task>[] = [
  {
    accessorKey: 'name',
    columnFilterModeOptions: ['contains', 'startsWith', 'empty', 'notEmpty'],
    enableColumnFilterModes: true,
    filterFn: 'contains',
    header: 'Name',
    icon: TypeIcon,
  },
  { accessorKey: 'status', header: 'Status', icon: CircleDotIcon },
  { accessorKey: 'priority', header: 'Priority', icon: FlagIcon },
];

const options: Partial<ST_TableOptions<Task>> = {
  columnFilterDisplayMode: 'chips',
  enableSortPopover: true,
  enableViewSettings: true,
};

export const ChipsDefault = () => (
  <ShadcnTable columns={columns} data={data} {...options} />
);

export const ChipsSeeded = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{
      columnFilters: [
        { id: 'status', value: 'Done' },
        { id: 'priority', value: 'High' },
      ],
    }}
    {...options}
  />
);

export const ChipsHiddenColumn = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{
      columnFilters: [{ id: 'status', value: 'Done' }],
      columnVisibility: { status: false },
    }}
    {...options}
  />
);

// The column menu opens the header editor by setting the slice; this story
// sets it from a button outside the table.
export const ChipsHeaderEditor = () => {
  const table = useShadcnTable({ columns, data, ...options });
  return (
    <>
      <button
        onClick={() =>
          table.setFilterChips((old) => ({
            columnIds: old.columnIds.includes('status')
              ? old.columnIds
              : [...old.columnIds, 'status'],
            openAnchor: 'header',
            openColumnId: 'status',
          }))
        }
        type="button"
      >
        Open status editor
      </button>
      <ShadcnTable table={table} />
    </>
  );
};

const chipOf = (canvasElement: HTMLElement, id: string) =>
  canvasElement.querySelector<HTMLElement>(`[data-filter-chip="${id}"]`);

const bodyRows = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('tbody tr');

export const AddThroughPicker = {
  render: ChipsDefault,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'Status' }));

    // The popover swaps to the editor in place and the chip flashes.
    const back = await body.findByRole('button', { name: 'Back to columns' });
    const chip = await waitFor(() => {
      const element = chipOf(canvasElement, 'status');
      expect(element).not.toBeNull();
      return element!;
    });
    expect(chip.getAnimations().length).toBeGreaterThan(0);

    const input = await body.findByRole('textbox', {
      name: 'Filter by Status',
    });
    await waitFor(() => expect(document.activeElement).toBe(input));
    await userEvent.type(input, 'Done');
    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(2));
    await waitFor(() => expect(chip.textContent).toContain('Status: Done'));

    await userEvent.click(back);
    await body.findByRole('option', { name: 'Priority' });
    expect(body.queryByRole('option', { name: 'Status' })).toBeNull();
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(body.queryByRole('option', { name: 'Priority' })).toBeNull(),
    );
    // An empty value keeps its chip; "+ Filter" and "Clear filters" show.
    expect(chipOf(canvasElement, 'status')).not.toBeNull();
    expect(canvas.getByRole('button', { name: 'Clear filters' })).toBeVisible();
  },
};

export const RemoveAndClear = {
  render: ChipsSeeded,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Build search index');
    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(2));
    expect(chipOf(canvasElement, 'status')?.textContent).toContain(
      'Status: Done',
    );
    expect(chipOf(canvasElement, 'priority')?.textContent).toContain(
      'Priority: High',
    );

    await userEvent.click(chipOf(canvasElement, 'priority')!);
    await waitFor(() =>
      expect(document.activeElement).toBe(
        body.getByRole('textbox', { name: 'Filter by Priority' }),
      ),
    );
    await userEvent.click(body.getByRole('button', { name: 'Remove filter' }));
    await waitFor(() => expect(chipOf(canvasElement, 'priority')).toBeNull());
    expect(chipOf(canvasElement, 'status')).not.toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear filters' }),
    );
    await waitFor(() => expect(chipOf(canvasElement, 'status')).toBeNull());
    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(4));
    expect(canvas.queryByRole('button', { name: 'Clear filters' })).toBeNull();
  },
};

export const HiddenColumnNotice = {
  render: ChipsHiddenColumn,
  play: async ({ canvasElement }: StoryContext) => {
    const body = within(document.body);
    await waitFor(() => expect(chipOf(canvasElement, 'status')).not.toBeNull());
    await userEvent.click(chipOf(canvasElement, 'status')!);
    await body.findByText('Show the column to edit this filter.');
    expect(
      body.queryByRole('textbox', { name: 'Filter by Status' }),
    ).toBeNull();
  },
};

export const HeaderAnchoredEditor = {
  render: ChipsHeaderEditor,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(
      canvas.getByRole('button', { name: 'Open status editor' }),
    );
    const input = await body.findByRole('textbox', {
      name: 'Filter by Status',
    });
    await waitFor(() => expect(document.activeElement).toBe(input));
    expect(body.queryByRole('button', { name: 'Back to columns' })).toBeNull();
    const chip = chipOf(canvasElement, 'status');
    expect(chip).not.toBeNull();
    expect(chip!.getAnimations().length).toBeGreaterThan(0);

    const headerCell = canvas.getByRole('columnheader', { name: /Status/ });
    const chevron = headerCell.querySelector<HTMLElement>(
      '[aria-haspopup="menu"]',
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(
        body.queryByRole('textbox', { name: 'Filter by Status' }),
      ).toBeNull(),
    );
    await waitFor(() => expect(document.activeElement).toBe(chevron));
  },
};

const modeItem = (name: string) =>
  within(document.body)
    .getAllByRole('menuitemradio')
    .find(
      (item) =>
        item.textContent?.trim().endsWith(name) &&
        !item.textContent.includes(`Not ${name}`),
    );

export const FilterModePicker = {
  render: ChipsDefault,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'Name' }));
    const modeButton = await body.findByRole('button', {
      name: 'Change filter mode',
    });
    expect(modeButton.textContent).toContain('contains');
    // The in-field mode button does not render in chips mode.
    expect(
      body
        .getByRole('textbox', { name: 'Filter by Name' })
        .closest('[data-slot="input-group"]')
        ?.querySelector('[aria-label="Change filter mode"]'),
    ).toBeNull();

    await userEvent.type(
      body.getByRole('textbox', { name: 'Filter by Name' }),
      'Build',
    );
    await waitFor(() =>
      expect(chipOf(canvasElement, 'name')?.textContent).toContain(
        'Name contains: Build',
      ),
    );

    await userEvent.click(modeButton);
    await waitFor(() => expect(modeItem('Empty')).toBeDefined());
    await userEvent.click(modeItem('Empty')!);
    await waitFor(() =>
      expect(
        body.queryByRole('textbox', { name: 'Filter by Name' }),
      ).toBeNull(),
    );
    await waitFor(() =>
      expect(chipOf(canvasElement, 'name')?.textContent).toContain(
        'Name is empty',
      ),
    );

    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
    await userEvent.click(
      await body.findByRole('button', { name: 'Remove filter' }),
    );
    await waitFor(() => expect(chipOf(canvasElement, 'name')).toBeNull());
    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(4));

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'Name' }));
    await waitFor(() =>
      expect(
        body.getByRole('button', { name: 'Change filter mode' }).textContent,
      ).toContain('contains'),
    );
  },
};
