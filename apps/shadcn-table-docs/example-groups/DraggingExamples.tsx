import { ExampleTabs } from '@/components/example-tabs';
import {
  EnableColumnOrderingExample,
  EnableRowOrderingExample,
  EnableRowDraggingExample,
} from '@/examples/map';

const DraggingExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Column Ordering', value: 'column-ordering' },
      { label: 'Row Ordering', value: 'row-ordering' },
      { label: 'Row Dragging', value: 'row-dragging' },
    ]}
    panels={{
      'column-ordering': <EnableColumnOrderingExample />,
      'row-ordering': <EnableRowOrderingExample />,
      'row-dragging': <EnableRowDraggingExample />,
    }}
  />
);

export default DraggingExamples;
