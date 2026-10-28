import { ExampleTabs } from '@/components/example-tabs';
import {
  CustomizeFilterVariantsExample,
  EnableFilterFacetValuesExample,
  CustomizeFilterModesExample,
  AlternateColumnFilteringExample,
  CustomColumnFilteringUiExample,
} from '@/examples/map';

const FilteringExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Filter Variants', value: 'filter-variants' },
      { label: 'Faceted Values', value: 'faceted-values' },
      { label: 'Filter Switching', value: 'filter-switching' },
      { label: 'Popover Filters', value: 'popover-filters' },
      { label: 'Custom Filter UI', value: 'custom-filter-ui' },
    ]}
    panels={{
      'filter-variants': <CustomizeFilterVariantsExample />,
      'faceted-values': <EnableFilterFacetValuesExample />,
      'filter-switching': <CustomizeFilterModesExample />,
      'popover-filters': <AlternateColumnFilteringExample />,
      'custom-filter-ui': <CustomColumnFilteringUiExample />,
    }}
  />
);

export default FilteringExamples;
