import { ExampleTabs } from '@/components/example-tabs';
import ColumnOrdering from '@/examples/enable-column-ordering';
import RowOrdering from '@/examples/enable-row-ordering';
import RowDragging from '@/examples/enable-row-dragging';

const DraggingExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Column Ordering', value: 'column-ordering' },
      { label: 'Row Ordering', value: 'row-ordering' },
      { label: 'Row Dragging', value: 'row-dragging' },
    ]}
    links={[{ label: 'More Examples', href: '/docs/examples' }]}
    panels={{
      'column-ordering': <ColumnOrdering />,
      'row-ordering': <RowOrdering />,
      'row-dragging': <RowDragging />,
    }}
  />
);

export default DraggingExamples;
