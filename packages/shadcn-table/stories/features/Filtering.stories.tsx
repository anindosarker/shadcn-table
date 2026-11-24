import { useEffect, useMemo, useState } from 'react';
import {
  type ST_ColumnDef,
  type ST_ColumnFiltersState,
  type ST_TableOptions,
  ST_TableHeadCellFilterContainer,
  ST_TableProvider,
  ShadcnTable,
  useST_MediaQuery,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { faker } from '@faker-js/faker';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { ST_BASE } from '../../.storybook/themes';
import {
  Building2Icon,
  CakeIcon,
  CalendarIcon,
  CircleCheckIcon,
  ClockIcon,
  DollarSignIcon,
  HashIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
  VenusAndMarsIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Filtering',
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
  />
);

/** The header th whose text starts with `name`. */
const filterHeaderCell = (canvasElement: HTMLElement, name: string) =>
  Array.from(canvasElement.querySelectorAll<HTMLElement>('thead th')).find(
    (th) => th.textContent?.trim().startsWith(name),
  )!;

// D72: the multi-select field ends in a chevron, shows its clear button only
// once a value exists (the empty slot takes no room), and on radix and base
// highlights the first match so Enter picks it.
export const MultiSelectFieldControls = {
  name: 'Subheader: Multi Select Field Controls',
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

/** The value of each slider thumb in `th`, in DOM order. */
const thumbValues = (th: HTMLElement) =>
  Array.from(
    th.querySelectorAll<HTMLElement>('[data-slot="slider-thumb"]'),
  ).map((thumb) => {
    const slider = thumb.matches('[role="slider"]')
      ? thumb
      : thumb.querySelector<HTMLElement>('[role="slider"]');
    const now = slider?.getAttribute('aria-valuenow');
    if (now != null) return Number(now);
    return Number(
      thumb.querySelector<HTMLInputElement>('input[type="range"]')?.value,
    );
  });

// F46: the aria range slider reads min and max from stFilterSliderProps, as
// radix and base do.
export const RangeSliderCustomBounds = {
  name: 'Subheader: Range Slider Custom Bounds',
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="subheader"
      columns={[
        {
          accessorKey: 'firstName',
          header: 'First Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'age',
          filterVariant: 'range-slider',
          header: 'Age',
          icon: CakeIcon,
          stFilterSliderProps: { max: 60, min: 30, step: 10 },
        },
      ]}
      data={data}
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByRole('slider');
    await waitFor(() =>
      expect(thumbValues(filterHeaderCell(canvasElement, 'Age'))).toEqual([
        30, 60,
      ]),
    );
  },
};

/** The filter mode demo table, in the given filter display mode. */
const ChangeModeTable = ({
  columnFilterDisplayMode,
  initialState,
}: Pick<
  ST_TableOptions<(typeof data)[0]>,
  'columnFilterDisplayMode' | 'initialState'
>) => (
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
    columnFilterDisplayMode={columnFilterDisplayMode}
    initialState={initialState}
  />
);

export const FilteringChangeModeEnabled = () => <ChangeModeTable />;

// The closing state of a menu popup in each base.
const menuExiting = (popup: Element) =>
  popup.hasAttribute('data-closed') ||
  popup.getAttribute('data-state') === 'closed' ||
  popup.hasAttribute('data-exiting');

/** F3: the filter mode menu plays its exit animation where it opened. */
export const FilterModeMenuClosesInPlace = {
  name: 'Subheader: Filter Mode Menu Closes In Place',
  render: () => (
    <ChangeModeTable
      columnFilterDisplayMode="subheader"
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const [modeButton] = await canvas.findAllByRole('button', {
      name: 'Change filter mode',
    });
    await userEvent.click(modeButton);
    const body = within(canvasElement.ownerDocument.body);
    // React Aria sets the exit state on the popover around the menu.
    const menu = await body.findByRole('menu');
    const popup = menu.closest('[data-slot="dropdown-menu-content"]') ?? menu;
    await waitFor(() => expect(menuExiting(popup)).toBe(false));
    // Settled after the enter animation.
    await new Promise((resolve) => setTimeout(resolve, 300));
    const open = popup.getBoundingClientRect();
    await userEvent.keyboard('{Escape}');
    let exitFrames = 0;
    for (let frame = 0; frame < 60 && popup.isConnected; frame++) {
      if (menuExiting(popup)) {
        exitFrames += 1;
        const box = popup.getBoundingClientRect();
        expect(
          Math.abs(box.left - open.left) <= 8 &&
            Math.abs(box.top - open.top) <= 8,
          `closing popup at (${box.left}, ${box.top}) within 8 px of open (${open.left}, ${open.top})`,
        ).toBe(true);
      }
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    expect(exitFrames, 'frames in the exit state').toBeGreaterThan(0);
  },
};

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
    // Min field; a date range is one box (D183).
    let rangeGroups = 0;
    for (const th of ths) {
      // Top-level fields only: an autocomplete nests an input group.
      const fields = Array.from(
        th.querySelectorAll('[data-slot="input-group"]'),
      ).filter(
        (field) => !field.parentElement?.closest('[data-slot="input-group"]'),
      );
      const caption = Array.from(th.querySelectorAll('p')).find((el) =>
        el.textContent?.startsWith('Filter Mode'),
      );
      if (!fields.length || !caption) continue;
      rangeGroups += 1;
      if (fields.length !== 2) continue;
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
  name: 'Subheader: Filtering Change Mode Enabled Faceted',
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

/**
 * Range fields wider than their column stay side by side, clipped by the th
 * (D61); a date range is one box, clipped the same (D183).
 */
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
          const groups = Array.from(
            th.querySelectorAll('[data-slot="input-group"]'),
          ).filter(
            (group) =>
              !group.parentElement?.closest('[data-slot="input-group"]'),
          );
          if (name === 'Age') {
            // D61: Min and Max stay on one row at every width.
            const [min, max] = groups.map((group) =>
              group.getBoundingClientRect(),
            );
            expect(
              Math.abs(max!.top - min!.top),
              `${name}: Min top ${min!.top}, Max top ${max!.top}`,
            ).toBeLessThanOrEqual(1);
          } else {
            // D183: a date range is one box.
            expect(groups, `${name}: one range box`).toHaveLength(1);
          }
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
  name: 'Subheader: Range Filter Min Value',
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

/** The open filter mode menu's items, once it holds any. */
const openModeMenuItems = () =>
  waitFor(() => {
    const items = within(document.body).getAllByRole('menuitem');
    expect(items.length).toBeGreaterThan(0);
    return items;
  });

// D4: a table without `enableColumnFilterModes` shows the mode picker in the
// subheader filter, and the picker offers all 14 modes.
export const ModePickerByDefaultSubheader = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="subheader"
      columns={scoreColumns}
      data={scoreData}
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Ada');
    const th = filterHeaderCell(canvasElement, 'Name');
    await userEvent.click(
      within(th).getByRole('button', { name: 'Change filter mode' }),
    );
    const items = await openModeMenuItems();
    expect(items).toHaveLength(14);
    expect(items[0].textContent).toContain('Fuzzy');
  },
};

/**
 * Mounts the story again (.storybook/preview.tsx), so each step of a play
 * that holds merged checks (D106) starts from the story's first render.
 */
const remountStory = () => {
  const remount = (globalThis as { __stRemountStory?: () => Promise<void> })
    .__stRemountStory;
  if (!remount) throw new Error('__stRemountStory is not set (preview.tsx)');
  return remount();
};

const modePickerByDefaultPopoverPlay = async ({
  canvasElement,
}: StoryContext) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  await canvas.findByText('Ada');
  const trigger = filterHeaderCell(
    canvasElement,
    'Name',
  ).querySelector<HTMLElement>('[aria-expanded]:not([aria-haspopup="menu"])');
  expect(trigger, 'the Name filter button').not.toBeNull();
  await userEvent.click(trigger!);
  await body.findByPlaceholderText('Filter by Name');
  await userEvent.click(
    await body.findByRole('button', { name: 'Change filter mode' }),
  );
  const items = await openModeMenuItems();
  expect(items).toHaveLength(14);
};

