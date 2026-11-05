import { useMemo, useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_ColumnFiltersState,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { faker } from '@faker-js/faker';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { ST_BASE } from '../../.storybook/themes';
import {
  CakeIcon,
  CalendarIcon,
  CircleCheckIcon,
  ClockIcon,
  HashIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
  VenusAndMarsIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Filtering Examples',
};

export default meta;

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
    accessorKey: 'isActive',
    header: 'Is Active',
    icon: CircleCheckIcon,
    size: 110,
  },
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
    filterVariant: 'range',
    header: 'Age',
    icon: CakeIcon,
  },
  {
    Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
    accessorFn: (row) => new Date(row.birthDate), //transform data before processing so sorting works
    filterFn: 'lessThan',
    filterVariant: 'date',
    header: 'Birth Date',
    icon: CalendarIcon,
    id: 'birthDate',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
    icon: VenusAndMarsIcon,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    icon: MapPinIcon,
  },
  {
    accessorKey: 'state',
    filterSelectOptions: [
      { label: 'AL', value: 'Alabama' },
      { label: 'AZ', value: 'Arizona' },
      { label: 'CA', value: 'California' },
      { label: 'FL', value: 'Florida' },
      { label: 'GA', value: 'Georgia' },
      { label: 'NY', value: 'New York' },
      { label: 'TX', value: 'Texas' },
    ],
    filterVariant: 'multi-select',
    header: 'State',
    icon: MapIcon,
  },
];

const data = [...Array(120)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(100),
  arrivalTime: faker.date.recent(),
  birthDate: faker.date.birthdate({ max: 2020, min: 1980, mode: 'age' }),
  departureTime: faker.date.recent(),
  firstName: faker.person.firstName(),
  gender: Math.random() < 0.8 ? faker.person.sex() : faker.person.gender(),
  hireDate: faker.date.birthdate({ max: 2024, min: 2011, mode: 'age' }),
  isActive: faker.datatype.boolean(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const FilteringEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} />
);

// Chips are the default filter display: the toolbar's Filter button adds a
// chip per column. Features/Filter Chips covers the chip editor in depth.
export const ChipsDisplayMode = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="chips"
      columns={columns}
      data={data}
    />
  ),
  play: async ({ canvas }: StoryContext) => {
    // The toolbar buttons fade in from 0 opacity on mount (D70).
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Filter' })).toBeVisible(),
    );
    await expect(
      canvas.queryByRole('textbox', { name: /Filter by/ }),
    ).not.toBeInTheDocument();
  },
};

export const PopoverDisplayMode = () => (
  <ShadcnTable
    columnFilterDisplayMode="popover"
    columns={columns}
    data={data}
  />
);

// The per-column filter icon is an icon-only button; its tooltip title must
// double as its accessible name (MUI Tooltip injected aria-label, Radix does
// not).
PopoverDisplayMode.play = async ({ canvas }: StoryContext) => {
  const buttons = await canvas.findAllByRole('button', { name: /filter/i });
  await expect(buttons.length).toBeGreaterThanOrEqual(columns.length);
};

export const PopoverDisplayModeNoSorting = () => (
  <ShadcnTable
    columnFilterDisplayMode="popover"
    columns={columns}
    data={data}
    enableSorting={false}
  />
);

export const ColumnFilteringDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableColumnFilters={false} />
);

export const FilteringDisabled = () => (
  <ShadcnTable columns={columns} data={data} enableFilters={false} />
);

export const FilterHighlightingDisabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableFilterMatchHighlighting={false}
  />
);

