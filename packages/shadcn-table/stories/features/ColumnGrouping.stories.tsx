import { useEffect, useMemo, useState } from 'react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  type ST_Column,
  type ST_ColumnDef,
  type ST_RowData,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import {
  Building2Icon,
  MapIcon,
  MapPinIcon,
  UserIcon,
  VenusAndMarsIcon,
} from 'lucide-react';

const meta: Meta = {
  title: 'Features/Column Grouping Examples',
};

export default meta;

interface Person {
  city: string;
  firstName: string;
  gender: string;
  lastName: string;
  state: string;
}

const columns = [
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
    accessorKey: 'gender',
    header: 'Gender',
    icon: VenusAndMarsIcon,
  },
  {
    accessorKey: 'city',
    header: 'City',
    icon: Building2Icon,
  },
  {
    accessorKey: 'state',
    header: 'State',
    icon: MapIcon,
  },
] as ST_ColumnDef<Person>[];

const data = [...Array(300)].map(() => ({
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  gender: Math.random() < 0.95 ? faker.person.sex() : faker.person.gender(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const ColumnGroupingEnabled = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
  />
);

export const ColumnGroupingEnabledReorder = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode="reorder"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const GroupingColumnModeRemove = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const GroupingColumnModeFalse = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode={false}
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const GroupingColumnModeRemoveCustomHeader = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        Header: 'Groups',
      },
    }}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const GroupingColumnModeRemovePaginatePreExpand = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
    paginateExpandedRows={false}
  />
);

export const GroupingColumnModeRemoveCustomGroupedCell = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        //last item in array of grouping state
        GroupedCell: ({ row, table }) => {
          const grouping = table.atoms.grouping.get();
          return row.getValue(grouping[grouping.length - 1]);
        },
      },
    }}
    enableGrouping
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state', 'gender'] }}
  />
);

export const ColumnGroupingEnabledWithSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
    initialState={{ expanded: true, grouping: ['state'] }}
  />
);

export const ColumnGroupingEnabledWithSelectionRemove = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    enableRowSelection
    groupedColumnMode="remove"
    initialState={{ expanded: true, grouping: ['state'] }}
  />
);

export const ColumnGroupingNoDragHandles = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableColumnDragging={false}
    enableGrouping
  />
);

export const ColumnGroupingEnabledDropZoneBottom = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    positionToolbarDropZone="bottom"
  />
);

export const ColumnGroupingEnabledCustomAggregate = () => (
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
        AggregatedCell: ({ cell }) => (
          <div className="text-red-500">{cell.renderValue() as string}</div>
        ),
        accessorKey: 'gender',
        header: 'Gender',
        icon: VenusAndMarsIcon,
      },
      {
        accessorKey: 'city',
        header: 'City',
        icon: Building2Icon,
      },
      {
        accessorKey: 'state',
        header: 'State',
        icon: MapIcon,
      },
    ]}
    data={data}
    enableGrouping
  />
);

export const ColumnGroupingBannerOnBottom = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableGrouping
    positionToolbarAlertBanner="bottom"
  />
);

