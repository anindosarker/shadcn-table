'use client';

import OptionsSwitcher from './OptionsSwitcher';

/** MRT's InstanceAPIsSwitcher: the four instance API pages as tabs. */
const InstanceAPIsSwitcher = () => (
  <OptionsSwitcher
    links={[
      { label: 'Table Instance APIs', value: 'table-instance-apis' },
      { label: 'Column Instance APIs', value: 'column-instance-apis' },
      { label: 'Row Instance APIs', value: 'row-instance-apis' },
      { label: 'Cell Instance APIs', value: 'cell-instance-apis' },
    ]}
  />
);

export default InstanceAPIsSwitcher;
