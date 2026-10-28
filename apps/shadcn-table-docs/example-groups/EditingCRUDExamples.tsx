import { ExampleTabs } from '@/components/example-tabs';
import {
  EditingCrudModalExample,
  EditingCrudRowExample,
  EditingCrudCellExample,
  EditingCrudTableExample,
  EditingCrudTreeExample,
} from '@/examples/map';

const EditingCRUDExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Modal', value: 'editing-crud' },
      { label: 'Inline Row', value: 'editing-crud-inline-row' },
      { label: 'Inline Cell', value: 'editing-crud-inline-cell' },
      { label: 'Inline Table', value: 'editing-crud-inline-table' },
      { label: 'Tree Editing', value: 'editing-crud-tree' },
    ]}
    panels={{
      'editing-crud': <EditingCrudModalExample />,
      'editing-crud-inline-row': <EditingCrudRowExample />,
      'editing-crud-inline-cell': <EditingCrudCellExample />,
      'editing-crud-inline-table': <EditingCrudTableExample />,
      'editing-crud-tree': <EditingCrudTreeExample />,
    }}
  />
);

export default EditingCRUDExamples;
