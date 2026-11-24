import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';

// Date filter values are strings ('YYYY-MM-DD', 'HH:mm', 'YYYY-MM-DDTHH:mm')
// while a `joined` accessor returns `Date` values: the comparison modes read
// the string as a local date or time of day (spec 40, D81). Fixed data in
// local time, so every row count is exact in any time zone.

const meta: Meta = {
  title: 'Features/Date Filters',
};

export default meta;

type Person = {
  joined: Date;
  joinedAt: string;
  joinedIso: string;
  name: string;
};

const person = (
  name: string,
  [year, month, day, hours, minutes]: [number, number, number, number, number],
): Person => ({
  joined: new Date(year, month - 1, day, hours, minutes),
  joinedAt: new Date(year, month - 1, day, hours, minutes).toISOString(),
  joinedIso: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  name,
});

const data: Person[] = [
  person('Ann', [2025, 9, 20, 8, 30]),
  person('Ben', [2025, 11, 2, 14, 15]),
  person('Cara', [2025, 11, 2, 23, 45]),
  person('Dan', [2025, 11, 5, 9, 0]),
  person('Eve', [2025, 12, 1, 18, 0]),
  person('Finn', [2025, 2, 18, 6, 10]),
];

const joinedColumn = (
  overrides: Partial<ST_ColumnDef<Person>>,
): ST_ColumnDef<Person> =>
  ({
    accessorFn: (row) => row.joined,
    Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(),
    header: 'Joined',
    id: 'joined',
    ...overrides,
  }) as ST_ColumnDef<Person>;

const nameColumn: ST_ColumnDef<Person> = {
  accessorKey: 'name',
  header: 'Name',
};

const names = (root: ParentNode) =>
  Array.from(root.querySelectorAll('tbody tr td:first-child'))
    .map((cell) => cell.textContent ?? '')
    .sort();

const DateTable = ({
  column,
  value,
}: {
  column: ST_ColumnDef<Person>;
  value: unknown;
}) => (
  <ShadcnTable
    columnFilterDisplayMode="subheader"
    columns={[nameColumn, column]}
    data={data}
    enableColumnFilterModes
    initialState={{
      columnFilters: [{ id: column.id ?? 'joined', value }],
      showColumnFilters: true,
    }}
  />
);

// Before spec 40: the string compare with "Sun Nov 02 2025 ..." kept every row.
export const GreaterThanOnDateColumn = () => (
  <DateTable
    column={joinedColumn({ filterFn: 'greaterThan', filterVariant: 'date' })}
    value="2025-11-02"
  />
);

GreaterThanOnDateColumn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(names(canvasElement)).toEqual(['Dan', 'Eve']));
};

// Before spec 40: the string compare kept no row.
export const LessThanOnDateColumn = () => (
  <DateTable
    column={joinedColumn({ filterFn: 'lessThan', filterVariant: 'date' })}
    value="2025-11-02"
  />
);

LessThanOnDateColumn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(names(canvasElement)).toEqual(['Ann', 'Finn']));
};

// Both rows of 2 November match, whatever their time of day.
export const EqualsMatchesCalendarDay = () => (
  <DateTable
    column={joinedColumn({ filterFn: 'equals', filterVariant: 'date' })}
    value="2025-11-02"
  />
);

EqualsMatchesCalendarDay.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(names(canvasElement)).toEqual(['Ben', 'Cara']));
};

export const BetweenInclusiveOnDateColumn = () => (
  <DateTable
    column={joinedColumn({
      filterFn: 'betweenInclusive',
      filterVariant: 'date-range',
    })}
    value={['2025-11-02', '2025-11-05']}
  />
);

BetweenInclusiveOnDateColumn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() =>
    expect(names(canvasElement)).toEqual(['Ben', 'Cara', 'Dan']),
  );
};

// An 'HH:mm' value compares the time of day, not the date.
export const TimeOfDayOnDateColumn = () => (
  <DateTable
    column={joinedColumn({ filterFn: 'greaterThan', filterVariant: 'time' })}
    value="12:00"
  />
);

