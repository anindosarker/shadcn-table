'use client';

//Import Shadcn Table and its Types
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

//Import Shadcn Table Translations
import { ST_Localization_HE } from '@/components/ui/shadcn-table/shared/locales/he';

//mock data
import { data, type Person } from './makeData';

const columns: ST_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    header: 'שם פרטי',
  },
  {
    accessorKey: 'lastName',
    header: 'שם משפחה',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    header: 'גיל',
  },
  //end
];

const Example = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      defaultColumn={{ size: 250 }}
      columnResizeDirection="rtl"
      enableColumnFilterModes
      enableColumnOrdering
      enableColumnResizing
      enableEditing
      enableColumnPinning
      enableRowActions
      enableRowSelection
      enableSelectAll={false}
      initialState={{ showColumnFilters: true, showGlobalFilter: true }}
      localization={ST_Localization_HE}
    />
  );
};

//App.tsx or similar
const ExampleWithThemeProvider = () => {
  return (
    //Setting the document direction to rtl as best practice to result in better accessibility
    <div style={{ direction: 'rtl' }}>
      <Example />
    </div>
  );
};

export default ExampleWithThemeProvider;