export const GroupingColumnsSetState = () => {
  const [columns, setColumns] = useState<ST_ColumnDef<ST_RowData>[]>([]);
  const [data, setData] = useState<ST_RowData[]>([]);

  useEffect(() => {
    // Columns and data arrive after mount, as from a fetch.
    const timeout = setTimeout(() => {
      setColumns([
        {
          accessorKey: 'name.firstName', //access nested data with dot notation
          header: 'First Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'name.lastName',
          header: 'Last Name',
          icon: UserIcon,
        },
        {
          accessorKey: 'address', //normal accessorKey
          header: 'Address',
          icon: MapPinIcon,
        },
        {
          accessorKey: 'city',
          header: 'City',
          icon: Building2Icon,
        },
        {
          accessorKey: 'state',
          header: 'State',
          icon: MapIcon,
        },
      ]);

      setData([
        {
          address: '261 Erdman Ford',
          city: 'East Daphne',
          name: {
            firstName: 'John',
            lastName: 'Doe',
          },
          state: 'Kentucky',
        },
        {
          address: '769 Dominic Grove',
          city: 'Columbus',
          name: {
            firstName: 'Jane',
            lastName: 'Doe',
          },
          state: 'Ohio',
        },
        {
          address: '566 Brakus Inlet',
          city: 'South Linda',
          name: {
            firstName: 'Joe',
            lastName: 'Doe',
          },
          state: 'West Virginia',
        },
        {
          address: '722 Emie Stream',
          city: 'Lincoln',
          name: {
            firstName: 'Kevin',
            lastName: 'Vandy',
          },
          state: 'Nebraska',
        },
        {
          address: '32188 Larkin Turnpike',
          city: 'Charleston',
          name: {
            firstName: 'Joshua',
            lastName: 'Rolluffs',
          },
          state: 'South Carolina',
        },
      ]);
    });
    return () => clearTimeout(timeout);
  }, []);

  return <ShadcnTable columns={columns} data={data} enableGrouping />;
};

export const ColumnGroupingDropZoneAlwaysVisible = () => {
  const [draggingColumn, setDraggingColumn] =
    useState<ST_Column<Person> | null>(null);

  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      localization={
        !draggingColumn
          ? { dropToGroupBy: 'Drag a column here to group by it' }
          : undefined
      }
      onDraggingColumnChange={setDraggingColumn}
      positionToolbarAlertBanner="bottom"
      stTopToolbarProps={{
        className:
          '[&>.border-dashed]:z-2! [&>.border-dashed]:border [&>.border-dashed]:border-solid [&>.border-dashed]:border-red-500',
      }}
      state={{ draggingColumn, showToolbarDropZone: true }}
    />
  );
};

export const GroupingStateManaged = () => {
  const [grouping, setGrouping] = useState<string[]>([]);
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      onGroupingChange={setGrouping}
      state={{ grouping }}
    />
  );
};

export const GroupingAndDraggingWithSomeDisabledGrouping = () => {
  const _columns = useMemo<ST_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'firstName',
        enableGrouping: false,
        header: 'First Name',
        icon: UserIcon,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        icon: UserIcon,
      },
    ],
    [],
  );

  return (
    <ShadcnTable
      columns={_columns}
      data={data}
      enableColumnDragging
      enableGrouping
    />
  );
};

const headerCell = (canvasElement: HTMLElement, id: string) =>
  canvasElement.querySelector<HTMLElement>(
    `thead th[data-flip-column="${id}"]`,
  );

/** The first text node in `root` whose trimmed text equals `text`. */
const textNode = (root: HTMLElement, text: string) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.textContent?.trim() === text) return node;
  }
  return null;
};

const precedes = (a: Node, b: Node) =>
  !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

// Under groupedColumnMode 'remove' the grouping column's header is a
// breadcrumb: the expand-all button, then per grouped column its icon and
// name, segments separated by a chevron (D68).
export const GroupedHeaderHasIcon = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      groupedColumnMode="remove"
      initialState={{ expanded: true, grouping: ['state', 'gender'] }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => {
      const th = headerCell(canvasElement, 'st-row-expand');
      expect(th).not.toBeNull();
      expect(th).not.toHaveTextContent('State, Gender');
      const button = th!.querySelector('button');
      const mapIcon = th!.querySelector('svg.lucide-map');
      const state = textNode(th!, 'State');
      const genderIcon = th!.querySelector('svg.lucide-venus-and-mars');
      const gender = textNode(th!, 'Gender');
      expect(button).not.toBeNull();
      expect(mapIcon).not.toBeNull();
      expect(state).not.toBeNull();
      expect(genderIcon).not.toBeNull();
      expect(gender).not.toBeNull();
      const separator = [...th!.querySelectorAll('svg')].find(
        (svg) =>
          !svg.closest('button') &&
          precedes(state!, svg) &&
          precedes(svg, genderIcon!),
      );
      expect(separator).toBeDefined();
      const order = [
        button!,
        mapIcon!,
        state!,
        separator!,
        genderIcon!,
        gender!,
      ];
      order.slice(1).forEach((node, index) => {
        expect(precedes(order[index]!, node)).toBe(true);
      });
    });
  },
};

