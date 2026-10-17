'use client';

//Import Shadcn React Table and its Types
import {
  ShadcnReactTable,
  type SRT_ColumnDef,
} from '@/components/ui/shadcn-react-table';

//Import Shadcn React Table Translations
import { SRT_Localization_NL } from '@/components/ui/shadcn-react-table/locales/nl';

//mock data
import { data, type Person } from './makeData';

const columns: SRT_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    header: 'Voornaam',
  },
  {
    accessorKey: 'lastName',
    header: 'Achternaam',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    header: 'Leeftijd',
  },
  //end
];

const Example = () => {
  return (
    <ShadcnReactTable
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
      localization={SRT_Localization_NL}
    />
  );
};

export default Example;