TimeOfDayOnDateColumn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() =>
    expect(names(canvasElement)).toEqual(['Ben', 'Cara', 'Eve']),
  );
};

// No filterFn: a 'date' variant defaults to 'equals', not 'fuzzy'.
export const PlainDateVariantDefaultsToEquals = () => (
  <DateTable
    column={joinedColumn({ filterVariant: 'date' })}
    value="2025-11-02"
  />
);

PlainDateVariantDefaultsToEquals.play = async ({
  canvasElement,
}: StoryContext) => {
  await waitFor(() => expect(names(canvasElement)).toEqual(['Ben', 'Cara']));
};

// An accessor returning ISO strings filters as before: a text compare.
export const IsoStringColumnUnchanged = () => (
  <DateTable
    column={{
      accessorKey: 'joinedIso',
      filterFn: 'greaterThan',
      filterVariant: 'date',
      header: 'Joined',
      id: 'joinedIso',
    }}
    value="2025-11-02"
  />
);

IsoStringColumnUnchanged.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(names(canvasElement)).toEqual(['Dan', 'Eve']));
};

export const NotEqualsOnDateColumn = () => (
  <DateTable
    column={joinedColumn({ filterFn: 'notEquals', filterVariant: 'date' })}
    value="2025-11-02"
  />
);

NotEqualsOnDateColumn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() =>
    expect(names(canvasElement)).toEqual(['Ann', 'Dan', 'Eve', 'Finn']),
  );
};

// A 'YYYY-MM-DDTHH:mm' value compares the instant to the minute.
export const DateTimeOnDateColumn = () => (
  <DateTable
    column={joinedColumn({ filterFn: 'equals', filterVariant: 'datetime' })}
    value="2025-11-02T14:15"
  />
);

DateTimeOnDateColumn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(names(canvasElement)).toEqual(['Ben']));
};

export const DateTimeGreaterThanOnDateColumn = () => (
  <DateTable
    column={joinedColumn({
      filterFn: 'greaterThan',
      filterVariant: 'datetime',
    })}
    value="2025-11-02T14:15"
  />
);

DateTimeGreaterThanOnDateColumn.play = async ({
  canvasElement,
}: StoryContext) => {
  await waitFor(() =>
    expect(names(canvasElement)).toEqual(['Cara', 'Dan', 'Eve']),
  );
};

// An 'HH:mm:ss' value compares the time of day to the second.
export const TimeWithSecondsOnDateColumn = () => (
  <DateTable
    column={joinedColumn({ filterFn: 'equals', filterVariant: 'time' })}
    value="14:15:00"
  />
);

TimeWithSecondsOnDateColumn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(names(canvasElement)).toEqual(['Ben']));
};

// A `Date` filter value compares by getTime().
export const DateFilterValueOnDateColumn = () => (
  <DateTable
    column={joinedColumn({ filterFn: 'equals' })}
    value={new Date(2025, 10, 5, 9, 0)}
  />
);

DateFilterValueOnDateColumn.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(names(canvasElement)).toEqual(['Dan']));
};

// An accessor returning ISO date-time strings ('2025-11-02T13:15:00.000Z'),
// no filterFn: the 'equals' default compares by local day, as `fuzzy`
// matched by prefix before.
export const IsoDateTimeStringColumnByDay = () => (
  <DateTable
    column={{
      accessorKey: 'joinedAt',
      filterVariant: 'date',
      header: 'Joined',
      id: 'joinedAt',
    }}
    value="2025-11-02"
  />
);

IsoDateTimeStringColumnByDay.play = async ({ canvasElement }: StoryContext) => {
  await waitFor(() => expect(names(canvasElement)).toEqual(['Ben', 'Cara']));
};

// Clearing an is-empty filter returns a date column with no allowed list to
// its 'equals' default, not to 'fuzzy'.
export const ClearEmptyReturnsDateDefaultMode = () => (
  <ShadcnTable
    columnFilterDisplayMode="subheader"
    columns={[nameColumn, joinedColumn({ filterVariant: 'date' })]}
    data={data}
    enableColumnFilterModes
    initialState={{ showColumnFilters: true }}
  />
);

