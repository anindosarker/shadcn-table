import { ExampleTabs } from '@/components/example-tabs';
import FullyVirtualizedExample from '@/examples/virtualized';
import RowVirtualization from '@/examples/enable-row-virtualization';
import ColumnVirtualization from '@/examples/enable-column-virtualization';
import InfiniteScrolling from '@/examples/infinite-scrolling';

const VirtualizedExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Fully Virtualized', value: 'virtualized' },
      { label: 'Row Virtualization', value: 'row-virtualization' },
      { label: 'Column Virtualization', value: 'column-virtualization' },
      { label: 'Infinite Scrolling', value: 'infinite-scrolling' },
    ]}
    links={[{ label: 'More Examples', href: '/docs/examples' }]}
    panels={{
      virtualized: <FullyVirtualizedExample />,
      'row-virtualization': <RowVirtualization />,
      'column-virtualization': <ColumnVirtualization />,
      'infinite-scrolling': <InfiniteScrolling />,
    }}
  />
);

export default VirtualizedExamples;