// D77: in the popover filter, the filter-mode menu opens next to its button,
// not offset by the popover's own position.
const modeMenuNextToButtonPopoverPlay = async ({
  canvasElement,
}: StoryContext) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  await canvas.findByText('Ada');
  const trigger = filterHeaderCell(
    canvasElement,
    'Name',
  ).querySelector<HTMLElement>('[aria-expanded]:not([aria-haspopup="menu"])');
  expect(trigger, 'the Name filter button').not.toBeNull();
  await userEvent.click(trigger!);
  await body.findByPlaceholderText('Filter by Name');
  const modeButton = await body.findByRole('button', {
    name: 'Change filter mode',
  });
  // The popover's enter animation transforms it; a person opens the menu
  // after it has settled.
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished),
  );
  await userEvent.click(modeButton);
  const menu = await body.findByRole('menu');
  // The gap between the two boxes on each axis, 0 when they overlap; the
  // menu's side offset is 4 px.
  await waitFor(() => {
    const a = modeButton.getBoundingClientRect();
    const b = menu.getBoundingClientRect();
    const gapX = Math.max(0, b.left - a.right, a.left - b.right);
    const gapY = Math.max(0, b.top - a.bottom, a.top - b.bottom);
    expect(gapY, 'vertical gap to the mode button').toBeLessThanOrEqual(8);
    expect(gapX, 'horizontal gap to the mode button').toBeLessThanOrEqual(8);
  });
};

// D80: a click on the mode button while the popover still animates in opens
// the menu next to the button once every animation has ended.
const modeMenuNextToButtonDuringPopoverAnimationPlay = async ({
  canvasElement,
}: StoryContext) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  await canvas.findByText('Ada');
  const trigger = filterHeaderCell(
    canvasElement,
    'Name',
  ).querySelector<HTMLElement>('[aria-expanded]:not([aria-haspopup="menu"])');
  expect(trigger, 'the Name filter button').not.toBeNull();
  await userEvent.click(trigger!);
  const modeButton = await body.findByRole('button', {
    name: 'Change filter mode',
  });
  // No wait for the popover's enter animation: the click lands mid-way.
  await userEvent.click(modeButton);
  const menu = await body.findByRole('menu');
  // Every animation, the popover's and the menu's, has ended.
  while (document.getAnimations().some((a) => a.playState === 'running')) {
    await Promise.all(
      document.getAnimations().map((animation) => animation.finished),
    );
  }
  // The gap between the two boxes on each axis, 0 when they overlap; the
  // menu's side offset is 4 px.
  await waitFor(() => {
    const a = modeButton.getBoundingClientRect();
    const b = menu.getBoundingClientRect();
    const gapX = Math.max(0, b.left - a.right, a.left - b.right);
    const gapY = Math.max(0, b.top - a.bottom, a.top - b.bottom);
    expect(gapY, 'vertical gap to the mode button').toBeLessThanOrEqual(8);
    expect(gapX, 'horizontal gap to the mode button').toBeLessThanOrEqual(8);
  });
};

