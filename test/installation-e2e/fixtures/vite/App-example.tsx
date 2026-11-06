import Example from '@/components/examples/basic/basic';
import { ShadcnTable } from '@/components/ui/shadcn-table';
import { ST_Localization_DE } from '@/components/ui/shadcn-table/shared/locales/de';

const columns = [{ accessorKey: 'name', header: 'Name' }];
const data = [{ name: 'Ada' }];

export default function App() {
  return (
    <>
      <Example />
      <ShadcnTable
        columns={columns}
        data={data}
        localization={ST_Localization_DE}
      />
    </>
  );
}
