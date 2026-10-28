import { ExampleTabs } from '@/components/example-tabs';
import {
  ExpandingTreeExpandedExample,
  ExpandingTreeFlatParseExample,
  EnableColumnGroupingExample,
  CustomizeRemoveColumnGroupingExample,
  AggregationAndGroupingExample,
  EnableDetailPanelConditionallyExample,
  ChartDetailPanelExample,
} from '@/examples/map';

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
      'expanding-tree': <ExpandingTreeExpandedExample />,
      'expanding-tree-flat-parse': <ExpandingTreeFlatParseExample />,
      'column-grouping': <EnableColumnGroupingExample />,
      'customized-grouping': <CustomizeRemoveColumnGroupingExample />,
      'aggregation-and-grouping': <AggregationAndGroupingExample />,
      'detail-panel': <EnableDetailPanelConditionallyExample />,
      'chart-detail-panel': <ChartDetailPanelExample />,
    }}
  />
);

export default ExpandingExamples;
