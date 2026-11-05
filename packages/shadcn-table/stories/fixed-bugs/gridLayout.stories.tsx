import { faker } from '@faker-js/faker';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { type ST_ColumnDef, ShadcnTable } from '@/components/ui/shadcn-table';
import { Building2Icon, MapIcon, MapPinIcon, UserIcon } from 'lucide-react';

const meta: Meta = {
  title: 'Fixed Bugs/Grid Layout',
};

export default meta;

type Person = {
  address: string;
  city: string;
  firstName: string;
  lastName: string;
  state: string;
};

const columns: ST_ColumnDef<Person>[] = [
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
    accessorKey: 'address',
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
];

const data = [...Array(6)].map(() => ({
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  state: faker.location.state(),
}));

export const CenterAlignInGridLayoutMode = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      layoutMode="grid"
      stTableBodyCellProps={{
        align: 'center',
      }}
      stTableHeadCellProps={{
        align: 'center',
      }}
    />
  );
};

export const RightAlignInGridLayoutMode = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      layoutMode="grid"
      stTableBodyCellProps={{
        align: 'right',
      }}
      stTableHeadCellProps={{
        align: 'right',
      }}
    />
  );
};

// In the grid layout `align` still aligns the header and body cell content.
const expectAligned =
  (justify: RegExp) =>
  async ({ canvasElement }: StoryContext) => {
    await within(canvasElement).findAllByText(data[0]!.firstName);
    const cells = [
      canvasElement.querySelector<HTMLElement>(
        'thead th[data-flip-column="firstName"]',
      )!,
      canvasElement.querySelector<HTMLElement>(
        'tbody td[data-flip-column="firstName"]',
      )!,
    ];
    for (const cell of cells) {
      expect(getComputedStyle(cell).display).toMatch(/flex/);
      expect(getComputedStyle(cell).justifyContent).toMatch(justify);
    }
  };

CenterAlignInGridLayoutMode.play = expectAligned(/^center$/);
RightAlignInGridLayoutMode.play = expectAligned(/^(right|end|flex-end)$/);