ClearEmptyReturnsDateDefaultMode.play = async ({
  canvasElement,
}: StoryContext) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  await canvas.findByText('Ann');
  const joinedFilter = () =>
    canvas.getByLabelText('Filter by Joined').closest('th')!;
  await waitFor(() =>
    expect(joinedFilter()).toHaveTextContent('Filter Mode: Equals'),
  );

  const modeButton = within(joinedFilter()).getByRole('button', {
    name: 'Change filter mode',
  });
  const group = modeButton.closest('[data-slot="input-group"]') as HTMLElement;
  await userEvent.click(modeButton);
  const empty = await waitFor(() => {
    const item = body
      .getAllByRole('menuitem')
      .find(
        (item) =>
          item.textContent?.trim().endsWith('Empty') &&
          !item.textContent.includes('Not'),
      );
    expect(item).toBeDefined();
    return item!;
  });
  await userEvent.click(empty);
  await waitFor(() =>
    expect(joinedFilter()).toHaveTextContent('Filter Mode: Empty'),
  );

  // Radix hides the page from the accessibility tree until its menu closes.
  const clearChip = await waitFor(() =>
    within(group).getByRole('button', { name: 'Clear filter' }),
  );
  await userEvent.click(clearChip);
  await waitFor(() =>
    expect(joinedFilter()).toHaveTextContent('Filter Mode: Equals'),
  );
};

// The date picker in the filter box (spec 82). A value picked in the popup
// applies at once; a typed value applies on Enter or when focus leaves the box.

const body = () => within(document.body);

/** Real key presses: the synthetic ones do not fill the date segments. */
const realKeyboard = () =>
  (
    globalThis as {
      stBrowserUserEvent?: { keyboard: (text: string) => Promise<void> };
    }
  ).stBrowserUserEvent ?? userEvent;

const openPickerPopup = async (opener: HTMLElement, name: string) => {
  await userEvent.click(opener);
  const popup = await body().findByRole('dialog', { name });
  await waitFor(() => expect(popup).toBeVisible());
  return within(popup);
};

const expectPickerPopupClosed = (name: string) =>
  waitFor(() =>
    expect(body().queryByRole('dialog', { name })).not.toBeInTheDocument(),
  );

/** A calendar day by its date words, "November 2nd, 2025". */
const day = (popup: ReturnType<typeof within>, words: string) =>
  popup.getAllByRole('button', {
    name: (name: string) => name.includes(`, ${words}`),
  })[0]!;

const chipsDateTable = (value: string) => (
  <ShadcnTable
    columnFilterDisplayMode="chips"
    columns={[nameColumn, joinedColumn({ filterVariant: 'date' })]}
    data={data}
    initialState={{ columnFilters: [{ id: 'joined', value }] }}
  />
);

const openJoinedChipEditor = async (canvasElement: HTMLElement) => {
  await userEvent.click(
    await waitFor(() => {
      const chip = canvasElement.querySelector<HTMLElement>(
        '[data-filter-chip="joined"]',
      );
      expect(chip).not.toBeNull();
      return chip!;
    }),
  );
  return (await body().findByLabelText('Filter by Joined')) as HTMLInputElement;
};

// A day picked in the popup applies at once and closes the popup; the chips
// editor around it stays open.
export const PickDayInChipsEditor = {
  render: () => chipsDateTable('2025-11-05'),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => expect(names(canvasElement)).toEqual(['Dan']));
    const input = await openJoinedChipEditor(canvasElement);
    const editor = within(
      input.closest<HTMLElement>(
        '[data-slot="popover-content"], [data-slot="popover"]',
      )!,
    );
    const popup = await openPickerPopup(
      editor.getByRole('button', { name: 'Select date' }),
      'Select date',
    );
    await userEvent.click(day(popup, 'November 2nd, 2025'));
    await expectPickerPopupClosed('Select date');
    await waitFor(() => expect(names(canvasElement)).toEqual(['Ben', 'Cara']));
    expect(body().getByLabelText('Filter by Joined')).toHaveValue('2025-11-02');
  },
};

