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

// D93: clearing an is-empty filter returns a date column with no allowed
// list to its 'equals' default, not to 'fuzzy'.
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

// D96: a real pointer click at the centre of the first date range input,
// then a full date typed with real key presses, fills the whole date. The
// native input put the caret on the segment under the pointer; at this
// column size the centre of the input is on the year.
export const ClickCentreOfDateRangeInputTypesFullDate = () => (
  <ShadcnTable
    columnFilterDisplayMode="subheader"
    columns={[
      nameColumn,
      joinedColumn({ filterVariant: 'date-range', size: 95 }),
    ]}
    data={data}
    initialState={{ showColumnFilters: true }}
  />
);

ClickCentreOfDateRangeInputTypesFullDate.play = async ({
  canvasElement,
}: StoryContext) => {
  const canvas = within(canvasElement);
  await canvas.findByText('Ann');
  const min = canvas.getByLabelText('Min') as HTMLInputElement;
  // Playwright input: a trusted press at the element's centre and real key
  // presses; storybook/test's userEvent fills no date segment.
  const pointer =
    (
      globalThis as {
        stBrowserUserEvent?: {
          click: (element: Element) => Promise<void>;
          keyboard: (text: string) => Promise<void>;
        };
      }
    ).stBrowserUserEvent ?? userEvent;
  await pointer.click(min);
  await waitFor(() => expect(document.activeElement).toBe(min));
  // Day and month 03 read the same in either segment order of the locale.
  await pointer.keyboard('03032025');
  await waitFor(() => expect(min).toHaveValue('2025-03-03'));
};
