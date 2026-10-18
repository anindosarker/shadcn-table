import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import {
  addCommand,
  initCommand,
  packageManagers,
  type PackageManager,
} from '@/lib/install';
import { libraryItem } from '@/lib/shared';

/** One tab per package manager around a command. */
const CommandTabs = ({
  command,
}: {
  command: (pm: PackageManager) => string;
}) => (
  <Tabs items={[...packageManagers]}>
    {packageManagers.map((pm) => (
      <Tab key={pm} value={pm}>
        <DynamicCodeBlock lang="bash" code={command(pm)} />
      </Tab>
    ))}
  </Tabs>
);

/** `shadcn init` on the Radix base. */
export const InitCommand = () => <CommandTabs command={initCommand} />;

/** `shadcn add` of a registry item, the library by default. */
export const InstallCommand = ({ item = libraryItem }: { item?: string }) => (
  <CommandTabs command={(pm) => addCommand(item, pm)} />
);
