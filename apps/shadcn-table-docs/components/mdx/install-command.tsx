import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { BaseTabs } from '@/components/base-selector';
import {
  addCommand,
  initCommand,
  namespaceAddCommand,
  packageManagers,
  perBase,
  registryAddCommand,
  type Base,
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

/**
 * Radix | Base UI tabs (the site-wide base group) around the package-manager
 * tabs of a command that differs per base.
 */
const BaseCommandTabs = ({
  command,
}: {
  command: (base: Base, pm: PackageManager) => string;
}) => (
  <BaseTabs
    {...perBase((base) => <CommandTabs command={(pm) => command(base, pm)} />)}
  />
);

/** `shadcn init` on the selected base. */
export const InitCommand = () => (
  <BaseCommandTabs command={(base, pm) => initCommand(base, pm)} />
);

/**
 * `shadcn add` of a registry item from the hosted registry of the selected
 * base, the library by default.
 */
export const InstallCommand = ({ item = libraryItem }: { item?: string }) => (
  <BaseCommandTabs command={(base, pm) => addCommand(item, base, pm)} />
);

/**
 * The namespace form: register the registry once, then add by name. The
 * `{style}` placeholder picks the base from the project's components.json,
 * so this one does not change with the selector.
 */
export const NamespaceCommand = ({ item = libraryItem }: { item?: string }) => (
  <CommandTabs
    command={(pm) =>
      `${registryAddCommand(pm)}\n${namespaceAddCommand(item, pm)}`
    }
  />
);