export const FilterFnAndFilterVariants = () => (
  <ShadcnTable
    columns={[
      {
        Cell: ({ cell }) => (cell.getValue() === 'true' ? 'Yes' : 'No'),
        accessorFn: (originalRow) => (originalRow.isActive ? 'true' : 'false'),
        filterVariant: 'checkbox',
        header: 'Is Active',
        icon: CircleCheckIcon,
        id: 'isActive',
        size: 200,
      },
      {
        accessorKey: 'firstName',
        filterFn: 'fuzzy', // default
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        filterFn: 'contains',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'age',
        filterVariant: 'range',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.birthDate), //transform data before processing so sorting works
        filterFn: 'lessThan',
        filterVariant: 'date',
        header: 'Birth Date',
        icon: CalendarIcon,
        id: 'birthDate',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.hireDate), //transform data before processing so sorting works
        filterVariant: 'date-range',
        header: 'Hire Date',
        icon: CalendarIcon,
        id: 'hireDate',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.arrivalTime), //transform data before processing so sorting works
        filterVariant: 'datetime-range',
        header: 'Arrival time',
        icon: ClockIcon,
        id: 'arrivalTime',
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.departureTime), //transform data before processing so sorting works
        filterVariant: 'time-range',
        header: 'Departure Time',
        icon: ClockIcon,
        id: 'departureTime',
      },
      {
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        filterVariant: 'select',
        header: 'Gender',
        icon: VenusAndMarsIcon,
      },
      {
        accessorKey: 'address',
        filterFn: 'includesStringSensitive',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        filterSelectOptions: [
          { label: 'AL', value: 'Alabama' },
          { label: 'AZ', value: 'Arizona' },
          { label: 'CA', value: 'California' },
          { label: 'FL', value: 'Florida' },
          { label: 'GA', value: 'Georgia' },
          { label: 'NY', value: 'New York' },
          { label: 'TX', value: 'Texas' },
        ],
        filterVariant: 'multi-select',
        header: 'State',
        icon: MapIcon,
      },
    ]}
    data={data}
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

export const FilterFnAndFilterVariantsFaceted = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        filterSelectOptions: data.map((row) => ({
          label: row.firstName.toUpperCase().split('').reverse().join(''),
          value: row.firstName,
        })), //hard coded
        filterVariant: 'autocomplete',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        filterVariant: 'autocomplete', //faceted auto generated select options
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'age',
        filterVariant: 'range-slider',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        accessorKey: 'gender',
        filterVariant: 'select',
        header: 'Gender',
        icon: VenusAndMarsIcon,
      },
      {
        accessorKey: 'state',
        filterVariant: 'multi-select',
        header: 'State',
        icon: MapIcon,
      },
    ]}
    data={data}
    enableFacetedValues
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

/** The subheader th whose header text starts with `name`. */
const filterHeaderCell = (canvasElement: HTMLElement, name: string) =>
  Array.from(canvasElement.querySelectorAll<HTMLElement>('thead th')).find(
    (th) => th.textContent?.trim().startsWith(name),
  )!;

// D72: the multi-select field ends in a chevron, shows its clear button only
// once a value exists (the empty slot takes no room), and on radix and base
// highlights the first match so Enter picks it.
export const MultiSelectFieldControls = {
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
    const body = within(document.body);
    const input = await canvas.findByRole('combobox', {
      name: 'Filter by State',
    });
    const th = filterHeaderCell(canvasElement, 'State');
    const chips = th.querySelector<HTMLElement>('[data-slot="combobox-chips"]');
    expect(chips).not.toBeNull();
    expect(
      chips!.querySelector('[data-slot="combobox-trigger"]'),
      'chevron inside the chips field',
    ).not.toBeNull();
    const clear = within(th).getByRole('button', {
      hidden: true,
      name: 'Clear filter',
    });
    expect(
      within(th).queryByRole('button', { name: 'Clear filter' }),
    ).toBeNull();
    expect(
      clear.closest<HTMLElement>('[data-slot="input-group-addon"]')!
        .offsetWidth,
      'the empty clear slot takes no room',
    ).toBe(0);

    await userEvent.click(input);
    // The aria combobox opens from the keyboard, not on a click.
    if (!body.queryByRole('listbox')) await userEvent.keyboard('{ArrowDown}');
    await userEvent.click(await body.findByRole('option', { name: /^AZ/ }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(body.queryByRole('listbox')).toBeNull());
    await waitFor(() =>
      expect(
        within(th).getByRole('button', { name: 'Clear filter' }),
      ).toBeVisible(),
    );

    if (ST_BASE === 'aria') return;
    await userEvent.type(input, 'CA');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(within(chips!).getByText('CA')).toBeVisible());
  },
};

