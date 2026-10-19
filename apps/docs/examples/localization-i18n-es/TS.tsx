'use client';

//Import Shadcn Table and its Types
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

//Import Shadcn Table Translations
import { ST_Localization_ES } from '@/components/ui/shadcn-table/locales/es';

//mock data
import { data, type Person } from './makeData';

const columns: ST_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    header: 'Primer nombre',
  },
  {
    accessorKey: 'lastName',
    header: 'Apellido',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    header: 'Años',
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
      localization={ST_Localization_ES}
    />
  );
};

export default Example;
