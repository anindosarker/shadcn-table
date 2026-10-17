import { ExampleTabs } from '@/components/example-tabs';
import ReactQueryExample from '@/examples/react-query';
import RemoteExample from '@/examples/remote';
import DynamicColumns from '@/examples/dynamic-columns';
import LazyDetailPanelExample from '@/examples/lazy-detail-panel';
import LazySubRowsExample from '@/examples/lazy-sub-rows';

const RemoteFetchingExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'React Query', value: 'react-query' },
      { label: 'useEffect', value: 'remote' },
      { label: 'Dynamic Columns', value: 'dynamic-columns' },
      { label: 'Lazy Detail Panel', value: 'lazy-detail-panel' },
      { label: 'Lazy Sub-Rows', value: 'lazy-sub-rows' },
    ]}
    links={[
      { label: 'Editing', href: '/docs/examples/editing-crud' },
      { label: 'More Examples', href: '/docs/examples' },
    ]}
    panels={{
      'react-query': <ReactQueryExample />,
      remote: <RemoteExample />,
      'dynamic-columns': <DynamicColumns />,
      'lazy-detail-panel': <LazyDetailPanelExample />,
      'lazy-sub-rows': <LazySubRowsExample />,
    }}
  />
);

export default RemoteFetchingExamples;
