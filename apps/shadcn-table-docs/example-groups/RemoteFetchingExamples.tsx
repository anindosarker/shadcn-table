import { ExampleTabs } from '@/components/example-tabs';
import {
  ReactQueryExample,
  RemoteExample,
  DynamicColumnsExample,
  LazyDetailPanelExample,
  LazySubRowsExample,
} from '@/examples/map';

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
    panels={{
      'react-query': <ReactQueryExample />,
      remote: <RemoteExample />,
      'dynamic-columns': <DynamicColumnsExample />,
      'lazy-detail-panel': <LazyDetailPanelExample />,
      'lazy-sub-rows': <LazySubRowsExample />,
    }}
  />
);

export default RemoteFetchingExamples;