// D4: the popover filter shows the mode picker without the flag too.
export const ModePickerByDefaultPopover = {
  render: () => (
    <ShadcnTable
      columnFilterDisplayMode="popover"
      columns={scoreColumns}
      data={scoreData}
    />
  ),
  play: async (context: StoryContext) => {
    await context.step('Mode Picker By Default Popover', () =>
      modePickerByDefaultPopoverPlay(context),
    );
    await remountStory();
    await context.step('Mode Menu Next To Button Popover', () =>
      modeMenuNextToButtonPopoverPlay(context),
    );
    await remountStory();
    await context.step(
      'Mode Menu Next To Button During Popover Animation',
      () => modeMenuNextToButtonDuringPopoverAnimationPlay(context),
    );
  },
};

// D88: typed column filters commit through one debounced call per field.
type DebouncePerson = {
  birthDate: string;
  firstName: string;
  lastName: string;
};

const debouncePeople: DebouncePerson[] = [
  { birthDate: '1990-01-15', firstName: 'Ada', lastName: 'Lovelace' },
  { birthDate: '1985-06-02', firstName: 'Grace', lastName: 'Hopper' },
  { birthDate: '1979-11-23', firstName: 'Linus', lastName: 'Torvalds' },
  { birthDate: '1969-03-08', firstName: 'Margaret', lastName: 'Hamilton' },
];

const debounceColumns: ST_ColumnDef<DebouncePerson>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
  {
    accessorFn: (row) => new Date(row.birthDate),
    Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(),
    filterFn: 'lessThan',
    filterVariant: 'date',
    header: 'Birth Date',
    id: 'birthDate',
  },
];

/** The table with its column filter state printed above it. */
const DebounceTable = ({
  columns = debounceColumns,
  ...options
}: Partial<ST_TableOptions<DebouncePerson>>) => {
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  return (
    <>
      <output data-testid="column-filters">
        {JSON.stringify(columnFilters)}
      </output>
      <ShadcnTable
        columns={columns}
        data={debouncePeople}
        onColumnFiltersChange={setColumnFilters}
        state={{ columnFilters }}
        {...options}
      />
    </>
  );
};

const columnFilterState = (canvasElement: HTMLElement) =>
  JSON.parse(
    within(canvasElement).getByTestId('column-filters').textContent ?? '[]',
  ) as ST_ColumnFiltersState;

const debounceRows = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('tbody tr');

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const typeThenClearFiltersStaysClearedPlay = async ({
  canvasElement,
}: StoryContext) => {
  const canvas = within(canvasElement);
  const body = within(document.body);
  await canvas.findByText('Ada');

  await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
  await userEvent.click(
    await body.findByRole('option', { name: 'First Name' }),
  );
  const input = await body.findByRole('textbox', {
    name: 'Filter by First Name',
  });
  await waitFor(() => expect(document.activeElement).toBe(input));
  await userEvent.type(input, 'Ada');
  const clearFilters = () =>
    canvas.queryByRole('button', { name: 'Clear filters' });
  await userEvent.click(clearFilters()!);
  // React Aria's popover spends the first outside press on closing itself.
  if (clearFilters()) await userEvent.click(clearFilters()!);

  await sleep(700);
  expect(columnFilterState(canvasElement)).toEqual([]);
  expect(debounceRows(canvasElement)).toHaveLength(4);
};

/** Escape closes the chip editor without a blur: the typed text applies. */
const chipEditorEscapeKeepsTypedTextPlay = async ({
  canvasElement,
}: StoryContext) => {
  await openChipEditor(canvasElement, 'First Name');
  const input = await within(document.body).findByRole('textbox', {
    name: 'Filter by First Name',
  });
  await waitFor(() => expect(document.activeElement).toBe(input));
  await userEvent.type(input, 'Ada');
  await userEvent.keyboard('{Escape}');

  await waitFor(() => expect(input).not.toBeInTheDocument());
  await waitFor(() =>
    expect(columnFilterState(canvasElement)).toEqual([
      { id: 'firstName', value: 'Ada' },
    ]),
  );
  await sleep(700);
  expect(columnFilterState(canvasElement)).toEqual([
    { id: 'firstName', value: 'Ada' },
  ]);
};

/** Escape closes the chip editor without a blur: the typed date applies. */
const chipEditorEscapeKeepsTypedDatePlay = async ({
  canvasElement,
}: StoryContext) => {
  await openChipEditor(canvasElement, 'Birth Date');
  const input = await within(document.body).findByLabelText(
    'Filter by Birth Date',
  );
  await waitFor(() => expect(document.activeElement).toBe(input));
  // Real key presses: the synthetic ones do not fill the date segments.
  const keyboard =
    (
      globalThis as {
        stBrowserUserEvent?: { keyboard: (text: string) => Promise<void> };
      }
    ).stBrowserUserEvent ?? userEvent;
  await keyboard.keyboard('01011990');
  await waitFor(() => expect(input).toHaveValue('1990-01-01'));
  expect(columnFilterState(canvasElement)).toEqual([]);
  await keyboard.keyboard('{Escape}');

  await waitFor(() => expect(input).not.toBeInTheDocument());
  await waitFor(() =>
    expect(columnFilterState(canvasElement)).toEqual([
      { id: 'birthDate', value: '1990-01-01' },
    ]),
  );
};