const thWidth = (canvasElement: HTMLElement) =>
  headerCell(canvasElement, 'st-row-expand')!.getBoundingClientRect().width;

// Under 'remove' the grouping column's default width is the sum of the
// grouped columns' widths, recomputed as grouping changes (D73).
export const GroupedHeaderWidthSumsColumns = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      groupedColumnMode="remove"
      initialState={{ expanded: true, grouping: ['state', 'gender'] }}
      layoutMode="grid"
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(headerCell(canvasElement, 'st-row-expand')).not.toBeNull();
      expect(Math.abs(thWidth(canvasElement) - 360)).toBeLessThanOrEqual(1);
    });
    const gender = textNode(
      headerCell(canvasElement, 'st-row-expand')!,
      'Gender',
    )!;
    // The head cell's label span: the outermost span around the breadcrumb.
    let label = gender.parentElement!;
    while (label.parentElement?.tagName === 'SPAN') label = label.parentElement;
    expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
    const banner = (await canvas.findByText(/^Grouped by/)).closest('span')!;
    await userEvent.click(
      within(banner).getByRole('button', { name: 'Gender' }),
    );
    await waitFor(() =>
      expect(Math.abs(thWidth(canvasElement) - 180)).toBeLessThanOrEqual(1),
    );
  },
};

// An explicit `displayColumnDefOptions['st-row-expand'].size` wins over the
// summed default (D73).
export const GroupedHeaderWidthOverride = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      displayColumnDefOptions={{ 'st-row-expand': { size: 240 } }}
      enableGrouping
      groupedColumnMode="remove"
      initialState={{ expanded: true, grouping: ['state', 'gender'] }}
      layoutMode="grid"
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => {
      expect(headerCell(canvasElement, 'st-row-expand')).not.toBeNull();
      expect(Math.abs(thWidth(canvasElement) - 240)).toBeLessThanOrEqual(1);
    });
  },
};

// Under 'remove' the wide grouping column aligns start: the header's
// expand-all button and breadcrumb, the group rows' chevron and label, and the
// leaf rows' chevron sit at the cell's start edge, not mid-column (F57).
export const GroupedHeaderAlignsStart = {
  render: () => <GroupingColumnModeRemove />,
  play: async ({ canvasElement }: StoryContext) => {
    const startOffset = (element: Element, cell: Element) =>
      element.getBoundingClientRect().left - cell.getBoundingClientRect().left;
    const rows = () => [...canvasElement.querySelectorAll('tbody tr')];
    const expandCell = (row: Element) =>
      row.querySelector('td[data-flip-column="st-row-expand"]')!;
    await waitFor(() => {
      const th = headerCell(canvasElement, 'st-row-expand');
      expect(th).not.toBeNull();
      const breadcrumb = textNode(th!, 'Gender')!.parentElement!.closest(
        'span:has(button)',
      )!;
      expect(startOffset(breadcrumb, th!)).toBeLessThanOrEqual(24);
      const groupCell = expandCell(rows()[0]!);
      expect(
        startOffset(groupCell.querySelector('button')!, groupCell),
      ).toBeLessThanOrEqual(24);
      const leafRow = rows().find(
        (row) =>
          row
            .querySelector('td[data-flip-column="firstName"]')
            ?.textContent?.trim() !== '',
      )!;
      const leafCell = expandCell(leafRow);
      expect(
        startOffset(leafCell.querySelector('button')!, leafCell),
      ).toBeLessThanOrEqual(32);
    });
  },
};

