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
    await waitFor(() =>
      expect(chip.textContent).toContain('Status fuzzy: Done'),
    );

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
    // Modes are on by default, so the chips name the mode (D4).
    expect(chipOf(canvasElement, 'status')?.textContent).toContain(
      'Status fuzzy: Done',
    );
    expect(chipOf(canvasElement, 'priority')?.textContent).toContain(
      'Priority fuzzy: High',
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
      '[data-st-column-actions]',
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

// The table-level flag with no column flags or option list offers every mode,
// as the subheader's mode button does.
export const FilterModePickerTableLevel = {
  render: () => (
    <ShadcnTable
      columns={columns.map((column) => ({
        ...column,
        columnFilterModeOptions: undefined,
        enableColumnFilterModes: undefined,
      }))}
      data={data}
      enableColumnFilterModes
      {...options}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'Status' }));
    const modeButton = await body.findByRole('button', {
      name: 'Change filter mode',
    });
    await userEvent.click(modeButton);
    await waitFor(() => expect(modeItem('Starts With')).toBeDefined());
    expect(modeItem('Contains')).toBeDefined();
    expect(modeItem('Empty')).toBeDefined();
  },
};

// A custom top toolbar renders no chips row; the column menu's Filter item
// still opens the header-anchored editor.
export const ChipsCustomToolbar = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    renderTopToolbar={() => <div>Custom toolbar</div>}
    {...options}
  />
);

export const HeaderEditorWithCustomToolbar = {
  render: ChipsCustomToolbar,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    const headerCell = canvas.getByRole('columnheader', { name: /Status/ });
    await userEvent.click(
      within(headerCell).getByRole('button', { name: 'Column Actions' }),
    );
    await userEvent.click(
      await body.findByRole('menuitem', { name: /^Filter$/ }),
    );
    const input = await body.findByRole('textbox', {
      name: 'Filter by Status',
    });
    await waitFor(() => expect(document.activeElement).toBe(input));
    // Anchored to the header cell: the editor opens below it.
    const editor = input.closest<HTMLElement>(
      '[data-slot="popover-content"], [data-slot="popover"], [role="dialog"]',
    );
    expect(editor).not.toBeNull();
    expect(editor!.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      headerCell.getBoundingClientRect().bottom - 1,
    );
    await userEvent.type(input, 'Done');
    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(2));
  },
};

const statuses = ['Blocked', 'Done', 'In Progress', 'In Review', 'Not Started'];

// F55 (D72): the chip editor keeps its 260 px width; the multi-select chips
// wrap and the field grows in height instead of widening the popover.
export const ChipEditorKeepsWidth = {
  render: () => (
    <ShadcnTable
      columns={columns.map((column) =>
        column.accessorKey === 'status'
          ? {
              ...column,
              filterSelectOptions: statuses,
              filterVariant: 'multi-select',
            }
          : column,
      )}
      data={data}
      {...options}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'Status' }));
    const input = await body.findByRole('combobox', {
      name: 'Filter by Status',
    });
    const editor = input.closest<HTMLElement>('[data-slot="popover-content"]');
    expect(editor).not.toBeNull();
    const field = input.closest<HTMLElement>('[data-slot="combobox-chips"]')!;
    await waitFor(() =>
      expect(
        Math.abs(editor!.getBoundingClientRect().width - 260),
        `editor width ${editor!.getBoundingClientRect().width} before the picks`,
      ).toBeLessThanOrEqual(1),
    );
    const heightBefore = field.getBoundingClientRect().height;

    for (const status of statuses) {
      const name = new RegExp(`^${status}`);
      if (!body.queryByRole('option', { name })) {
        await userEvent.click(input);
      }
      await userEvent.click(await body.findByRole('option', { name }));
    }
    await waitFor(() =>
      expect(
        field.querySelectorAll('[data-slot="combobox-chip"]'),
      ).toHaveLength(statuses.length),
    );
    await waitFor(() => {
      expect(
        Math.abs(editor!.getBoundingClientRect().width - 260),
        `editor width ${editor!.getBoundingClientRect().width} after the picks`,
      ).toBeLessThanOrEqual(1);
      expect(field.getBoundingClientRect().height).toBeGreaterThan(
        heightBefore,
      );
    });
  },
};

/** The open filter mode menu's radio items, once it holds any. */
const modeMenuItems = () =>
  waitFor(() => {
    const items = within(document.body).getAllByRole('menuitemradio');
    expect(items.length).toBeGreaterThan(0);
    return items;
  });

/**
 * Fresh columns with no filter mode flag, mode list or filterFn; fresh because
 * the table writes the picked mode onto its column defs.
 */
const plainColumns = (): ST_ColumnDef<Task>[] =>
  columns.map((column) => ({
    ...column,
    columnFilterModeOptions: undefined,
    enableColumnFilterModes: undefined,
    filterFn: undefined,
  }));

