import { ExampleTabs } from '@/components/example-tabs';
import BasicExample from '@/examples/basic';
import MinimalExample from '@/examples/minimal';
import AdvancedExample from '@/examples/advanced';
import CustomHeadlessExample from '@/examples/custom-headless';

const BasicExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Basic', value: 'basic' },
      { label: 'Minimal', value: 'minimal' },
      { label: 'Advanced', value: 'advanced' },
      { label: 'Custom Headless', value: 'custom-headless' },
    ]}
    links={[
      { label: 'Data Export', href: '/docs/examples/export-csv' },
      { label: 'DnD', href: '/docs/examples/column-ordering' },
      { label: 'Editing', href: '/docs/examples/editing-crud' },
      { label: 'Filtering', href: '/docs/examples/filter-variants' },
      { label: 'Fetching', href: '/docs/examples/react-query' },
      { label: 'Pinning', href: '/docs/examples/sticky-header' },
      { label: 'Virtualization', href: '/docs/examples/virtualized' },
      { label: 'More Examples', href: '/docs/examples' },
    ]}
    panels={{
      basic: <BasicExample />,
      minimal: <MinimalExample />,
      advanced: <AdvancedExample />,
      'custom-headless': <CustomHeadlessExample />,
    }}
  />
);

export default BasicExamples;