// Escape closes the picker's popup first; the chips editor stays open.
export const EscapeClosesPickerPopupFirst = {
  render: () => chipsDateTable('2025-11-05'),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => expect(names(canvasElement)).toEqual(['Dan']));
    const input = await openJoinedChipEditor(canvasElement);
    const editor = within(
      input.closest<HTMLElement>(
        '[data-slot="popover-content"], [data-slot="popover"]',
      )!,
    );
    await openPickerPopup(
      editor.getByRole('button', { name: 'Select date' }),
      'Select date',
    );
    await userEvent.keyboard('{Escape}');
    await expectPickerPopupClosed('Select date');
    expect(body().getByLabelText('Filter by Joined')).toBeVisible();
    expect(names(canvasElement)).toEqual(['Dan']);
  },
};

const subheaderTable = (column: ST_ColumnDef<Person>, value?: unknown) => (
  <ShadcnTable
    columnFilterDisplayMode="subheader"
    columns={[nameColumn, column]}
    data={data}
    initialState={{
      columnFilters: value === undefined ? [] : [{ id: 'joined', value }],
      showColumnFilters: true,
    }}
  />
);

const greaterThanDate = joinedColumn({
  filterFn: 'greaterThan',
  filterVariant: 'date',
});

const typeTenthOfOctober = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  await waitFor(() => expect(names(canvasElement)).toHaveLength(6));
  const input = canvas.getByLabelText('Filter by Joined');
  input.focus();
  // Day and month 10 read the same in either segment order of the locale.
  await realKeyboard().keyboard('10102025');
  await waitFor(() => expect(input).toHaveValue('2025-10-10'));
  expect(names(canvasElement)).toHaveLength(6);
};

export const TypedDateAppliesOnEnter = {
  render: () => subheaderTable(greaterThanDate),
  play: async ({ canvasElement }: StoryContext) => {
    await typeTenthOfOctober(canvasElement);
    await realKeyboard().keyboard('{Enter}');
    await waitFor(() =>
      expect(names(canvasElement)).toEqual(['Ben', 'Cara', 'Dan', 'Eve']),
    );
  },
};

export const TypedDateAppliesOnLeave = {
  render: () => subheaderTable(greaterThanDate),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await typeTenthOfOctober(canvasElement);
    // The popup counts as inside the box: opening it applies nothing.
    const opener = canvas.getByRole('button', { name: 'Select date' });
    await openPickerPopup(opener, 'Select date');
    expect(names(canvasElement)).toHaveLength(6);
    await userEvent.keyboard('{Escape}');
    await expectPickerPopupClosed('Select date');
    expect(names(canvasElement)).toHaveLength(6);
    // Focus is back in the box before the press outside.
    await waitFor(() => expect(opener).toHaveFocus());
    await userEvent.click(canvas.getByText('Ann'));
    await waitFor(() =>
      expect(names(canvasElement)).toEqual(['Ben', 'Cara', 'Dan', 'Eve']),
    );
  },
};

export const ClearButtonEmptiesDateFilter = {
  render: () => subheaderTable(greaterThanDate, '2025-11-02'),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(names(canvasElement)).toEqual(['Dan', 'Eve']));
    // The clear button keeps focus in the box's input and still applies at once.
    canvas.getByLabelText('Filter by Joined').focus();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear Date' }));
    await waitFor(() => expect(names(canvasElement)).toHaveLength(6));
    expect(canvas.getByLabelText('Filter by Joined')).toHaveValue('');
  },
};

// A click on one of the picker's buttons does not turn the next typed date
// into a pick: it still waits for Enter.
export const TypedDateAfterButtonClickWaitsForEnter = {
  render: () => subheaderTable(greaterThanDate, '2025-11-02'),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(names(canvasElement)).toEqual(['Dan', 'Eve']));
    canvas.getByLabelText('Filter by Joined').focus();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear Date' }));
    await typeTenthOfOctober(canvasElement);
    await realKeyboard().keyboard('{Enter}');
    await waitFor(() =>
      expect(names(canvasElement)).toEqual(['Ben', 'Cara', 'Dan', 'Eve']),
    );
  },
};

