import { ExampleTabs } from '@/components/example-tabs';
import {
  VirtualizedExample,
  EnableRowVirtualizationExample,
  EnableColumnVirtualizationExample,
  InfiniteScrollingExample,
} from '@/examples/map';

const VirtualizedExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Fully Virtualized', value: 'virtualized' },
      { label: 'Row Virtualization', value: 'row-virtualization' },
      { label: 'Column Virtualization', value: 'column-virtualization' },
      { label: 'Infinite Scrolling', value: 'infinite-scrolling' },
    ]}
    panels={{
      virtualized: <VirtualizedExample />,
      'row-virtualization': <EnableRowVirtualizationExample />,
      'column-virtualization': <EnableColumnVirtualizationExample />,
      'infinite-scrolling': <InfiniteScrollingExample />,
    }}
  />
);

export default VirtualizedExamples;