export const FilteringChangeModeEnabled = () => (
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
        accessorKey: 'age',
        filterFn: 'between',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), //transform data to readable format for cell render
        accessorFn: (row) => new Date(row.birthDate), //transform data before processing so sorting works
        filterVariant: 'date',
        header: 'Birth Date',
        icon: CalendarIcon,
        id: 'birthDate',
      },
      {
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        header: 'Gender',
        icon: VenusAndMarsIcon,
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
    ]}
    data={data}
    enableColumnFilterModes
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

// F44: a subheader filter (input, slider, caption) stays inside its th.
const boxInside = (inner: DOMRect, outer: DOMRect) =>
  inner.left >= outer.left - 1 &&
  inner.right <= outer.right + 1 &&
  inner.top >= outer.top - 1 &&
  inner.bottom <= outer.bottom + 1;

// React Aria's hidden native select carries its own (aria-hidden) label.
const subheaderFilterParts = (th: Element) =>
  Array.from(
    th.querySelectorAll<HTMLElement>(
      '[data-slot="input-group"], [data-slot="slider"], [data-slot="slider-thumb"], label, p',
    ),
  ).filter((part) => !part.closest('[aria-hidden="true"]'));

/** Every input and caption in the subheader row sits inside its th. */
const subheaderInputsInsideCell = async (canvasElement: HTMLElement) => {
  await waitFor(() => {
    const ths = Array.from(canvasElement.querySelectorAll('thead th'));
    const parts = ths.flatMap((th) =>
      subheaderFilterParts(th).map((part) => ({ part, th })),
    );
    expect(parts.length).toBeGreaterThan(0);
    for (const { part, th } of parts) {
      const box = part.getBoundingClientRect();
      const cell = th.getBoundingClientRect();
      expect(
        boxInside(box, cell),
        `${part.dataset.slot ?? part.tagName} "${part.textContent}" [${box.left}, ${box.right}] x [${box.top}, ${box.bottom}] inside th [${cell.left}, ${cell.right}] x [${cell.top}, ${cell.bottom}]`,
      ).toBe(true);
    }
    // A range filter's Filter Mode caption spans the range group, past the
    // Min field.
    let rangeGroups = 0;
    for (const th of ths) {
      // Top-level fields only: an autocomplete nests an input group.
      const fields = Array.from(
        th.querySelectorAll('[data-slot="input-group"]'),
      ).filter(
        (field) => !field.parentElement?.closest('[data-slot="input-group"]'),
      );
      const caption = Array.from(th.querySelectorAll('label, p')).find((el) =>
        el.textContent?.startsWith('Filter Mode'),
      );
      if (fields.length !== 2 || !caption) continue;
      rangeGroups += 1;
      const minRight = fields[0].getBoundingClientRect().right;
      const captionRight = caption.getBoundingClientRect().right;
      expect(
        captionRight,
        `${th.textContent}: caption right ${captionRight} past Min right ${minRight}`,
      ).toBeGreaterThan(minRight + 1);
    }
    expect(rangeGroups).toBeGreaterThan(0);
  });
};

/** The slider's Filter Mode caption sits below the track, the slider inside its th. */
const sliderCaptionBelowTrack = async (canvasElement: HTMLElement) => {
  await waitFor(() => {
    const slider = canvasElement.querySelector<HTMLElement>(
      'thead [data-slot="slider"]',
    );
    expect(slider).not.toBeNull();
    const th = slider!.closest('th')!;
    const track = th.querySelector('[data-slot="slider-track"]')!;
    const caption = Array.from(th.querySelectorAll('label, p')).find((el) =>
      el.textContent?.startsWith('Filter Mode'),
    );
    expect(caption).toBeDefined();
    const trackBox = track.getBoundingClientRect();
    const captionBox = caption!.getBoundingClientRect();
    expect(
      captionBox.top,
      `caption top ${captionBox.top} at or below track bottom ${trackBox.bottom}`,
    ).toBeGreaterThanOrEqual(trackBox.bottom);
    expect(
      boxInside(slider!.getBoundingClientRect(), th.getBoundingClientRect()),
      'slider root inside th',
    ).toBe(true);
  });
};