// D4: a chips table without `enableColumnFilterModes` shows the mode picker
// on the chip editor's top line, with all 14 modes.
export const ModePickerByDefaultChips = {
  render: () => (
    <ShadcnTable columns={plainColumns()} data={data} {...options} />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'Name' }));
    await body.findByRole('textbox', { name: 'Filter by Name' });
    await userEvent.click(
      await body.findByRole('button', { name: 'Change filter mode' }),
    );
    const items = await modeMenuItems();
    expect(items).toHaveLength(14);
    expect(items[0].textContent).toContain('Fuzzy');
  },
};

// D4: a multi-select column offers Includes any, Includes all and Excludes
// after its 14 modes; Excludes drops the rows holding a picked value.
export const MultiSelectArrayModes = {
  render: () => (
    <ShadcnTable
      columns={plainColumns().map((column) =>
        column.accessorKey === 'status'
          ? {
              ...column,
              filterSelectOptions: ['Done', 'In Progress', 'Not Started'],
              filterVariant: 'multi-select',
            }
          : column,
      )}
      data={data}
      {...options}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'Status' }));
    const input = await body.findByRole('combobox', {
      name: 'Filter by Status',
    });
    await userEvent.click(
      await body.findByRole('button', { name: 'Change filter mode' }),
    );
    const items = await modeMenuItems();
    expect(items).toHaveLength(17);
    expect(items.slice(14).map((item) => item.textContent?.trim())).toEqual([
      expect.stringContaining('Includes any'),
      expect.stringContaining('Includes all'),
      expect.stringContaining('Excludes'),
    ]);
    // The default fn stays checked.
    await waitFor(() =>
      expect(
        body
          .getAllByRole('menuitemradio', { checked: true })
          .map((item) => item.textContent?.trim()),
      ).toEqual([expect.stringContaining('Includes any')]),
    );

    await userEvent.click(
      body
        .getAllByRole('menuitemradio')
        .find((item) => item.textContent?.includes('Excludes'))!,
    );
    await waitFor(() => expect(body.queryByRole('menu')).toBeNull());
    await userEvent.click(input);
    await userEvent.click(await body.findByRole('option', { name: /^Done/ }));
    await waitFor(() => expect(bodyRows(canvasElement)).toHaveLength(2));
    expect(canvas.queryByText('Build search index')).toBeNull();
    expect(canvas.queryByText('Review billing page')).toBeNull();
    expect(canvas.getByText('Ship export job')).toBeInTheDocument();
  },
};

// D1, F1: a select filter with a value shows its chevron left of the clear
// button, not under it.
export const SelectClearBesideChevron = {
  render: () => (
    <ShadcnTable
      columns={plainColumns().map((column) =>
        column.accessorKey === 'status'
          ? {
              ...column,
              filterSelectOptions: ['Done', 'In Progress', 'Not Started'],
              filterVariant: 'select',
            }
          : column,
      )}
      data={data}
      initialState={{ columnFilters: [{ id: 'status', value: 'Done' }] }}
      {...options}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const body = within(document.body);
    await waitFor(() => expect(chipOf(canvasElement, 'status')).not.toBeNull());
    await userEvent.click(chipOf(canvasElement, 'status')!);
    const clear = await body.findByRole('button', { name: 'Clear filter' });
    const group = clear.closest<HTMLElement>('[data-slot="input-group"]')!;
    const chevron = group.querySelector<SVGElement>(
      '[data-slot="select-trigger"] svg',
    );
    expect(chevron, 'the select chevron').not.toBeNull();
    await waitFor(() => {
      const chevronRight = chevron!.getBoundingClientRect().right;
      const clearLeft = clear.getBoundingClientRect().left;
      expect(
        chevronRight,
        `chevron right ${chevronRight}, clear left ${clearLeft}`,
      ).toBeLessThanOrEqual(clearLeft);
    });
  },
};

type Trip = { distance: number; name: string; when: Date };

const trips: Trip[] = [
  { distance: 5, name: 'Morning run', when: new Date(2025, 2, 1, 8, 30) },
  { distance: 12, name: 'Lunch ride', when: new Date(2025, 2, 20, 11, 15) },
  { distance: 30, name: 'Evening trip', when: new Date(2025, 4, 1, 18, 45) },
];

type RangeVariant = 'date-range' | 'datetime-range' | 'range' | 'time-range';

const rangeColumns = (variant: RangeVariant): ST_ColumnDef<Trip>[] => [
  { accessorKey: 'name', header: 'Name' },
  variant === 'range'
    ? { accessorKey: 'distance', filterVariant: 'range', header: 'Distance' }
    : {
        Cell: ({ cell }) => cell.getValue<Date>().toISOString(),
        accessorFn: (row) => row.when,
        filterVariant: variant,
        header: 'When',
        id: 'when',
      },
];

