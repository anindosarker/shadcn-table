import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { addCommand, packageManagers } from '@/lib/install';
import { libraryItem } from '@/lib/shared';

/** The library install command, one tab per package manager. */
export const InstallCommand = ({ item = libraryItem }: { item?: string }) => (
  <Tabs items={[...packageManagers]}>
    {packageManagers.map((pm) => (
      <Tab key={pm} value={pm}>
        <DynamicCodeBlock lang="bash" code={addCommand(item, pm)} />
      </Tab>
    ))}
  </Tabs>
);
