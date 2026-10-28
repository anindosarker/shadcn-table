import { ExampleTabs } from '@/components/example-tabs';
import {
  BasicExample,
  MinimalExample,
  AdvancedExample,
  CustomHeadlessExample,
} from '@/examples/map';

const BasicExamples = ({ isPage = false }) => (
  <ExampleTabs
    isPage={isPage}
    tabs={[
      { label: 'Basic', value: 'basic' },
      { label: 'Minimal', value: 'minimal' },
      { label: 'Advanced', value: 'advanced' },
      { label: 'Custom Headless', value: 'custom-headless' },
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
