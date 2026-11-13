import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { useState } from 'react';
import {
  CakeIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Search Examples',
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
    accessorKey: 'age',
    header: 'Age',
    icon: CakeIcon,
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

const data = [...Array(200)].map(() => ({
  address: faker.location.streetAddress(),
  age: +faker.number.float({ max: 100, min: 0 }),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  state: faker.location.state(),
}));

export const SearchEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} />
);

export const SearchInitialState = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ globalFilter: 'John' }}
  />
);

export const SearchInitializedState = () => {
  const [globalFilter, setGlobalFilter] = useState('John');

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      state={{ globalFilter }}
      onGlobalFilterChange={setGlobalFilter}
    />
  );
};

export const SearchContains = () => (
  <ShadcnTable columns={columns} data={data} globalFilterFn="contains" />
);

export const CustomGlobalFilterFn = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    filterFns={{
      myCustomFilterFn: (row, id, filterValue) =>
        row.getValue<string>(id).startsWith(filterValue),
    }}
    globalFilterFn="myCustomFilterFn"
  />
);

export const SearchGlobalFilterModes = () => (
  <ShadcnTable columns={columns} data={data} enableGlobalFilterModes />
);

export const SearchGlobalFilterModeOptions = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGlobalFilterModes
    globalFilterModeOptions={['asfd', 'contains', 'fuzzy']}
  />
);

export const SearchRankedResultsEnabledByDefault = () => (
  <ShadcnTable columns={columns} data={data} enableRowNumbers />
);

export const SearchDisableRankedResults = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGlobalFilterRankedResults={false}
    enableRowNumbers
  />
);

export const ShowSearchRightBoxByDefault = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
  />
);

export const ShowSearchBoxLeftByDefault = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
    positionGlobalFilter="left"
  />
);

export const ShowSearchBoxLeftByDefaultWithSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableRowSelection
    initialState={{ showGlobalFilter: true }}
    positionGlobalFilter="left"
  />
);

export const JustASearchBox = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableToolbarInternalActions={false}
    initialState={{ showGlobalFilter: true }}
  />
);

export const SearchDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableGlobalFilter={false} />
);

// API GAP: muiSearchTextFieldProps label / variant / InputLabelProps have no
// shadcn Input equivalent; only the placeholder is ported.
export const CustomizeSearchTextBox = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    initialState={{ showGlobalFilter: true }}
    stSearchTextFieldProps={{
      placeholder: 'Search 100 rows',
    }}
  />
);

const searchInput = (canvasElement: HTMLElement) =>
  within(canvasElement).getByPlaceholderText('Search');

const searchPanel = (canvasElement: HTMLElement) =>
  searchInput(canvasElement).closest<HTMLElement>(
    '[data-slot="collapsible-content"]',
  )!;

const bodyRowTexts = (canvasElement: HTMLElement) =>
  [...canvasElement.querySelectorAll('tbody tr')].map(
    (row) => row.textContent ?? '',
  );

/** Opens the search from its toggle and waits for the focused input. */
const openSearch = async (canvasElement: HTMLElement) => {
  const toggle = within(canvasElement).getByRole('button', {
    name: 'Show/Hide search',
  });
  await userEvent.click(toggle);
  await waitFor(() =>
    expect(document.activeElement).toBe(searchInput(canvasElement)),
  );
  return toggle;
};

/** Typing in the search leaves only the rows that contain the text. */
export const TypingFiltersRows = {
  render: () => <SearchContains />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(data[0].firstName);
    const term = data[7].lastName;
    const before = bodyRowTexts(canvasElement);
    expect(before.every((text) => text.includes(term))).toBe(false);
    await openSearch(canvasElement);
    await userEvent.keyboard(term);
    await waitFor(() => {
      const rows = bodyRowTexts(canvasElement);
      expect(rows.length).toBeGreaterThan(0);
      for (const text of rows) {
        expect(text.toLowerCase()).toContain(term.toLowerCase());
      }
    });
  },
};

/**
 * Open, one click on the toggle clears the value, restores every row and
 * closes the field (D35); the toggle is never disabled.
 */
export const ToggleClearsAndCloses = {
  render: () => <SearchEnabledDefault />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(data[0].firstName);
    const before = bodyRowTexts(canvasElement);
    const toggle = await openSearch(canvasElement);
    await userEvent.keyboard(data[3].lastName);
    await waitFor(() =>
      expect(bodyRowTexts(canvasElement)).not.toEqual(before),
    );
    expect(toggle).toBeEnabled();
    await userEvent.click(toggle);
    await waitFor(() => expect(searchPanel(canvasElement).inert).toBe(true));
    expect(searchInput(canvasElement)).toHaveValue('');
    await waitFor(() => expect(bodyRowTexts(canvasElement)).toEqual(before));
  },
};

/** Escape clears the typed text first, then closes the empty field. */
export const EscapeClearsThenCloses = {
  render: () => <SearchEnabledDefault />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(data[0].firstName);
    const before = bodyRowTexts(canvasElement);
    const toggle = await openSearch(canvasElement);
    await userEvent.keyboard(data[3].lastName);
    await waitFor(() =>
      expect(bodyRowTexts(canvasElement)).not.toEqual(before),
    );
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(searchInput(canvasElement)).toHaveValue(''));
    expect(searchPanel(canvasElement).inert).toBe(false);
    await waitFor(() => expect(bodyRowTexts(canvasElement)).toEqual(before));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(searchPanel(canvasElement).inert).toBe(true));
    await waitFor(() => expect(document.activeElement).toBe(toggle));
  },
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The search with its global filter state printed above it. */
const SearchWithClearButton = () => {
  const [globalFilter, setGlobalFilter] = useState<string | undefined>();
  return (
    <>
      <output data-testid="global-filter">
        {JSON.stringify(globalFilter ?? null)}
      </output>
      <ShadcnTable
        columns={columns}
        data={data}
        initialState={{ showGlobalFilter: true }}
        onGlobalFilterChange={setGlobalFilter}
        showClearSearchButton
        state={{ globalFilter }}
      />
    </>
  );
};

/**
 * The clear button and Escape inside the wait drop the pending write: the
 * global filter stays unset (D88).
 */
export const ClearCancelsPendingSearch = {
  render: () => <SearchWithClearButton />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findAllByText(data[0].firstName);
    const before = bodyRowTexts(canvasElement);
    const output = canvas.getByTestId('global-filter');

    await userEvent.type(searchInput(canvasElement), data[3].lastName);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await sleep(700);
    expect(output).toHaveTextContent('null');
    expect(searchInput(canvasElement)).toHaveValue('');
    expect(bodyRowTexts(canvasElement)).toEqual(before);

    await userEvent.type(searchInput(canvasElement), data[3].lastName);
    await userEvent.keyboard('{Escape}');
    await sleep(700);
    expect(output).toHaveTextContent('null');
    expect(searchInput(canvasElement)).toHaveValue('');
    expect(bodyRowTexts(canvasElement)).toEqual(before);
  },
};
