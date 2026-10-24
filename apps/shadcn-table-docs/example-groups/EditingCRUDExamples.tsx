import { ExampleTabs } from '@/components/example-tabs';
import ModalExample from '@/examples/editing-crud-modal';
import InlineRowExample from '@/examples/editing-crud-row';
import InlineCellExample from '@/examples/editing-crud-cell';
import InlineTableExample from '@/examples/editing-crud-table';
import TreeEditingExample from '@/examples/editing-crud-tree';

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
      'editing-crud': <ModalExample />,
      'editing-crud-inline-row': <InlineRowExample />,
      'editing-crud-inline-cell': <InlineCellExample />,
      'editing-crud-inline-table': <InlineTableExample />,
      'editing-crud-tree': <TreeEditingExample />,
    }}
  />
);

export default EditingCRUDExamples;
