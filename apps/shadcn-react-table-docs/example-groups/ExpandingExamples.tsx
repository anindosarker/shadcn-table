import { ExampleTabs } from '@/components/example-tabs';
import ExpandingTreeExample from '@/examples/expanding-tree-expanded';
import ExpandingParsedTreeExample from '@/examples/expanding-tree-flat-parse';
import EnableColumnGroupingExample from '@/examples/enable-column-grouping';
import CustomizeRemoveColumnGroupingExample from '@/examples/customize-remove-column-grouping';
import AggregationAndGroupingExample from '@/examples/aggregation-and-grouping';
import DetailExample from '@/examples/enable-detail-panel-conditionally';
import ChartDetailPanelExample from '@/examples/chart-detail-panel';

const ExpandingExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Expanding Tree', value: 'expanding-tree' },
      { label: 'Parsed Tree', value: 'expanding-tree-flat-parse' },
      { label: 'Column Grouping', value: 'column-grouping' },
      { label: 'Customized Grouping', value: 'customized-grouping' },
      { label: 'Aggregation', value: 'aggregation-and-grouping' },
      { label: 'Detail Panel', value: 'detail-panel' },
      { label: 'Chart Detail Panel', value: 'chart-detail-panel' },
    ]}
    panels={{
      'expanding-tree': <ExpandingTreeExample />,
      'expanding-tree-flat-parse': <ExpandingParsedTreeExample />,
      'column-grouping': <EnableColumnGroupingExample />,
      'customized-grouping': <CustomizeRemoveColumnGroupingExample />,
      'aggregation-and-grouping': <AggregationAndGroupingExample />,
      'detail-panel': <DetailExample />,
      'chart-detail-panel': <ChartDetailPanelExample />,
    }}
  />
);

export default ExpandingExamples;
