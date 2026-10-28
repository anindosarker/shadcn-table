'use client';

import type { CodeBlockProps } from 'fumadocs-ui/components/codeblock';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { BaseTabs } from '@/components/base-selector';
import { cn } from '@/lib/cn';
import { trackInstallCommandCopied } from '@/lib/analytics';
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

/**
 * The code block's action slot, fumadocs' own markup, with a click on the
 * copy button inside it reported through `onCopied`. fumadocs has no copy
 * callback; the click is the copy.
 */
const copyActions = (onCopied: () => void) => {
  const CopyActions: NonNullable<CodeBlockProps['Actions']> = (props) => (
    <div
      {...props}
      onClickCapture={onCopied}
      className={cn('empty:hidden', props.className)}
    />
  );
  return CopyActions;
};

/** One tab per package manager around a command. */
const CommandTabs = ({
  command,
  onCopied,
}: {
  command: (pm: PackageManager) => string;
  /** Runs when the command of a package manager is copied. */
  onCopied?: (pm: PackageManager) => void;
}) => (
  <Tabs items={[...packageManagers]}>
    {packageManagers.map((pm) => (
      <Tab key={pm} value={pm}>
        <DynamicCodeBlock
          lang="bash"
          code={command(pm)}
          codeblock={
            onCopied ? { Actions: copyActions(() => onCopied(pm)) } : undefined
          }
        />
      </Tab>
    ))}
  </Tabs>
);

/**
 * Radix UI | Base UI tabs (the site-wide base group) around the package-manager
 * tabs of a command that differs per base.
 */
const BaseCommandTabs = ({
  command,
  onCopied,
}: {
  command: (base: Base, pm: PackageManager) => string;
  onCopied?: (base: Base, pm: PackageManager) => void;
}) => (
  <BaseTabs
    {...perBase((base) => (
      <CommandTabs
        command={(pm) => command(base, pm)}
        onCopied={onCopied && ((pm) => onCopied(base, pm))}
      />
    ))}
  />
);

/** `shadcn init` on the selected base. */
export const InitCommand = () => (
  <BaseCommandTabs command={(base, pm) => initCommand(base, pm)} />
);

/**
 * `shadcn add` of a registry item from the hosted registry of the selected
 * base, the library by default. `overwrite` appends `--overwrite`, the update
 * form.
 */
export const InstallCommand = ({
  item = libraryItem,
  overwrite = false,
}: {
  item?: string;
  overwrite?: boolean;
}) => (
  <BaseCommandTabs
    command={(base, pm) =>
      `${addCommand(item, base, pm)}${overwrite ? ' --overwrite' : ''}`
    }
    onCopied={(base, pm) =>
      trackInstallCommandCopied({
        item,
        base,
        package_manager: pm,
        surface: 'docs_page',
      })
    }
  />
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
