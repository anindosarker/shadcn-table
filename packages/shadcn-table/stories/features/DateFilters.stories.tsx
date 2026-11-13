import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { expect, waitFor } from 'storybook/test';
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
  joinedIso: string;
  name: string;
};

const person = (
  name: string,
  [year, month, day, hours, minutes]: [number, number, number, number, number],
): Person => ({
  joined: new Date(year, month - 1, day, hours, minutes),
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