/** Clear filters inside the wait drops the typed text for good. */
export const TypeThenClearFiltersStaysCleared = {
  render: () => <DebounceTable />,
  play: async (context: StoryContext) => {
    await context.step('Type Then Clear Filters Stays Cleared', () =>
      typeThenClearFiltersStaysClearedPlay(context),
    );
    await remountStory();
    await context.step('Chip Editor Escape Keeps Typed Text', () =>
      chipEditorEscapeKeepsTypedTextPlay(context),
    );
    await remountStory();
    await context.step('Chip Editor Escape Keeps Typed Date', () =>
      chipEditorEscapeKeepsTypedDatePlay(context),
    );
  },
};

const typeThenEnterAppliesAtOncePlay = async ({
  canvasElement,
}: StoryContext) => {
  const canvas = within(canvasElement);
  await canvas.findByText('Ada');
  const input = canvas.getByRole('textbox', {
    name: 'Filter by First Name',
  });
  await userEvent.type(input, 'Ada');
  await userEvent.keyboard('{Enter}');
  await waitFor(() => expect(debounceRows(canvasElement)).toHaveLength(1), {
    timeout: 100,
  });
};

/**
 * A native date input holds a valid value after each digit of the year
 * (0002, 0020, ...): a typed date applies on blur or Enter, never on a pause.
 */
const halfTypedYearAppliesNothingPlay = async ({
  canvasElement,
}: StoryContext) => {
  const canvas = within(canvasElement);
  await canvas.findByText('Ada');
  const input = canvas.getByLabelText('Filter by Birth Date');
  // Real key presses: the synthetic ones do not fill the date segments.
  const keyboard =
    (
      globalThis as {
        stBrowserUserEvent?: { keyboard: (text: string) => Promise<void> };
      }
    ).stBrowserUserEvent ?? userEvent;
  input.focus();
  // Day and month 01 read the same in either segment order of the locale.
  await keyboard.keyboard('01012');
  await waitFor(() => expect(input).toHaveValue('0002-01-01'));

  await sleep(700);
  expect(columnFilterState(canvasElement)).toEqual([]);

  input.blur();
  await waitFor(() =>
    expect(columnFilterState(canvasElement)).toEqual([
      { id: 'birthDate', value: '0002-01-01' },
    ]),
  );
};

/** Enter applies the typed text before the wait ends. */
export const TypeThenEnterAppliesAtOnce = {
  name: 'Subheader: Type Then Enter Applies At Once',
  render: () => (
    <DebounceTable
      columnFilterDisplayMode="subheader"
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async (context: StoryContext) => {
    await context.step('Subheader: Type Then Enter Applies At Once', () =>
      typeThenEnterAppliesAtOncePlay(context),
    );
    await remountStory();
    await context.step('Subheader: Half Typed Year Applies Nothing', () =>
      halfTypedYearAppliesNothingPlay(context),
    );
  },
};

/** A controlled parent that rebuilds an equal filters array on each render. */
const RerenderingDebounceTable = () => {
  const [columnFilters, setColumnFilters] = useState<ST_ColumnFiltersState>([]);
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((tick) => tick + 1), 50);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      <output data-testid="column-filters">
        {JSON.stringify(columnFilters)}
      </output>
      <ShadcnTable
        columnFilterDisplayMode="subheader"
        columns={debounceColumns}
        data={debouncePeople}
        initialState={{ showColumnFilters: true }}
        onColumnFiltersChange={setColumnFilters}
        state={{ columnFilters: [...columnFilters] }}
      />
    </>
  );
};

/** Parent re-renders inside the wait keep the typed text and apply it. */
export const ControlledRerenderKeepsTypedFilter = {
  name: 'Subheader: Controlled Rerender Keeps Typed Filter',
  render: () => <RerenderingDebounceTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Ada');
    const input = canvas.getByRole('textbox', {
      name: 'Filter by First Name',
    });
    await userEvent.type(input, 'Ada');

    await sleep(700);
    expect(input).toHaveValue('Ada');
    expect(columnFilterState(canvasElement)).toEqual([
      { id: 'firstName', value: 'Ada' },
    ]);
    expect(debounceRows(canvasElement)).toHaveLength(1);
  },
};

/** Opens the chips mode editor of one column from the toolbar. */
const openChipEditor = async (canvasElement: HTMLElement, column: string) => {
  const canvas = within(canvasElement);
  await canvas.findByText('Ada');
  await userEvent.click(canvas.getByRole('button', { name: 'Filter' }));
  await userEvent.click(
    await within(document.body).findByRole('option', { name: column }),
  );
};

/** The table wait and a column's own wait (D88). */
export const CustomFilterDebounce = {
  name: 'Subheader: Custom Filter Debounce',
  render: () => (
    <DebounceTable
      columnFilterDebounceMs={50}
      columnFilterDisplayMode="subheader"
      columns={[
        debounceColumns[0]!,
        { ...debounceColumns[1]!, filterDebounceMs: 1000 },
      ]}
      initialState={{ showColumnFilters: true }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Ada');

    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Filter by First Name' }),
      'Ada',
    );
    await waitFor(() => expect(debounceRows(canvasElement)).toHaveLength(1), {
      timeout: 300,
    });

    await userEvent.type(
      canvas.getByRole('textbox', { name: 'Filter by Last Name' }),
      'Love',
    );
    const typedAt = performance.now();
    await sleep(750);
    expect(
      columnFilterState(canvasElement).find(({ id }) => id === 'lastName'),
    ).toBeUndefined();
    await waitFor(
      () =>
        expect(columnFilterState(canvasElement)).toContainEqual({
          id: 'lastName',
          value: 'Love',
        }),
      { timeout: 1500 },
    );
    expect(performance.now() - typedAt).toBeGreaterThanOrEqual(800);
  },
};

