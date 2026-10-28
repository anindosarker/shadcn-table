import { type Meta } from '@storybook/react-vite';
import {
  type ST_ColumnDef,
  useShadcnTable,
  ShadcnTable,
} from '@/components/ui/shadcn-table';

const meta: Meta = {
  title: 'Fixed Bugs/AppBar overlaps with Fullscreen Modal',
};

export default meta;

//example data type
type Person = {
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  city: string;
  state: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
  {
    name: {
      firstName: 'John',
      lastName: 'Doe',
    },
    address: '261 Erdman Ford',
    city: 'East Daphne',
    state: 'Kentucky',
  },
  {
    name: {
      firstName: 'Jane',
      lastName: 'Doe',
    },
    address: '769 Dominic Grove',
    city: 'Columbus',
    state: 'Ohio',
  },
  {
    name: {
      firstName: 'Joe',
      lastName: 'Doe',
    },
    address: '566 Brakus Inlet',
    city: 'South Linda',
    state: 'West Virginia',
  },
  {
    name: {
      firstName: 'Kevin',
      lastName: 'Vandy',
    },
    address: '722 Emie Stream',
    city: 'Lincoln',
    state: 'Nebraska',
  },
  {
    name: {
      firstName: 'Joshua',
      lastName: 'Rolluffs',
    },
    address: '32188 Larkin Turnpike',
    city: 'Omaha',
    state: 'Nebraska',
  },
];

const columns: ST_ColumnDef<Person>[] = [
  {
    accessorKey: 'name.firstName', //access nested data with dot notation
    header: 'First Name',
    size: 150,
  },
  {
    accessorKey: 'name.lastName',
    header: 'Last Name',
    size: 150,
  },
  {
    accessorKey: 'address', //normal accessorKey
    header: 'Address',
    size: 200,
  },
  {
    accessorKey: 'city',
    header: 'City',
    size: 150,
  },
  {
    accessorKey: 'state',
    header: 'State',
    size: 150,
  },
];

// API GAP: MRT's MUI `<AppBar>`/`<Toolbar>`/`<CssBaseline>` have no ST
// equivalent. The original repro checks that the fullscreen modal renders ABOVE
// a sticky app bar. We replace the MUI AppBar with a plain sticky <div> so the
// z-index/overlap behavior can still be exercised when toggling fullscreen.
export const FullscreenIsAboveAppbar = () => {
  const table = useShadcnTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
  });

  return (
    <>
      <div className="sticky top-0 z-40 bg-primary px-6 py-4 text-primary-foreground">
        <p>App</p>
      </div>
      <div className="p-4">
        <ShadcnTable table={table} />
      </div>
    </>
  );
};
