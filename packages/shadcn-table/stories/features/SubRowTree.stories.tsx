import {
  type ST_ColumnDef,
  type ST_Localization,
  ShadcnTable,
} from '@/components/ui/shadcn-table';
import { faker } from '@faker-js/faker';
import { type Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Features/Sub Row Tree Examples',
};

export default meta;

// Partial Hebrew localization for the RTL stories. The full locale ships as its
// own registry file under shared/locales; the stories import only the barrel.
const localizationHE: Partial<ST_Localization> = {
  language: 'he',
  actions: 'פעולות',
  collapse: 'צמצום',
  collapseAll: 'צמצום הכל',
  expand: 'הרחב',
  expandAll: 'הרחב הכל',
  goToNextPage: 'לדף הבא',
  goToPreviousPage: 'לדף הקודם',
  of: 'מתוך',
  rowsPerPage: 'שורות לעמוד',
  search: 'חיפוש',
  showHideColumns: 'הצג/הסתר עמודות',
  showHideFilters: 'הצג/הסתר סינונים',
  showHideSearch: 'הצג/הסתר חיפוש',
  toggleDensity: 'שנה צפיפות',
  toggleFullScreen: 'מסך מלא',
};

const columns: ST_ColumnDef<(typeof data)[0]>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const data = [...Array(5)].map(() => ({
  address: faker.location.streetAddress(),
  age: faker.number.int(80),
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  phoneNumber: faker.phone.number(),
  subRows: [...Array(faker.number.int(4))].map(() => ({
    address: faker.location.streetAddress(),
    age: faker.number.int(80),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phoneNumber: faker.phone.number(),
    subRows: [...Array(3)].map(() => ({
      address: faker.location.streetAddress(),
      age: faker.number.int(80),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      phoneNumber: faker.phone.number(),
      subRows: [...Array(2)].map(() => ({
        address: faker.location.streetAddress(),
        age: faker.number.int(80),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        phoneNumber: faker.phone.number(),
      })),
    })),
  })),
}));

export const SubRowTreeEnabledDefault = () => (
  <ShadcnTable columns={columns} data={data} enableExpanding />
);

export const SubRowTreeLayoutGrid = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        // size: 100,
      },
    }}
    enableExpanding
    initialState={{ expanded: true }}
    layoutMode="grid"
  />
);

export const SubRowTreeLayoutGridNoGrow = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    displayColumnDefOptions={{
      'st-row-expand': {
        // size: 100,
      },
    }}
    enableExpanding
    initialState={{ expanded: true }}
    layoutMode="grid-no-grow"
  />
);

export const SubRowTreeEnabledPositionLast = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    positionExpandColumn="last"
  />
);

// Note: MUI ThemeProvider direction -> dir="rtl" on the wrapper.
export const SubRowTreeEnabledDefaultRTL = () => (
  <div dir="rtl" style={{ direction: 'rtl' }}>
    <ShadcnTable
      columns={columns}
      data={data}
      enableExpanding
      localization={localizationHE}
    />
  </div>
);

export const SubRowTreeEnabledDefaultRTLAndPositionLast = () => (
  <div dir="rtl" style={{ direction: 'rtl' }}>
    <ShadcnTable
      columns={columns}
      data={data}
      enableExpanding
      localization={localizationHE}
      positionActionsColumn="last"
    />
  </div>
);

export const SubRowTreeDisableExpandAll = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpandAll={false}
    enableExpanding
  />
);

export const SubRowTreeFilterFromLeafRows = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    filterFromLeafRows
    initialState={{ expanded: true, showColumnFilters: true }}
  />
);

export const SubRowTreeMaxLeafRowFilterDepth0 = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={0}
  />
);

export const SubRowTreeMaxLeafRowFilterDepth1 = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={1}
  />
);

export const SubRowTreeMaxLeafRowFilterDepthAndFilterFromLeafRows = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    filterFromLeafRows
    initialState={{ expanded: true, showColumnFilters: true }}
    maxLeafRowFilterDepth={0}
  />
);

export const SubRowTreeWithSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    enableRowSelection
  />
);

export const SubRowTreeWithSelectionNoSubRowSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enablePagination={false}
    enableRowSelection
    enableSubRowSelection={false}
  />
);

export const SubRowTreeWithSingleSelection = () => (
  <ShadcnTable
    columns={columns}
    data={data}
    enableExpanding
    enableMultiRowSelection={false}
    enablePagination={false}
    enableRowSelection
  />
);