// The exact stories of the docs examples filter-variants, faceted-values,
// filter-switching, popover-filters, subheader-filters and custom-filter-ui:
// the same columns, options and data.

type VariantsPerson = {
  isActive: boolean;
  name: string;
  hireDate: string;
  arrivalTime: string;
  departureTime: Date;
  age: number;
  salary: number;
  city: string;
  state: string;
};

//seeded so that server and client render the same times
const variantsCreateRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const variantsRandom = variantsCreateRandom(314);

const variantsRandomInt = (max: number) =>
  Math.floor(variantsRandom() * (max + 1));

//random time on a fixed day, so the rows do not depend on the build date
const variantsToday = () => {
  const today = new Date(2024, 0, 15);
  today.setHours(variantsRandomInt(23));
  today.setMinutes(variantsRandomInt(59));
  today.setSeconds(variantsRandomInt(59));
  return today;
};

const variantsData = [
  {
    isActive: true,
    name: 'Tanner Linsley',
    hireDate: '2016-02-23T18:25:43.511Z',
    arrivalTime: '2016-02-23T18:25:43.511Z',
    departureTime: variantsToday(),
    age: 42,
    salary: 100_000,
    city: 'San Francisco',
    state: 'California',
  },
  {
    isActive: true,
    name: 'Maya Patel',
    hireDate: '2019-02-23T18:21:43.335',
    arrivalTime: '2019-02-23T18:21:43.335',
    departureTime: variantsToday(),
    age: 51,
    salary: 80_000,
    city: 'Richmond',
    state: 'Virginia',
  },
  {
    isActive: false,
    name: 'John Doe',
    hireDate: '2014-02-23T18:25:43.511Z',
    arrivalTime: '2014-02-23T18:25:43.511Z',
    departureTime: variantsToday(),
    age: 27,
    salary: 120_000,
    city: 'Riverside',
    state: 'South Carolina',
  },
  {
    isActive: true,
    name: 'Jane Doe',
    hireDate: '2015-02-25T18:25:43.511Z',
    arrivalTime: '2015-02-25T18:25:43.511Z',
    departureTime: variantsToday(),
    age: 32,
    salary: 150_000,
    city: 'San Francisco',
    state: 'California',
  },
  {
    isActive: false,
    name: 'John Smith',
    hireDate: '2023-06-11T18:25:43.511Z',
    arrivalTime: '2023-06-11T18:25:43.511Z',
    departureTime: variantsToday(),
    age: 42,
    salary: 75_000,
    city: 'Los Angeles',
    state: 'California',
  },
  {
    isActive: true,
    name: 'Jane Smith',
    hireDate: '2019-02-23T18:21:43.335',
    arrivalTime: '2019-02-23T18:21:43.335',
    departureTime: variantsToday(),
    age: 51,
    salary: 56_000,
    city: 'Blacksburg',
    state: 'Virginia',
  },
  {
    isActive: false,
    name: 'Samuel Jackson',
    hireDate: '2010-02-23T18:25:43.511Z',
    arrivalTime: '2010-02-23T18:25:43.511Z',
    departureTime: variantsToday(),
    age: 27,
    salary: 90_000,
    city: 'New York',
    state: 'New York',
  },
];

const variantsCities = [
  'San Francisco',
  'Richmond',
  'Riverside',
  'Los Angeles',
  'Blacksburg',
  'New York',
];

const variantsStates = [
  'California',
  'Virginia',
  'South Carolina',
  'New York',
  'Texas',
];

const FilterVariantsTable = () => {
  const columns = useMemo<ST_ColumnDef<VariantsPerson>[]>(
    () => [
      {
        header: 'Status',
        accessorFn: (originalRow) => (originalRow.isActive ? 'true' : 'false'), //must be strings
        id: 'isActive',
        icon: CircleCheckIcon,
        filterVariant: 'checkbox',
        Cell: ({ cell }) =>
          cell.getValue() === 'true' ? 'Active' : 'Inactive',
        size: 170,
      },
      {
        accessorKey: 'name',
        icon: UserIcon,
        header: 'Name',
        filterVariant: 'text', // default
        size: 200,
      },
      {
        accessorKey: 'salary',
        icon: DollarSignIcon,
        header: 'Salary',
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        stFilterSliderProps: {
          max: 200_000, //custom max (as opposed to faceted max)
          min: 30_000, //custom min (as opposed to faceted min)
          step: 10_000,
        },
      },
      {
        accessorKey: 'age',
        icon: CakeIcon,
        header: 'Age',
        filterVariant: 'range',
        filterFn: 'between',
        size: 110,
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
        filterVariant: 'select',
        filterSelectOptions: variantsCities, //custom options list (as opposed to faceted list)
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
        filterVariant: 'multi-select',
        filterSelectOptions: variantsStates, //custom options list (as opposed to faceted list)
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.hireDate), //convert to date for sorting and filtering
        id: 'hireDate',
        icon: CalendarIcon,
        header: 'Hire Date',
        filterVariant: 'date-range',
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), // convert back to string for display
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.arrivalTime), //convert to date for sorting and filtering
        id: 'arrivalTime',
        icon: ClockIcon,
        header: 'Arrival Time',
        filterVariant: 'datetime-range',
        Cell: ({ cell }) =>
          `${cell.getValue<Date>().toLocaleDateString()} ${cell
            .getValue<Date>()
            .toLocaleTimeString()}`, // convert back to string for display
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.departureTime), //convert to date for sorting and filtering
        id: 'departureTime',
        icon: ClockIcon,
        header: 'Departure Time',
        filterVariant: 'time-range',
        // 'Departure Time' needs about 110 px beside the icon and the chevron
        size: 200,
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleTimeString(), // convert back to string for display
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data: variantsData,
  });

  return <ShadcnTable table={table} />;
};