export const FilteringChangeModeEnabledFaceted = {
  render: () => (
    <ShadcnTable
      columns={[
        {
          accessorKey: 'firstName',
          filterFn: 'fuzzy', // default
          header: 'First Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'lastName',
          filterVariant: 'autocomplete',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'age',
          filterVariant: 'range-slider',
          header: 'Age',
          icon: CakeIcon,
        },
        {
          accessorKey: 'gender',
          filterVariant: 'select',
          header: 'Gender',
          icon: VenusAndMarsIcon,
        },
        {
          accessorKey: 'state',
          filterVariant: 'multi-select',
          header: 'State',
          icon: MapIcon,
        },
        {
          Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(),
          accessorFn: (row) => new Date(row.birthDate),
          filterVariant: 'date-range',
          header: 'Birth Date',
          icon: CalendarIcon,
          id: 'birthDate',
          size: 320,
        },
      ]}
      data={data}
      enableColumnFilterModes
      enableFacetedValues
      columnFilterDisplayMode="subheader"
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement, step }: StoryContext) => {
    await within(canvasElement).findAllByText(/Filter Mode/);
    await step('SliderCaptionBelowTrack', () =>
      sliderCaptionBelowTrack(canvasElement),
    );
    await step('SubheaderInputsInsideCell', () =>
      subheaderInputsInsideCell(canvasElement),
    );
  },
};

/** Range fields wider than their column stay side by side, clipped by the th (D61). */
export const SubheaderRangeFieldsNarrow = {
  // The wrapper is the three column sizes (180 + 80 + 180) plus the frame's
  // border wide, so the table cannot spread spare width over the columns.
  render: () => (
    <div className="w-111">
      <ShadcnTable
        columns={[
          {
            accessorKey: 'firstName',
            header: 'First Name',
            icon: UserIcon,
          },
          {
            accessorKey: 'age',
            filterVariant: 'range',
            header: 'Age',
            icon: CakeIcon,
            size: 80,
          },
          {
            Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(),
            accessorFn: (row) => new Date(row.birthDate),
            filterVariant: 'date-range',
            header: 'Birth Date',
            icon: CalendarIcon,
            id: 'birthDate',
            size: 180,
          },
        ]}
        data={data}
        enableColumnFilterModes
        columnFilterDisplayMode="subheader"
        initialState={{ showColumnFilters: true }}
      />
    </div>
  ),
  play: async ({ canvasElement, step }: StoryContext) => {
    await within(canvasElement).findAllByText(/Filter Mode/);
    const thFor = (name: string) =>
      Array.from(canvasElement.querySelectorAll('thead th')).find((cell) =>
        cell.textContent?.startsWith(name),
      )!;
    await step('SubheaderInputsInsideCell', () =>
      waitFor(() => {
        for (const [name, size] of [
          ['Age', 80],
          ['Birth Date', 180],
        ] as const) {
          const th = thFor(name);
          const cell = th.getBoundingClientRect();
          const [min, max] = Array.from(
            th.querySelectorAll('[data-slot="input-group"]'),
          ).map((group) => group.getBoundingClientRect());
          // D61: Min and Max stay on one row at every width.
          expect(
            Math.abs(max.top - min.top),
            `${name}: Min top ${min.top}, Max top ${max.top}`,
          ).toBeLessThanOrEqual(1);
          // The th keeps its size and clips what is wider.
          expect(
            Math.abs(cell.width - size),
            `${name}: th width ${cell.width} is its size ${size}`,
          ).toBeLessThanOrEqual(1);
        }
        const table = canvasElement.querySelector('table')!;
        let scroller = table.parentElement!;
        while (getComputedStyle(scroller).overflowX !== 'auto')
          scroller = scroller.parentElement!;
        expect(
          scroller.scrollWidth,
          'no horizontal overflow of the table',
        ).toBeLessThanOrEqual(scroller.clientWidth);
      }),
    );
  },
};

