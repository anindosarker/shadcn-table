import { type Meta, type StoryContext } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import {
  type ST_ColumnDef,
  ST_DefaultsProvider,
  ShadcnTable,
  useShadcnTable,
} from '@/components/ui/shadcn-table';
import { ST_Default_Icons as phosphor } from '@/components/ui/shadcn-table/icons/phosphor';
import { ST_Default_Icons as tabler } from '@/components/ui/shadcn-table/icons/tabler';

// One icon set for every table under ST_DefaultsProvider; a table's own
// `icons` option still wins key by key (spec 14, D27).
const meta: Meta = {
  title: 'Features/Icons Examples',
};

export default meta;

type Person = { firstName: string; lastName: string };

const data: Person[] = [
  { firstName: 'Ada', lastName: 'Lovelace' },
  { firstName: 'Alan', lastName: 'Turing' },
];

const columns: ST_ColumnDef<Person>[] = [
  { accessorKey: 'firstName', header: 'First Name' },
  { accessorKey: 'lastName', header: 'Last Name' },
];

/** A table with its merged AddIcon drawn below it, so the play can read it. */
const IconTable = ({
  id,
  icons,
}: {
  id: string;
  icons?: { AddIcon: typeof phosphor.AddIcon };
}) => {
  const table = useShadcnTable({ columns, data, icons });
  const { AddIcon } = table.options.icons;
  return (
    <div data-testid={id}>
      <ShadcnTable table={table} />
      <span data-testid={`${id}-add`}>
        <AddIcon />
      </span>
    </div>
  );
};

export const ProviderIconSet = {
  render: () => (
    <ST_DefaultsProvider icons={tabler}>
      <div className="flex flex-col gap-6">
        <IconTable id="provider" />
        <IconTable icons={{ AddIcon: phosphor.AddIcon }} id="own" />
      </div>
    </ST_DefaultsProvider>
  ),
  play: async ({ canvasElement }: StoryContext) => {
    const canvas = within(canvasElement);
    const toolbarSvg = (id: string) =>
      canvas
        .getByTestId(id)
        .querySelector('button[aria-label="Show/Hide search"] svg');
    await waitFor(() =>
      expect(toolbarSvg('provider')?.classList.contains('tabler-icon')).toBe(
        true,
      ),
    );
    // the table's own icons option wins over the provider for its key only
    const ownAdd = canvas.getByTestId('own-add').querySelector('svg');
    await expect(ownAdd).not.toBeNull();
    await expect(ownAdd?.classList.contains('tabler-icon')).toBe(false);
    await expect(toolbarSvg('own')?.classList.contains('tabler-icon')).toBe(
      true,
    );
    await expect(
      canvas
        .getByTestId('provider-add')
        .querySelector('svg')
        ?.classList.contains('tabler-icon'),
    ).toBe(true);
  },
};