type FacetedPerson = {
  isActive: boolean;
  name: string;
  age: number;
  salary: number;
  city: string;
  state: string;
};

const facetedData = [
  {
    isActive: true,
    name: 'Tanner Linsley',
    age: 42,
    salary: 100_000,
    city: 'San Francisco',
    state: 'California',
  },
  {
    isActive: true,
    name: 'Maya Patel',
    age: 51,
    salary: 80_000,
    city: 'Richmond',
    state: 'Virginia',
  },
  {
    isActive: false,
    name: 'John Doe',
    age: 27,
    salary: 120_000,
    city: 'Riverside',
    state: 'South Carolina',
  },
  {
    isActive: true,
    name: 'Jane Doe',
    age: 32,
    salary: 150_000,
    city: 'San Francisco',
    state: 'California',
  },
  {
    isActive: false,
    name: 'John Smith',
    age: 42,
    salary: 75_000,
    city: 'Los Angeles',
    state: 'California',
  },
  {
    isActive: true,
    name: 'Jane Smith',
    age: 51,
    salary: 56_000,
    city: 'Blacksburg',
    state: 'Virginia',
  },
  {
    isActive: false,
    name: 'Samuel Jackson',
    age: 27,
    salary: 90_000,
    city: 'New York',
    state: 'New York',
  },
];

const FacetedValuesTable = () => {
  const columns = useMemo<ST_ColumnDef<FacetedPerson>[]>(
    () => [
      {
        accessorKey: 'name',
        icon: UserIcon,
        header: 'Name',
        filterVariant: 'autocomplete', // default
        size: 110,
      },
      {
        accessorKey: 'salary',
        icon: DollarSignIcon,
        header: 'Salary',
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        stFilterSliderProps: {
          //no need to specify min/max/step if using faceted values
          step: 5_000,
        },
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
        filterVariant: 'select',
        //no need to specify filterSelectOptions if using faceted values
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
        filterVariant: 'multi-select',
        //no need to specify filterSelectOptions if using faceted values
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data: facetedData,
    enableFacetedValues: true,
  });

  return <ShadcnTable table={table} />;
};

type ModesPerson = {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  age: number;
};

const modesData = [
  {
    id: 1,
    firstName: 'Hugh',
    middleName: 'Jay',
    lastName: 'Mungus',
    age: 42,
  },
  {
    id: 2,
    firstName: 'Leroy',
    middleName: 'Leroy',
    lastName: 'Jenkins',
    age: 51,
  },
  {
    id: 3,
    firstName: 'Candice',
    middleName: 'Denise',
    lastName: 'Nutella',
    age: 27,
  },
  {
    id: 4,
    firstName: 'Micah',
    middleName: 'Henry',
    lastName: 'Johnson',
    age: 32,
  },
];

const FilterSwitchingTable = () => {
  const columns = useMemo<ST_ColumnDef<ModesPerson>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        enableColumnFilterModes: false, //disable changing filter mode for this column
        filterFn: 'equals', //set filter mode to equals
        header: 'ID',
      },
      {
        accessorKey: 'firstName', //normal, all filter modes are enabled
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'middleName',
        icon: UserIcon,
        enableColumnFilterModes: false, //disable changing filter mode for this column
        filterFn: 'startsWith', //even though changing the mode is disabled, you can still set the default filter mode
        header: 'Middle Name',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
        //if you do not want to use the default filter modes, you can provide your own and render your own menu
        renderColumnFilterModeMenuItems: ({ onSelectFilterMode }) => [
          <DropdownMenuItem
            key="0"
            onClick={() => onSelectFilterMode('contains')}
          >
            <div>Contains</div>
          </DropdownMenuItem>,
          <DropdownMenuItem
            key="1"
            onClick={() => onSelectFilterMode('customFilterFn')}
          >
            <div>Custom Filter Fn</div>
          </DropdownMenuItem>,
        ],
      },
      {
        accessorKey: 'age',
        icon: CakeIcon,
        columnFilterModeOptions: ['between', 'greaterThan', 'lessThan'], //only allow these filter modes
        filterFn: 'between',
        header: 'Age',
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data: modesData,
    filterFns: {
      customFilterFn: (row, id, filterValue) => {
        return row.getValue(id) === filterValue;
      },
    },
    localization: {
      filterCustomFilterFn: 'Custom Filter Fn',
    } as Record<string, string>, //a label for the custom mode, not a stock key
  });

  return <ShadcnTable table={table} />;
};

type GenderPerson = {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
};

