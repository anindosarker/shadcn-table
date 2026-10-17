import { ExampleTabs } from '@/components/example-tabs';
import FilterVariantsExample from '@/examples/customize-filter-variants';
import FacetedValuesExample from '@/examples/enable-filter-facet-values';
import FilterModesExample from '@/examples/customize-filter-modes';
import PopoverFiltersExample from '@/examples/alternate-column-filtering';
import CustomFilterUIExample from '@/examples/custom-column-filtering-ui';

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
    links={[{ label: 'More Examples', href: '/docs/examples' }]}
    panels={{
      'filter-variants': <FilterVariantsExample />,
      'faceted-values': <FacetedValuesExample />,
      'filter-switching': <FilterModesExample />,
      'popover-filters': <PopoverFiltersExample />,
      'custom-filter-ui': <CustomFilterUIExample />,
    }}
  />
);

export default FilteringExamples;
