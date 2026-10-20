'use client';

//Import Shadcn Table and its Types
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

//Import Shadcn Table Translations
import { ST_Localization_AZ } from '@/components/ui/shadcn-table/locales/az';

//mock data
import { data, type Person } from './makeData';

const columns: ST_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    header: 'Ad',
  },
  {
    accessorKey: 'lastName',
    header: 'Soyad',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    header: 'Yaş',
  },
  //end
];

const Example = () => {
  return (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnFilterModes
      enableColumnOrdering
      enableEditing
      enableColumnPinning
      enableRowActions
      enableRowSelection
      enableSelectAll={false}
      initialState={{ showColumnFilters: true, showGlobalFilter: true }}
      localization={ST_Localization_AZ}
    />
  );
};

export default Example;