// A range keeps its two boxes: Min picked in its popup, Max typed.
export const RangeMinPickedMaxTyped = {
  render: () =>
    subheaderTable(
      joinedColumn({
        filterFn: 'betweenInclusive',
        filterVariant: 'date-range',
      }),
      ['2025-11-01', ''],
    ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(names(canvasElement)).toEqual(['Ben', 'Cara', 'Dan', 'Eve']),
    );
    const popup = await openPickerPopup(
      canvas.getAllByRole('button', { name: 'Select date' })[0]!,
      'Select date',
    );
    await userEvent.click(day(popup, 'November 5th, 2025'));
    await expectPickerPopupClosed('Select date');
    await waitFor(() => expect(names(canvasElement)).toEqual(['Dan', 'Eve']));
    expect(canvas.getByLabelText('Min')).toHaveValue('2025-11-05');

    const max = canvas.getByLabelText('Max');
    max.focus();
    await realKeyboard().keyboard('11112025');
    await waitFor(() => expect(max).toHaveValue('2025-11-11'));
    expect(names(canvasElement)).toEqual(['Dan', 'Eve']);
    await realKeyboard().keyboard('{Enter}');
    await waitFor(() => expect(names(canvasElement)).toEqual(['Dan']));
  },
};

// A day picked in the datetime popup keeps the time and applies at once.
export const PickDayInDateTimePopup = {
  render: () =>
    subheaderTable(
      joinedColumn({ filterFn: 'greaterThan', filterVariant: 'datetime' }),
      '2025-11-05T09:00',
    ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(names(canvasElement)).toEqual(['Eve']));
    const popup = await openPickerPopup(
      canvas.getByRole('button', { name: 'Select date and time' }),
      'Select date and time',
    );
    await userEvent.click(day(popup, 'November 2nd, 2025'));
    await waitFor(() =>
      expect(names(canvasElement)).toEqual(['Ben', 'Cara', 'Dan', 'Eve']),
    );
    expect(canvas.getByLabelText('Filter by Joined')).toHaveValue(
      '2025-11-02T09:00',
    );
  },
};

// A minute picked in the clock applies at once.
export const PickMinuteInTimePopup = {
  render: () =>
    subheaderTable(
      joinedColumn({ filterFn: 'greaterThan', filterVariant: 'time' }),
      '14:00',
    ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(names(canvasElement)).toEqual(['Ben', 'Cara', 'Eve']),
    );
    const clock = await openPickerPopup(
      canvas.getByRole('button', { name: 'Select time' }),
      'Select time',
    );
    await userEvent.click(
      within(clock.getByRole('group', { name: 'Minute' })).getByRole('button', {
        name: '30',
      }),
    );
    await waitFor(() => expect(names(canvasElement)).toEqual(['Cara', 'Eve']));
    expect(canvas.getByLabelText('Filter by Joined')).toHaveValue('14:30');
  },
};

// Escape in the time box of the datetime popup closes that popup, not the
// chips editor; Escape on the box's popup button then closes the editor.
export const EscapeInDateTimePopupKeepsEditor = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="chips"
      columns={[
        nameColumn,
        joinedColumn({ filterFn: 'greaterThan', filterVariant: 'datetime' }),
      ]}
      data={data}
      initialState={{
        columnFilters: [{ id: 'joined', value: '2025-11-05T09:00' }],
      }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => expect(names(canvasElement)).toEqual(['Eve']));
    const input = await openJoinedChipEditor(canvasElement);
    const editor = within(
      input.closest<HTMLElement>(
        '[data-slot="popover-content"], [data-slot="popover"]',
      )!,
    );
    const opener = editor.getByRole('button', {
      name: 'Select date and time',
    });
    const popup = await openPickerPopup(opener, 'Select date and time');
    popup.getByLabelText('Time').focus();
    await userEvent.keyboard('{Escape}');
    await expectPickerPopupClosed('Select date and time');
    expect(body().getByLabelText('Filter by Joined')).toBeVisible();

    opener.focus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(body().queryByLabelText('Filter by Joined')).toBeNull(),
    );
  },
};
