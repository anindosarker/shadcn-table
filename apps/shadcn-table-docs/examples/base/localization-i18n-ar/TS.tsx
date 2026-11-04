'use client';

//Import Shadcn Table and its Types
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

//Import Shadcn Table Translations
import { ST_Localization_AR } from '@/components/ui/shadcn-table/shared/locales/ar';

//mock data
import { data, type Person } from './makeData';
import { CakeIcon, UserIcon } from 'lucide-react';

const columns: ST_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'الاسم الأول',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'اسم العائلة',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    icon: CakeIcon,
    header: 'العمر',
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
      initialState={{ showGlobalFilter: true }}
      localization={ST_Localization_AR}
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
