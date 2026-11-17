//Import Shadcn Table and its Types
import { ShadcnTable, type ST_ColumnDef } from '@/components/ui/shadcn-table';

//Import Shadcn Table Translations
import { ST_Localization_ES } from '@/components/ui/shadcn-table/shared/locales/es';
import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { CakeIcon, UserIcon } from 'lucide-react';

// The story the Localization guide shows: the table of the docs example
// localization-i18n-es, every built-in label in Spanish.
const meta: Meta = {
  title: 'Features/Localization',
};

export default meta;

type Person = {
  firstName: string;
  lastName: string;
  age: number;
};

//mock data
const data: Person[] = [
  {
    firstName: 'Kevin',
    lastName: 'Vandy',
    age: 26,
  },
  {
    firstName: 'Theodore',
    lastName: 'Browne',
    age: 28,
  },
  {
    firstName: 'Tanner',
    lastName: 'Linsley',
    age: 33,
  },
];

const columns: ST_ColumnDef<Person>[] = [
  //column definitions...
  {
    accessorKey: 'firstName',
    icon: UserIcon,
    header: 'Primer nombre',
  },
  {
    accessorKey: 'lastName',
    icon: UserIcon,
    header: 'Apellido',
    enableClickToCopy: true,
  },
  {
    accessorKey: 'age',
    icon: CakeIcon,
    header: 'Años',
  },
  //end
];

/** The toolbar, the row actions and the search field speak Spanish. */
export const Spanish = {
  render: () => (
    <ShadcnTable
      columns={columns}
      data={data}
      enableColumnOrdering
      enableEditing
      enableColumnPinning
      enableRowActions
      enableRowSelection
      enableSelectAll={false}
      initialState={{ showGlobalFilter: true }}
      localization={ST_Localization_ES}
    />
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    await canvas.findByText('Kevin');
    expect(
      canvas.getByRole('columnheader', { name: /Acciones/ }),
    ).toBeInTheDocument();
    expect(canvas.getByPlaceholderText('Buscar')).toBeVisible();
    expect(
      canvas.getAllByRole('checkbox', { name: 'Alternar seleccionar fila' }),
    ).toHaveLength(data.length);
    expect(canvas.getAllByRole('button', { name: 'Editar' })).toHaveLength(
      data.length,
    );
  },
};