const genderData = [
  {
    id: 1,
    firstName: 'Hugh',
    lastName: 'Mungus',
    gender: 'Male',
    age: 42,
  },
  {
    id: 2,
    firstName: 'Leroy',
    lastName: 'Jenkins',
    gender: 'Male',
    age: 51,
  },
  {
    id: 3,
    firstName: 'Candice',
    lastName: 'Nutella',
    gender: 'Female',
    age: 27,
  },
  {
    id: 4,
    firstName: 'Micah',
    lastName: 'Johnson',
    gender: 'Other',
    age: 32,
  },
];

const PopoverFiltersTable = () => {
  const columns = useMemo<ST_ColumnDef<GenderPerson>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        header: 'ID',
      },
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },
      {
        accessorKey: 'gender',
        icon: VenusAndMarsIcon,
        header: 'Gender',
        filterFn: 'equals',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        filterVariant: 'select',
      },
      {
        accessorKey: 'age',
        icon: CakeIcon,
        header: 'Age',
        filterVariant: 'range',
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data: genderData,
    columnFilterDisplayMode: 'popover',
  });

  return <ShadcnTable table={table} />;
};

const SubheaderFiltersTable = () => {
  const columns = useMemo<ST_ColumnDef<VariantsPerson>[]>(
    () => [
      {
        header: 'Status',
        accessorFn: (originalRow) => (originalRow.isActive ? 'true' : 'false'), //must be strings
        id: 'isActive',
        icon: CircleCheckIcon,
        filterVariant: 'checkbox',
        Cell: ({ cell }) =>
          cell.getValue() === 'true' ? 'Active' : 'Inactive',
        size: 170,
      },
      {
        accessorKey: 'name',
        icon: UserIcon,
        header: 'Name',
        filterVariant: 'text', // default
        size: 200,
      },
      {
        accessorKey: 'salary',
        icon: DollarSignIcon,
        header: 'Salary',
        Cell: ({ cell }) =>
          cell.getValue<number>().toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          }),
        filterVariant: 'range-slider',
        filterFn: 'betweenInclusive', // default (or between)
        stFilterSliderProps: {
          max: 200_000, //custom max (as opposed to faceted max)
          min: 30_000, //custom min (as opposed to faceted min)
          step: 10_000,
        },
        size: 220,
      },
      {
        accessorKey: 'age',
        icon: CakeIcon,
        header: 'Age',
        filterVariant: 'range',
        filterFn: 'between',
        size: 240,
      },
      {
        accessorKey: 'city',
        icon: Building2Icon,
        header: 'City',
        filterVariant: 'select',
        filterSelectOptions: variantsCities, //custom options list (as opposed to faceted list)
        size: 180,
      },
      {
        accessorKey: 'state',
        icon: MapIcon,
        header: 'State',
        filterVariant: 'multi-select',
        filterSelectOptions: variantsStates, //custom options list (as opposed to faceted list)
        size: 200,
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.hireDate), //convert to date for sorting and filtering
        id: 'hireDate',
        icon: CalendarIcon,
        header: 'Hire Date',
        filterVariant: 'date-range',
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleDateString(), // convert back to string for display
        size: 380,
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.arrivalTime), //convert to date for sorting and filtering
        id: 'arrivalTime',
        icon: ClockIcon,
        header: 'Arrival Time',
        filterVariant: 'datetime-range',
        Cell: ({ cell }) =>
          `${cell.getValue<Date>().toLocaleDateString()} ${cell
            .getValue<Date>()
            .toLocaleTimeString()}`, // convert back to string for display
        size: 480,
      },
      {
        accessorFn: (originalRow) => new Date(originalRow.departureTime), //convert to date for sorting and filtering
        id: 'departureTime',
        icon: ClockIcon,
        header: 'Departure Time',
        filterVariant: 'time-range',
        Cell: ({ cell }) => cell.getValue<Date>().toLocaleTimeString(), // convert back to string for display
        size: 320,
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data: variantsData,
    columnFilterDisplayMode: 'subheader', //a filter row under the headers, each text filter with its mode picker
    initialState: { showColumnFilters: true }, //the filter row starts open
  });

  return <ShadcnTable table={table} />;
};

const CustomFilterUiTable = () => {
  const isMobile = useST_MediaQuery('(max-width: 1000px)');

  const columns = useMemo<ST_ColumnDef<GenderPerson>[]>(
    () => [
      {
        accessorKey: 'id',
        icon: HashIcon,
        header: 'ID',
      },
      {
        accessorKey: 'firstName',
        icon: UserIcon,
        header: 'First Name',
        filterVariant: 'autocomplete',
      },
      {
        accessorKey: 'lastName',
        icon: UserIcon,
        header: 'Last Name',
      },
      {
        accessorKey: 'gender',
        icon: VenusAndMarsIcon,
        header: 'Gender',
        filterFn: 'equals',
        filterSelectOptions: ['Male', 'Female', 'Other'],
        filterVariant: 'select',
      },
      {
        accessorKey: 'age',
        icon: CakeIcon,
        header: 'Age',
        filterVariant: 'range',
      },
    ],
    [],
  );

  const table = useShadcnTable({
    columns,
    data: genderData,
    columnFilterDisplayMode: 'custom', //we will render our own filtering UI
    enableFacetedValues: true,
    stFilterTextFieldProps: ({ column }) => ({
      placeholder: `Filter by ${column.columnDef.header}`,
    }),
  });

  return (
    <ST_TableProvider table={table}>
      <div
        className={`flex gap-2 ${isMobile ? 'flex-col-reverse' : 'flex-row'}`}
      >
        <div className="min-w-0 flex-1">
          <ShadcnTable table={table} />
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-col gap-2 p-2">
            {table
              .getLeafHeaders()
              .map(
                (header) =>
                  header.column.getCanFilter() && (
                    <ST_TableHeadCellFilterContainer
                      key={header.id}
                      header={header}
                      open
                    />
                  ),
              )}
          </div>
        </div>
      </div>
    </ST_TableProvider>
  );
};