export const FilteringChangeModeEnabledHidden = () => (
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
        accessorKey: 'age',
        filterFn: 'between',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        header: 'Gender',
        icon: VenusAndMarsIcon,
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
    ]}
    data={data}
    enableColumnFilterModes
  />
);

export const DisableSomeFilterTypesForCertainColumns = () => (
  <ShadcnTable
    columns={[
      {
        accessorKey: 'firstName',
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        columnFilterModeOptions: [
          'startsWith',
          'endsWith',
          'empty',
          'notEmpty',
        ],
        filterFn: 'startsWith',
        header: 'Last Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        accessorKey: 'gender',
        columnFilterModeOptions: ['equals', 'notEquals'],
        filterFn: 'equals',
        header: 'Gender',
        icon: VenusAndMarsIcon,
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
    ]}
    data={data}
    enableColumnFilterModes
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

export const FilteringDisabledForCertainColumns = () => (
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
        accessorKey: 'age',
        enableColumnFilter: false,
        header: 'Age',
        icon: CakeIcon,
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        icon: VenusAndMarsIcon,
      },
      {
        accessorKey: 'address',
        enableColumnFilter: false,
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
    ]}
    data={data}
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

export const CustomFilterFunctionPerColumn = () => (
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
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        accessorKey: 'gender',
        filterFn: (row, _columnIds, filterValue) =>
          row
            .getValue<string>('gender')
            .toLowerCase()
            .startsWith(filterValue.toLowerCase()),
        header: 'Gender',
        icon: VenusAndMarsIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        filterFn: (row, _columnIds, filterValue) =>
          row
            .getValue<string>('state')
            .toLowerCase()
            .startsWith(filterValue.toLowerCase()),
        header: 'State',
        icon: MapIcon,
      },
    ]}
    data={data}
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

export const CustomFilterFns = () => (
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
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        accessorKey: 'gender',
        filterFn: 'customFn',
        header: 'Gender',
        icon: VenusAndMarsIcon,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        icon: MapPinIcon,
      },
      {
        accessorKey: 'state',
        filterFn: 'customFn',
        header: 'State',
        icon: MapIcon,
      },
    ]}
    data={data}
    filterFns={{
      customFn: (row, _columnIds, filterValue) => {
        console.info('customFn', row, _columnIds, filterValue);
        return row
          .getValue<string>('state')
          .toLowerCase()
          .startsWith(filterValue.toLowerCase());
      },
    }}
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

// API GAP: original custom Filter used MUI TextField/MenuItem; ported with a
// native <select> rendered through ST's column-level `Filter` render prop.
export const CustomFilterComponent = () => (
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
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        Filter: ({ header }) => (
          <NativeSelect
            className="w-full"
            onChange={(e) =>
              header.column.setFilterValue(e.target.value || undefined)
            }
            value={(header.column.getFilterValue() as string) ?? ''}
          >
            <NativeSelectOption value="">All</NativeSelectOption>
            <NativeSelectOption value="Male">Male</NativeSelectOption>
            <NativeSelectOption value="Female">Female</NativeSelectOption>
            <NativeSelectOption value="Other">Other</NativeSelectOption>
          </NativeSelect>
        ),
        accessorKey: 'gender',
        filterFn: (row, _columnIds, filterValue) =>
          row.getValue<string>('gender').toLowerCase() ===
          filterValue.toLowerCase(),
        header: 'Gender',
        icon: VenusAndMarsIcon,
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
    ]}
    data={data}
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

