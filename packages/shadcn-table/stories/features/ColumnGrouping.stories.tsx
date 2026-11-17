import {
  type ComponentType,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  type ST_Column,
  type ST_ColumnDef,
  type ST_RowData,
  ShadcnTable,
  ST_ExpandAllButton,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { faker } from '@faker-js/faker';
import {
  Building2Icon,
  CakeIcon,
  DollarSignIcon,
  MapIcon,
  MapPinIcon,
  UserIcon,
  VenusAndMarsIcon,
} from 'lucide-react';
import { ST_BASE } from '../../.storybook/themes';

const meta: Meta = {
  title: 'Features/Column Grouping',
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
GroupingColumnModeRemove.play = async ({
  canvasElement,
  step,
}: StoryContext) => {
  await step('Grouped Header Has Icon', async () => {
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
  });
  // The wide grouping column aligns start: the header's expand-all button and
  // breadcrumb, the group rows' chevron and label, and the leaf rows' chevron
  // sit at the cell's start edge, not mid-column (F57).
  await step('Grouped Header Aligns Start', async () => {
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
  });
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
ColumnGroupingEnabledReorder.play = async ({
  canvasElement,
  step,
}: StoryContext) => {
  await step('Grouped Header Has Icon Reorder', async () => {
    await waitFor(() => {
      const th = headerCell(canvasElement, 'state');
      expect(th).not.toBeNull();
      expect(th!.querySelector('svg.lucide-map')).not.toBeNull();
    });
  });
  // The banner names the grouped columns as chips, in grouping order; a chip
  // click ungroups that column.
  await step('Group By Banner', async () => {
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
  });
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

// The docs examples "Column Grouping" (examples/base/enable-column-grouping)
// and "Customized Grouping" (examples/base/customize-remove-column-grouping):
// their columns, options and rows.
interface ExamplePerson {
  age: number;
  firstName: string;
  gender: string;
  lastName: string;
  salary: number;
  state: string;
}

// The docs examples' rows (examples/base/<name>/makeData.ts, the same file
// for every grouping example): first name, last name, age, gender, state,
// salary.
const exampleRows: [string, string, number, string, string, number][] = [
  ['Danika', 'Rodriguez', 57, 'Male', 'Utah', 31404],
  ['Eloisa', 'Kohler', 31, 'Male', 'Alaska', 45801],
  ['Gunner', 'Rolfson', 22, 'Male', 'Arizona', 54027],
  ['Andreanne', 'Hamill', 65, 'Female', 'Hawaii', 60975],
  ['Kali', 'Jones', 56, 'Female', 'Kentucky', 27067],
  ['Felicia', 'Mitchell', 34, 'Male', 'South Carolina', 48423],
  ['Philip', 'Koepp', 32, 'Male', 'Louisiana', 36713],
  ['Aniya', 'Mante', 41, 'Female', 'Minnesota', 77658],
  ['Nelda', 'Gottlieb', 41, 'Female', 'Delaware', 57634],
  ['Marty', 'Kihn', 19, 'Male', 'Delaware', 95427],
  ['Alvis', 'Turcotte', 53, 'Female', 'Wyoming', 14272],
  ['Kavon', 'Spencer', 37, 'Female', 'Missouri', 79499],
  ['Winifred', 'Wilderman', 56, 'Female', 'Iowa', 96293],
  ['Brooklyn', 'Monahan', 35, 'Female', 'Nevada', 13219],
  ['Santino', 'Brown', 33, 'Male', 'Mississippi', 36361],
  ['Bianka', 'Yost', 28, 'Female', 'Wisconsin', 89057],
  ['Herman', 'Herzog', 63, 'Female', 'South Carolina', 28110],
  ['Earl', 'Gottlieb', 65, 'Female', 'Florida', 31400],
  ['Valentine', 'Bauch', 61, 'Female', 'North Carolina', 35130],
  ['Joanny', 'Koss', 23, 'Male', 'Colorado', 90422],
  ['Aliza', 'Wilkinson', 25, 'Female', 'Virginia', 98417],
  ['Eldred', 'Collier', 37, 'Male', 'Mississippi', 43741],
  ['Dorris', 'Koch', 37, 'Male', 'Delaware', 40979],
  ['Felix', 'Zieme', 51, 'Male', 'Ohio', 55319],
  ['Salma', 'Treutel', 32, 'Female', 'Pennsylvania', 31722],
  ['Durward', 'Kris', 36, 'Male', 'Iowa', 28486],
  ['Osborne', 'Barrows', 28, 'Male', 'West Virginia', 43996],
  ['Adelia', 'Abbott', 38, 'Male', 'Oregon', 34720],
  ['Thad', 'Wiegand', 64, 'Female', 'Alabama', 56146],
  ['Tiana', 'Tromp', 51, 'Male', 'Arkansas', 45636],
  ['Gwen', 'Bergstrom', 36, 'Female', 'Wyoming', 95145],
  ['Evalyn', 'Mitchell', 53, 'Female', 'Illinois', 86990],
  ['Edyth', 'Macejkovic', 55, 'Female', 'Kentucky', 65344],
  ['Lamar', 'Bechtelar', 58, 'Female', 'Rhode Island', 93753],
  ['Tillman', 'Jacobs', 36, 'Female', 'New Mexico', 13393],
  ['Turner', 'Haley', 56, 'Female', 'Nebraska', 93733],
  ['Omer', 'Funk', 28, 'Female', 'Iowa', 77913],
  ['Alivia', 'Ledner', 56, 'Male', 'Alabama', 12591],
  ['Dortha', 'Schmitt', 43, 'Male', 'Mississippi', 80347],
  ['Ellie', 'Schinner', 41, 'Female', 'Rhode Island', 42232],
  ['Pansy', 'Reilly', 55, 'Male', 'Louisiana', 87255],
  ['Alfonzo', 'Abernathy', 40, 'Male', 'Utah', 53374],
  ['Carmine', 'Orn', 24, 'Female', 'Georgia', 89363],
  ['Taylor', 'Herzog', 63, 'Male', 'Florida', 81429],
  ['Ray', 'Little', 27, 'Female', 'Maine', 53736],
  ['Melyssa', 'Bechtelar', 56, 'Male', 'New Mexico', 85152],
  ['Coy', 'Schoen', 32, 'Male', 'Florida', 83999],
  ['Lexi', 'Reinger', 39, 'Female', 'Virginia', 17585],
  ['Carlee', 'Turcotte', 25, 'Male', 'Missouri', 85236],
  ['Tamia', 'Stamm', 47, 'Female', 'Nevada', 65037],
  ['Leola', 'Donnelly', 30, 'Female', 'Missouri', 23897],
  ['Allison', 'Stanton', 34, 'Male', 'New Hampshire', 34389],
  ['Neoma', 'Flatley', 65, 'Female', 'Connecticut', 43669],
  ['Brad', 'Altenwerth', 18, 'Male', 'Virginia', 85599],
  ['Magdalen', 'Berge', 58, 'Female', 'Louisiana', 65571],
  ['Kathryn', 'Kirlin', 48, 'Female', 'New Hampshire', 97434],
  ['Rod', 'Sawayn', 19, 'Female', 'Nevada', 58951],
  ['Georgette', 'Beatty', 53, 'Male', 'Kentucky', 12203],
  ['Dianna', 'King', 23, 'Female', 'Vermont', 13515],
  ['Kellie', 'Parker', 43, 'Trans Male', 'Louisiana', 49457],
  ['Faustino', 'Ankunding', 43, 'Male', 'Indiana', 49943],
  ['Hilton', 'Pacocha', 58, 'Male', 'South Dakota', 34874],
  ['Shanel', 'Schneider', 33, 'Female', 'Nebraska', 50446],
  ['Wade', 'Kiehn', 23, 'Male', 'Delaware', 29522],
  ['Austyn', 'Rempel', 35, 'Female', 'Arkansas', 42997],
  ['Maggie', 'Keebler', 20, 'Female', 'California', 11588],
  ['Ruby', 'Kertzmann', 40, 'Female', 'Missouri', 45860],
  ['Lilyan', 'Pfannerstill', 37, 'Cisgender', 'Washington', 37347],
  ['Fletcher', 'Huels', 65, 'Female', 'Colorado', 11596],
  ['Danyka', 'Gleason', 36, 'Male', 'Alabama', 71238],
  ['Tressa', 'McCullough', 64, 'Female', 'Virginia', 47028],
  ['Heber', 'Bernhard', 37, 'Cisgender', 'California', 11268],
  ['Damon', 'Barrows', 20, 'Female', 'West Virginia', 22796],
  ['Willy', 'Koss', 35, 'Female', 'Colorado', 88346],
  ['Carley', 'Block', 54, 'Female', 'Michigan', 32934],
  ['Randy', 'Powlowski', 31, 'Female', 'Mississippi', 68186],
  ['Rubye', 'Weissnat', 43, 'Female', 'South Carolina', 19377],
  ['Gloria', 'Green', 54, 'Male', 'Georgia', 85559],
  ['Kian', 'Hand', 56, 'Male', 'Alaska', 81062],
  ['Adelia', 'Weber', 29, 'Male', 'Wyoming', 62704],
  ['Clemmie', 'Nienow', 64, 'Male', 'New Hampshire', 84951],
  ['Buck', 'Ankunding', 25, 'Male', 'Kentucky', 88189],
  ['Abbey', 'Kulas', 36, 'Female', 'Oklahoma', 62902],
  ['Godfrey', 'Beahan', 43, 'Female', 'Georgia', 85231],
  ['Jayde', 'Friesen', 60, 'Male', 'Minnesota', 68939],
  ['Kaela', 'Bernhard', 51, 'Female', 'Virginia', 61567],
  ['Jerome', 'Jast', 22, 'Male', 'Wisconsin', 47210],
  ['Lawrence', 'Steuber', 39, 'Male', 'Mississippi', 99291],
  ['Deon', 'Romaguera', 53, 'Female', 'Vermont', 98288],
  ['Jena', "O'Hara", 41, 'Female', 'Iowa', 40063],
  ['Ima', 'Bartell', 62, 'Female', 'Rhode Island', 72570],
  ['Antonina', 'McCullough', 59, 'Male', 'Nebraska', 95189],
  ['Steve', 'Gislason', 41, 'Male', 'Kentucky', 93162],
  ['Carmela', 'Boyle', 49, 'Male', 'Virginia', 71890],
  ['Horacio', 'Murphy', 51, 'Female', 'Vermont', 32343],
  ['Bettie', "O'Hara", 40, 'Female', 'North Dakota', 60492],
  ['Rene', 'Gottlieb', 34, 'Female', 'Florida', 90192],
  ['Turner', 'Ward', 32, 'Female', 'Tennessee', 55249],
  ['Elaina', 'Orn', 30, 'Female', 'Michigan', 72501],
  ['Nayeli', 'Littel', 44, 'Nonbinary', 'Maine', 53740],
  ['Velda', 'Kuphal', 57, 'Male', 'New York', 93481],
  ['Loyce', 'Schmidt', 29, 'Female', 'Alaska', 76295],
  ['Oswaldo', 'DuBuque', 30, 'Male', 'Ohio', 55034],
  ['Kiarra', 'Dooley', 20, 'Male', 'Nebraska', 60415],
  ['Ashleigh', 'Fahey', 56, 'Female', 'New Mexico', 28186],
  ['Jordyn', 'Weissnat', 49, 'Female', 'North Dakota', 81663],
  ['Maureen', 'Swift', 63, 'Male', 'Ohio', 53538],
  ['Cathryn', 'Spinka', 42, 'Female', 'New Hampshire', 14586],
  ['Xzavier', 'Raynor', 37, 'Male', 'California', 60776],
  ['Alexander', 'Kris', 63, 'Female', 'North Carolina', 85926],
  ['Golda', 'McLaughlin', 41, 'Cisgender', 'Kansas', 49250],
  ['Delbert', 'Jacobson', 40, 'Female', 'New Hampshire', 58482],
  ['Cordia', 'Hermann', 45, 'Female', 'Mississippi', 29543],
  ['Brennon', 'Smith', 39, 'Nonbinary', 'Missouri', 65193],
  ['Kraig', 'Moen', 59, 'Male', 'West Virginia', 52677],
  ['Lionel', 'Hartmann', 30, 'Nonbinary', 'Alabama', 58743],
  ['Terrill', 'Feest', 61, 'Female', 'West Virginia', 97637],
  ['Jaylin', 'Murazik', 56, 'Male', 'Wyoming', 68290],
  ['Tyrique', 'Emard', 55, 'Male', 'New Hampshire', 23052],
  ['Shanelle', 'Hilll', 35, 'Male', 'New Mexico', 66504],
  ['Antwan', 'Zieme', 21, 'Male', 'Utah', 56638],
  ['Kyler', 'Schmeler', 19, 'Female', 'Oklahoma', 73721],
  ['Colt', 'Wiegand', 64, 'Male', 'New York', 69024],
  ['Paul', 'Leannon', 21, 'Male', 'New York', 67575],
  ['Magnus', 'Ortiz', 53, 'Female', 'Ohio', 18489],
  ['Kathryn', 'Langworth', 39, 'Male', 'Utah', 25720],
  ['Zelma', 'Grimes', 42, 'Male', 'Texas', 94083],
  ['Eddie', 'Paucek', 40, 'Nonbinary', 'Michigan', 96538],
  ['Tressa', 'Cartwright', 26, 'Female', 'Maine', 38495],
  ['Dawn', 'Huels', 57, 'Male', 'New Jersey', 41603],
  ['Pinkie', 'Rau', 30, 'Female', 'New Jersey', 27073],
  ['Macie', 'Reynolds', 18, 'Male', 'Massachusetts', 86581],
  ['Bertrand', 'Cummings', 62, 'Female', 'Illinois', 96908],
  ['Dylan', 'Wolf', 65, 'Male', 'New York', 75557],
  ['Elsa', 'Lockman', 36, 'Female', 'Colorado', 30586],
  ['Haylee', 'Price', 57, 'Male', 'Utah', 59047],
  ['Harold', 'Stracke', 49, 'Female', 'Indiana', 99744],
  ['Kelly', 'Monahan', 20, 'Male', 'Indiana', 64408],
  ['Lee', "O'Hara", 38, 'Male', 'Washington', 23136],
  ['Trevor', 'Beier', 65, 'Female', 'New York', 19235],
  ['Theron', 'Windler', 32, 'Male', 'North Dakota', 52825],
  ['Jennings', 'Halvorson', 34, 'Male', 'New York', 24737],
  ['Charity', 'Kuvalis', 40, 'Male', 'Mississippi', 60813],
  ['Kaitlyn', 'Maggio', 23, 'Female', 'Indiana', 74616],
  ['Reymundo', 'Osinski', 45, 'Female', 'New Mexico', 50978],
  ['Glen', 'Kub', 47, 'Male', 'Vermont', 85742],
  ['Reinhold', 'Reichel', 30, 'Female', 'Alabama', 30531],
  ['Theresia', 'Wyman', 50, 'Female', 'Kentucky', 49835],
  ['Lurline', 'Koepp', 59, 'Female', 'Alabama', 10645],
  ['Elise', 'Schimmel', 42, 'Male', 'Illinois', 80267],
  ['Maeve', 'Mante', 54, 'Male', 'Massachusetts', 34713],
  ['Michale', 'Collier', 59, 'Male', 'Alaska', 75197],
  ['Adell', 'Champlin', 37, 'Female', 'Tennessee', 80245],
  ['Cyril', 'Hahn', 48, 'Male', 'Louisiana', 76679],
  ['Josiah', 'Durgan', 50, 'Female', 'North Carolina', 76309],
  ['Rene', 'Weber', 58, 'Female', 'Mississippi', 51097],
  ['Stacey', 'Pouros', 34, 'Male', 'Minnesota', 71566],
  ['Kody', 'Braun', 38, 'Female', 'Alabama', 63733],
  ['Maritza', 'Bartell', 45, 'Female', 'Idaho', 14581],
  ['Abbey', 'Fay', 30, 'Male', 'New Mexico', 21372],
  ['Duncan', 'Carroll', 50, 'Male', 'Washington', 65996],
  ['Eldridge', 'Stroman', 42, 'Male', 'Alaska', 59594],
  ['Roberta', 'Bashirian', 38, 'Male', 'Nevada', 91870],
  ['Erwin', 'Kihn', 26, 'Nonbinary', 'Louisiana', 48803],
  ['Alberta', 'Considine', 37, 'Male', 'Illinois', 84906],
  ['Lexi', "O'Hara", 29, 'Male', 'Virginia', 72684],
  ['Alvera', 'Balistreri', 25, 'Female', 'Alaska', 79844],
  ['Kayden', 'Emard', 35, 'Female', 'Alaska', 98252],
  ['Rahul', 'Greenfelder', 27, 'Female', 'Wisconsin', 63419],
  ['Caterina', 'Koss', 52, 'Male', 'Arkansas', 58259],
  ['Eriberto', 'Klein', 20, 'Male', 'Iowa', 73198],
  ['Lilla', 'Thompson', 36, 'Male', 'Washington', 53856],
  ['Jonathan', 'Brakus', 47, 'Female', 'Kansas', 45726],
  ['Darby', 'Frami', 58, 'Female', 'Texas', 68700],
  ['Damon', 'Barrows', 22, 'Female', 'Pennsylvania', 23156],
  ['Eliezer', 'Erdman', 25, 'Female', 'Missouri', 48537],
  ['Marge', 'Windler', 29, 'Female', 'Georgia', 54107],
  ['Raleigh', 'Lakin', 48, 'Male', 'Nebraska', 13802],
  ['Freida', 'Barrows', 54, 'Female', 'North Carolina', 32719],
  ['Allen', 'Gaylord', 57, 'Female', 'Virginia', 41416],
  ['Blanche', 'Luettgen', 39, 'Male', 'Missouri', 81498],
  ['Domingo', 'Bauch', 36, 'Female', 'Alaska', 35159],
  ['Elijah', 'Kiehn', 43, 'Female', 'Colorado', 11772],
  ['Mozelle', 'Kuvalis', 44, 'Female', 'Massachusetts', 25499],
  ['Adaline', 'Volkman', 19, 'Female', 'Louisiana', 74049],
  ['Edward', 'Wisozk', 22, 'Female', 'Washington', 90236],
  ['Rita', 'Gaylord', 64, 'Female', 'Georgia', 12755],
  ['Burdette', 'Fisher', 27, 'Female', 'Connecticut', 29371],
  ['Naomi', 'Ebert', 52, 'Female', 'Colorado', 48525],
  ['Sid', 'Champlin', 43, 'Female', 'Pennsylvania', 77186],
  ['Darwin', 'Luettgen', 57, 'Male', 'Illinois', 34401],
  ['Bonita', 'Klocko', 43, 'Male', 'Arkansas', 85883],
  ['Tremayne', 'Casper', 58, 'Female', 'Nebraska', 47237],
  ['Maximillian', "O'Connell", 27, 'Female', 'New Jersey', 33190],
  ['Nola', 'Bashirian', 36, 'Male', 'Nebraska', 45510],
  ['Vernon', 'Murray', 62, 'Male', 'Montana', 25464],
  ['Edwin', 'Rippin', 32, 'Male', 'Michigan', 44083],
  ['Zola', 'Goodwin', 20, 'Male', 'Idaho', 62729],
  ['Dangelo', 'Abshire', 31, 'Female', 'Connecticut', 40247],
  ['Kallie', 'Swaniawski', 45, 'Male', 'Virginia', 35294],
];

const examplePeople: ExamplePerson[] = exampleRows.map(
  ([firstName, lastName, age, gender, state, salary]) => ({
    age,
    firstName,
    gender,
    lastName,
    salary,
    state,
  }),
);

const exampleColumns: ST_ColumnDef<ExamplePerson>[] = [
  {
    header: 'First Name',
    accessorKey: 'firstName',
    icon: UserIcon,
  },
  {
    header: 'Last Name',
    accessorKey: 'lastName',
    icon: UserIcon,
  },
  {
    header: 'Age',
    accessorKey: 'age',
    icon: CakeIcon,
  },
  {
    header: 'Gender',
    accessorKey: 'gender',
    icon: VenusAndMarsIcon,
  },
  {
    header: 'State',
    accessorKey: 'state',
    icon: MapIcon,
  },
  {
    header: 'Salary',
    accessorKey: 'salary',
    icon: DollarSignIcon,
  },
];

type GroupedColumnMode = false | 'remove' | 'reorder';

/** The React Aria radio group takes `onChange` and holds its own label. */
const AriaRadioGroup = RadioGroup as unknown as ComponentType<{
  children?: ReactNode;
  className?: string;
  onChange: (value: string) => void;
  value: string;
}>;

const DemoRadioGroup = ({
  groupedColumnMode,
  setGroupedColumnMode,
}: {
  groupedColumnMode: GroupedColumnMode;
  setGroupedColumnMode: (groupedColumnMode: GroupedColumnMode) => void;
}) => {
  const onChange = (value: string) =>
    setGroupedColumnMode(
      value === 'false' ? false : (value as 'remove' | 'reorder'),
    );
  const items = (
    <>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="reorder" id="grouped-column-mode-reorder" />
        <Label htmlFor="grouped-column-mode-reorder">
          &quot;reorder&quot; (default)
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="remove" id="grouped-column-mode-remove" />
        <Label htmlFor="grouped-column-mode-remove">&quot;remove&quot;</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="false" id="grouped-column-mode-false" />
        <Label htmlFor="grouped-column-mode-false">false</Label>
      </div>
    </>
  );
  if (ST_BASE === 'aria') {
    return (
      <AriaRadioGroup
        className="mx-auto flex w-fit flex-col items-center"
        onChange={onChange}
        value={String(groupedColumnMode)}
      >
        <Label>Grouped Column Mode</Label>
        <div className="flex gap-3">{items}</div>
      </AriaRadioGroup>
    );
  }
  return (
    <div className="mx-auto text-center">
      <Label>Grouped Column Mode</Label>
      <RadioGroup
        className="flex"
        onValueChange={onChange}
        value={String(groupedColumnMode)}
      >
        {items}
      </RadioGroup>
    </div>
  );
};

const ColumnGroupingTable = () => {
  const [groupedColumnMode, setGroupedColumnMode] =
    useState<GroupedColumnMode>('reorder');
  const table = useShadcnTable({
    columns: exampleColumns,
    data: examplePeople,
    enableGrouping: true,
    groupedColumnMode,
    initialState: {
      expanded: true,
      grouping: ['state', 'gender'],
      pagination: { pageIndex: 0, pageSize: 20 },
    },
    stTableContainerProps: { className: 'max-h-[800px]' },
  });
  return (
    <div className="flex flex-col gap-4">
      <DemoRadioGroup
        groupedColumnMode={groupedColumnMode}
        setGroupedColumnMode={setGroupedColumnMode}
      />
      <ShadcnTable table={table} />
    </div>
  );
};

/**
 * Grouped by State then Gender under "reorder"; picking "remove" takes the
 * grouped columns out of the table and keeps the groups.
 */
export const ColumnGrouping = {
  render: () => <ColumnGroupingTable />,
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const banner = (await canvas.findByText(/^Grouped by/)).closest('span')!;
    expect(banner).toHaveTextContent(/^Grouped by State, then by Gender$/);
    const radios = canvas.getAllByRole('radio');
    expect(radios).toHaveLength(3);
    expect(radios[0]).toBeChecked();
    expect(headerCell(canvasElement, 'state')).not.toBeNull();
    await userEvent.click(radios[1]!);
    await waitFor(() => {
      expect(headerCell(canvasElement, 'state')).toBeNull();
      expect(headerCell(canvasElement, 'gender')).toBeNull();
    });
    expect(canvas.getByText(/^Grouped by/).closest('span')).toHaveTextContent(
      /^Grouped by State, then by Gender$/,
    );
  },
};

const CustomizedGroupingTable = () => {
  const table = useShadcnTable({
    columns: exampleColumns,
    data: examplePeople,
    displayColumnDefOptions: {
      'st-row-expand': {
        Header: () => (
          <div className="flex flex-row items-center">
            <ST_ExpandAllButton />
            <div>Groups</div>
          </div>
        ),
        GroupedCell: ({ row, table }) => {
          const grouping = table.atoms.grouping.get();
          return row.getValue(grouping[grouping.length - 1]);
        },
        enableResizing: true,
        stTableBodyCellProps: ({ row }) => ({
          style: {
            color:
              row.depth === 0
                ? 'var(--primary)'
                : row.depth === 1
                  ? 'var(--secondary)'
                  : undefined,
          },
        }),
        size: 200,
      },
    },
    enableGrouping: true,
    enableColumnResizing: true,
    groupedColumnMode: 'remove',
    initialState: {
      density: 'compact',
      expanded: true,
      grouping: ['state', 'gender'],
      pagination: { pageIndex: 0, pageSize: 20 },
      sorting: [{ id: 'state', desc: false }],
    },
  });
  return <ShadcnTable table={table} />;
};

/**
 * The grouping column has its own "Groups" header and takes the place of the
 * removed State and Gender columns; the groups start at Alabama.
 */
export const CustomizedGrouping = {
  render: () => <CustomizedGroupingTable />,
  play: async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText('Groups');
    const th = headerCell(canvasElement, 'st-row-expand')!;
    expect(th).toHaveTextContent(/Groups$/);
    expect(headerCell(canvasElement, 'state')).toBeNull();
    expect(headerCell(canvasElement, 'gender')).toBeNull();
    await waitFor(() =>
      expect(
        canvasElement.querySelector(
          'tbody tr:first-child td[data-flip-column="st-row-expand"]',
        ),
      ).toHaveTextContent('Alabama'),
    );
  },
};