const exampleRows = (canvasElement: HTMLElement) =>
  canvasElement.querySelectorAll('tbody tr');

/** "+ Filter" (or the Filter button), then the column in the picker. */
const addChip = async (canvasElement: HTMLElement, column: string) => {
  const [addFilter] = within(canvasElement).getAllByRole('button', {
    name: 'Filter',
  });
  await userEvent.click(addFilter!);
  await userEvent.click(
    await within(document.body).findByRole('option', { name: column }),
  );
};

/** Opens the select of the open chip editor and picks `option`. */
const pickInChipEditor = async (option: RegExp) => {
  const body = within(document.body);
  const removeFilter = await body.findByRole('button', {
    name: 'Remove filter',
  });
  const trigger = removeFilter
    .closest('[data-slot="popover-content"]')!
    .querySelector<HTMLElement>('[data-slot="select-trigger"]')!;
  await userEvent.click(trigger);
  await userEvent.click(await body.findByRole('option', { name: option }));
};

/** The docs example filter-variants: one filter variant per column. */
export const FilterVariants = {
  render: () => <FilterVariantsTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Tanner Linsley');
    expect(exampleRows(canvasElement)).toHaveLength(7);
    await addChip(canvasElement, 'City');
    await pickInChipEditor(/^San Francisco/);
    await waitFor(() => expect(exampleRows(canvasElement)).toHaveLength(2));
  },
};

/** The docs example faceted-values: filter options come from the rows. */
export const FacetedValues = {
  render: () => <FacetedValuesTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Tanner Linsley');
    const rows = exampleRows(canvasElement).length;
    await addChip(canvasElement, 'City');
    await pickInChipEditor(/^Richmond/);
    await waitFor(() => expect(exampleRows(canvasElement)).toHaveLength(1));
    expect(rows).toBeGreaterThan(1);
  },
};

/** The docs example filter-switching: filter modes per column. */
export const FilterSwitching = {
  render: () => <FilterSwitchingTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Micah');
    await addChip(canvasElement, 'First Name');
    expect(
      (await body.findByRole('button', { name: 'Change filter mode' }))
        .textContent,
    ).toContain('fuzzy');
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(body.queryByRole('button', { name: 'Remove filter' })).toBeNull(),
    );

    await addChip(canvasElement, 'Age');
    const modeButton = await body.findByRole('button', {
      name: 'Change filter mode',
    });
    expect(modeButton.textContent).toContain('between');
    await userEvent.click(modeButton);
    await waitFor(() =>
      expect(
        body.getAllByRole('menuitemradio').map((item) => item.textContent),
      ).toHaveLength(3),
    );
    const modes = body
      .getAllByRole('menuitemradio')
      .map((item) => item.textContent ?? '');
    for (const [index, mode] of [
      'Between',
      'Greater Than',
      'Less Than',
    ].entries())
      expect(modes[index]).toContain(mode);
  },
};

/** The docs example popover-filters: each column's filter in a popover. */
export const PopoverFilters = {
  render: () => <PopoverFiltersTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await canvas.findByText('Candice');
    const gender = canvas.getByRole('columnheader', { name: /Gender/ });
    await userEvent.click(
      within(gender).getByRole('button', { name: /Filter/ }),
    );
    const removeOrTrigger = await waitFor(() => {
      const trigger = document.querySelector<HTMLElement>(
        '[data-slot="popover-content"] [data-slot="select-trigger"]',
      );
      expect(trigger).not.toBeNull();
      return trigger!;
    });
    await userEvent.click(removeOrTrigger);
    await userEvent.click(await body.findByRole('option', { name: /^Female/ }));
    await waitFor(() => expect(exampleRows(canvasElement)).toHaveLength(1));
    expect(canvas.getByText('Candice')).toBeVisible();
  },
};

/** The docs example subheader-filters: a filter row under the headers. */
export const SubheaderFilters = {
  render: () => <SubheaderFiltersTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Tanner Linsley');
    const input = canvas.getByRole('textbox', { name: 'Filter by Name' });
    await userEvent.type(input, 'Doe');
    await waitFor(() => expect(exampleRows(canvasElement)).toHaveLength(2));
    // The match is highlighted, so the name spans several elements.
    const names = [...exampleRows(canvasElement)].map((row) => row.textContent);
    expect(names.some((name) => name?.includes('John Doe'))).toBe(true);
    expect(names.some((name) => name?.includes('Jane Doe'))).toBe(true);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Show/Hide filters' }),
    );
    await waitFor(() =>
      expect(
        canvas.queryByRole('textbox', { name: 'Filter by Name' }),
      ).toBeNull(),
    );
  },
};

/** The docs example custom-filter-ui: the filters in a panel of their own. */
export const CustomFilterUi = {
  name: 'Custom Filter UI',
  render: () => <CustomFilterUiTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Hugh');
    const input = canvas.getByRole('combobox', {
      name: 'Filter by First Name',
    });
    await userEvent.type(input, 'Le');
    await waitFor(() => expect(exampleRows(canvasElement)).toHaveLength(1));
    expect(exampleRows(canvasElement)[0]).toHaveTextContent('Leroy');
  },
};