// API GAP: muiFilterTextFieldProps (variant: 'outlined') has no ST equivalent;
// ported with the select filter variant only.
export const CustomizeFilterTextFields = () => (
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
        accessorKey: 'age',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        filterVariant: 'select',
        header: 'Gender',
        icon: VenusAndMarsIcon,
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
    ]}
    data={data}
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
  />
);

export const ManualFiltering = () => {
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);

  //this kind of logic would actually live on a server, not client-side
  const rows = useMemo(() => {
    let filteredRows = [...data];
    columnFilters.forEach((filter) => {
      const { id: columnId, value: filterValue } = filter;
      filteredRows = filteredRows.filter((row) => {
        return row[columnId as keyof typeof row]
          ?.toString()
          ?.toLowerCase()
          ?.includes?.((filterValue as string).toLowerCase());
      });
    });
    return filteredRows;
  }, [columnFilters]);

  return (
    <ShadcnTable
      columnFilterModeOptions={null}
      columns={columns}
      data={rows}
      manualFiltering
      onColumnFiltersChange={setColumnFilters}
      state={{ columnFilters }}
    />
  );
};

export const ExternalSetFilterValue = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    columnFilterDisplayMode="subheader"
    initialState={{ showColumnFilters: true }}
    renderTopToolbarCustomActions={({ table }) => (
      <div>
        <Button
          onClick={() =>
            table.setColumnFilters((prev) => [
              ...prev,
              { id: 'firstName', value: 'Joe' },
            ])
          }
        >
          Find Joes
        </Button>
        <Button
          onClick={() =>
            table.setColumnFilters((prev) => [
              ...prev,
              { id: 'age', value: [18, 25] },
            ])
          }
        >
          Find 18-25 Age Range
        </Button>
        <Button onClick={() => table.resetColumnFilters()}>
          Reset Filters
        </Button>
      </div>
    )}
  />
);

export const InitialFilters = () => (
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
        accessorKey: 'age',
        filterFn: 'between',
        header: 'Age',
        icon: CakeIcon,
      },
      {
        accessorKey: 'gender',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        header: 'Gender',
        icon: VenusAndMarsIcon,
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
    ]}
    data={data}
    enableColumnFilterModes
    initialState={{
      columnFilters: [
        { id: 'firstName', value: 'Jo' },
        { id: 'age', value: [18, 100] },
      ],
    }}
  />
);

type Score = { name: string; score: number };

const scoreData: Score[] = [
  { name: 'Ada', score: 12 },
  { name: 'Ben', score: 25 },
  { name: 'Cleo', score: 31 },
  { name: 'Dev', score: 47 },
];

const scoreColumns: ST_ColumnDef<Score>[] = [
  { accessorKey: 'name', header: 'Name', icon: UserIcon },
  {
    icon: HashIcon,
    accessorKey: 'score',
    filterVariant: 'range',
    header: 'Score',
  },
];

/** A Min value filters the rows; the number range input rejects letters. */
export const RangeFilterMinValue = {
  render: () => (
    <ShadcnTable
      columns={scoreColumns}
      data={scoreData}
      columnFilterDisplayMode="subheader"
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Ada');
    const min = canvas.getByPlaceholderText('Min');
    expect(min).toHaveAttribute('type', 'number');
    expect(min).toHaveAttribute('inputmode', 'decimal');

    await userEvent.type(min, 'abc');
    expect(min).toHaveValue(null);

    await userEvent.type(min, '30');
    await waitFor(() =>
      expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(2),
    );
    expect(canvas.queryByText('Ada')).toBeNull();
    expect(canvas.getByText('Dev')).toBeInTheDocument();

    // A second bound updates the same filter value.
    await userEvent.type(canvas.getByPlaceholderText('Max'), '40');
    await waitFor(() =>
      expect(canvasElement.querySelectorAll('tbody tr')).toHaveLength(1),
    );
    expect(canvas.getByText('Cleo')).toBeInTheDocument();
  },
};