/** Fails when the element's box is not inside the editor's (1 px slack). */
const expectInside = (element: HTMLElement, editor: HTMLElement) => {
  const box = element.getBoundingClientRect();
  const outer = editor.getBoundingClientRect();
  const label = `${element.getAttribute('aria-label') ?? element.dataset.slot} ${Math.round(box.left)}..${Math.round(box.right)} in editor ${Math.round(outer.left)}..${Math.round(outer.right)}`;
  expect(box.left, label).toBeGreaterThanOrEqual(outer.left - 1);
  expect(box.right, label).toBeLessThanOrEqual(outer.right + 1);
  expect(box.top, label).toBeGreaterThanOrEqual(outer.top - 1);
  expect(box.bottom, label).toBeLessThanOrEqual(outer.bottom + 1);
};

/** Both range fields, their input groups included, lie inside the editor. */
const expectRangeFieldsInside = (min: HTMLElement, max: HTMLElement) =>
  waitFor(() => {
    const editor = min.closest<HTMLElement>('[data-slot="popover-content"]');
    expect(editor, 'the chip editor').not.toBeNull();
    for (const input of [min, max]) {
      expectInside(input, editor!);
      expectInside(
        input.closest<HTMLElement>('[data-slot="input-group"]')!,
        editor!,
      );
    }
  });

const rangeInputs = async () => {
  const body = within(document.body);
  return [
    await body.findByLabelText('Min'),
    await body.findByLabelText('Max'),
  ] as HTMLInputElement[];
};

/**
 * D86: both inputs of a range filter lie inside the chip editor and take
 * typed values. Date-like values are typed key by key from the first segment
 * with real key presses (the synthetic ones do not fill the segments); the
 * digits suit a day-month or a month-day locale and a 12 or 24 hour clock;
 * ArrowRight leaves the year, which takes up to six digits.
 */
const rangeEditorCase = (
  variant: RangeVariant,
  [minKeys, maxKeys]: [string, string],
  [minValue, maxValue]: [number, number] | [string, string],
) => ({
  render: () => (
    <ShadcnTable columns={rangeColumns(variant)} data={trips} {...options} />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const keyboard =
      variant === 'range'
        ? userEvent
        : ((
            globalThis as {
              stBrowserUserEvent?: {
                keyboard: (text: string) => Promise<void>;
              };
            }
          ).stBrowserUserEvent ?? userEvent);
    const label = variant === 'range' ? 'Distance' : 'When';
    await canvas.findByText('Lunch ride');

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: label }));
    const [min, max] = await rangeInputs();
    await expectRangeFieldsInside(min, max);

    for (const [input, keys, value] of [
      [min, minKeys, minValue],
      [max, maxKeys, maxValue],
    ] as const) {
      input.focus();
      await keyboard.keyboard(keys);
      await waitFor(() => expect(input).toHaveValue(value));
    }
    max.blur();
    await waitFor(() =>
      expect(
        [...bodyRows(canvasElement)].map((row) => row.textContent),
      ).toEqual([expect.stringContaining('Lunch ride')]),
    );

    // The chip opens the same editor.
    await userEvent.click(min);
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByLabelText('Min')).toBeNull());
    await userEvent.click(
      chipOf(canvasElement, variant === 'range' ? 'distance' : 'when')!,
    );
    const [chipMin, chipMax] = await rangeInputs();
    await expectRangeFieldsInside(chipMin, chipMax);
    expect(chipMin).toHaveValue(minValue);
    expect(chipMax).toHaveValue(maxValue);
  },
});

export const RangeEditorInputsFitAndFillTime = rangeEditorCase(
  'time-range',
  ['1000A', '1200P'],
  ['10:00', '12:00'],
);

export const RangeEditorInputsFitAndFillDate = rangeEditorCase(
  'date-range',
  ['03032025', '04042025'],
  ['2025-03-03', '2025-04-04'],
);

export const RangeEditorInputsFitAndFillDateTime = rangeEditorCase(
  'datetime-range',
  ['03032025{ArrowRight}1000A', '04042025{ArrowRight}1200P'],
  ['2025-03-03T10:00', '2025-04-04T12:00'],
);

export const RangeEditorInputsFitAndFillNumber = rangeEditorCase(
  'range',
  ['10', '20'],
  [10, 20],
);

// D82: one click into the multi-select input opens its option list, with no
// key press, on the three bases.
export const MultiSelectOpensOnClick = {
  render: ChipEditorKeepsWidth.render,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Plan audit log');

    await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
    await userEvent.click(await body.findByRole('option', { name: 'Status' }));
    const input = await body.findByRole('combobox', {
      name: 'Filter by Status',
    });
    await waitFor(() => expect(document.activeElement).toBe(input));
    await userEvent.click(input);
    await waitFor(
      () => expect(body.getByRole('option', { name: /^Done/ })).toBeVisible(),
      { timeout: 1000 },
    );
  },
};