// With grouping active the expand column aligns start in every
// groupedColumnMode: under `false` and 'reorder' the group rows' chevrons sit
// at the cell's start and step right one indent per depth, not mid-column
// (F58).
export const GroupedExpandAlignsStartAllModes = {
  render: () => (
    <div className="flex flex-col gap-4">
      {([false, 'reorder'] as const).map((mode) => (
        <div data-mode={String(mode)} key={String(mode)}>
          <ShadcnTable
            columns={columns}
            data={data}
            enableGrouping
            groupedColumnMode={mode}
            initialState={{ expanded: true, grouping: ['state', 'gender'] }}
          />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const startOffset = (cell: Element) =>
      cell.querySelector('button')!.getBoundingClientRect().left -
      cell.getBoundingClientRect().left;
    for (const mode of ['false', 'reorder']) {
      const root = canvasElement.querySelector(`[data-mode="${mode}"]`)!;
      const rows = () => [...root.querySelectorAll('tbody tr')];
      const expandCell = (row: Element) =>
        row.querySelector('td[data-flip-column="st-row-expand"]')!;
      await waitFor(() => {
        const depth0 = startOffset(expandCell(rows()[0]!));
        const depth1 = startOffset(expandCell(rows()[1]!));
        expect(depth0, mode).toBeLessThanOrEqual(24);
        expect(depth1, mode).toBeGreaterThan(depth0);
        const leafRow = rows().find(
          (row) =>
            row
              .querySelector('td[data-flip-column="firstName"]')
              ?.textContent?.trim() !== '',
        )!;
        expect(startOffset(expandCell(leafRow)), mode).toBeLessThanOrEqual(40);
      });
    }
  },
};

// Under 'reorder' the grouped column keeps its own header, icon included.
export const GroupedHeaderHasIconReorder = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      groupedColumnMode="reorder"
      initialState={{ expanded: true, grouping: ['state', 'gender'] }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    await waitFor(() => {
      const th = headerCell(canvasElement, 'state');
      expect(th).not.toBeNull();
      expect(th!.querySelector('svg.lucide-map')).not.toBeNull();
    });
  },
};

/**
 * The banner names the grouped columns as chips, in grouping order; a chip
 * click ungroups that column.
 */
export const GroupByBanner = {
  render: () => <ColumnGroupingEnabledReorder />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const banner = (await canvas.findByText(/^Grouped by/)).closest('span')!;
    expect(banner).toHaveTextContent(/^Grouped by State, then by Gender$/);
    const chips = within(banner).getAllByRole('button');
    expect(chips.map((chip) => chip.textContent)).toEqual(['State', 'Gender']);
    await userEvent.click(chips[0]!);
    await waitFor(() =>
      expect(canvas.getByText(/^Grouped by/).closest('span')).toHaveTextContent(
        /^Grouped by Gender$/,
      ),
    );
  },
};

/**
 * Expanding a collapsed group shows its rows under it, in data order.
 */
export const ExpandGroupShowsRows = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableGrouping
      initialState={{ grouping: ['gender'] }}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const [expand] = await canvas.findAllByRole('button', { name: 'Expand' });
    const rows = () => [...canvasElement.querySelectorAll('tbody tr')];
    const groupCount = new Set(data.map((person) => person.gender)).size;
    expect(rows()).toHaveLength(Math.min(groupCount, 10));
    const groupText = (
      rows()[0]!.querySelector('td[data-flip-column="gender"]')?.textContent ??
      ''
    ).trim();
    const gender = [...new Set(data.map((person) => person.gender))]
      .filter((value) => groupText.startsWith(value))
      .sort((a, b) => b.length - a.length)[0]!;
    const members = data.filter((person) => person.gender === gender);
    expect(
      rows()[1]!.querySelector('td[data-flip-column="firstName"]'),
    ).toHaveTextContent(/^$/);
    await userEvent.click(expand!);
    // The rows under the group are its members, in data order.
    await waitFor(() =>
      members
        .slice(0, 3)
        .forEach((member, index) =>
          expect(
            rows()[index + 1]!.querySelector(
              'td[data-flip-column="firstName"]',
            ),
          ).toHaveTextContent(member.firstName),
        ),
    );
  },
};
