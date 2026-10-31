'use client';

import { useState, type ReactNode } from 'react';
import type { CodeBlockProps } from 'fumadocs-ui/components/codeblock';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { BaseTabs } from '@/components/base-selector';
import { LocaleSwitch } from '@/components/locale-selector';
import { cn } from '@/lib/cn';
import { trackInstallCommandCopied } from '@/lib/analytics';
import {
  addCommand,
  initCommand,
  installDir,
  localeAddCommand,
  namespaceAddCommand,
  packageManagers,
  perBase,
  registryAddCommand,
  type Base,
  type PackageManager,
} from '@/lib/install';
import { installableLocales } from '@/lib/locales';
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
 * Base UI | Radix UI | React Aria tabs (the site-wide base group) around the package-manager
 * tabs of a command that differs per base.
 */
const BaseCommandTabs = ({
  command,
  onCopied,
  actions,
}: {
  command: (base: Base, pm: PackageManager) => string;
  onCopied?: (base: Base, pm: PackageManager) => void;
  /** Controls at the end of the base tab row. */
  actions?: ReactNode;
}) => (
  <BaseTabs
    actions={actions}
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

/** The locale picked first: German, the guide's long-standing example. */
const DEFAULT_LOCALE = 'de';

/**
 * `shadcn add` of a registry item from the hosted registry of the selected
 * base, the library by default. `overwrite` appends `--overwrite`, the update
 * form. `locale` installs a locale item instead (`item` is ignored): a locale
 * select joins the base tab row and a line under the command names the
 * import and the `localization` value for the selected locale.
 */
export const InstallCommand = ({
  item = libraryItem,
  overwrite = false,
  locale = false,
}: {
  item?: string;
  overwrite?: boolean;
  /** Adds a locale select; the command installs the selected locale item. */
  locale?: boolean;
}) => {
  const [code, setCode] = useState(DEFAULT_LOCALE);
  const selected =
    installableLocales.find((entry) => entry.code === code) ??
    installableLocales[0];
  const installed = locale ? `${libraryItem}-locale-${selected.code}` : item;
  return (
    <>
      <BaseCommandTabs
        command={(base, pm) =>
          locale
            ? localeAddCommand(selected.code, base, pm)
            : `${addCommand(item, base, pm)}${overwrite ? ' --overwrite' : ''}`
        }
        onCopied={(base, pm) =>
          trackInstallCommandCopied({
            item: installed,
            base,
            package_manager: pm,
            surface: 'docs_page',
          })
        }
        actions={
          locale ? (
            <LocaleSwitch value={selected.code} onValueChange={setCode} />
          ) : undefined
        }
      />
      {locale ? (
        <p>
          Import <code>{selected.exportName}</code> from{' '}
          <code>{`@/${installDir}/shared/locales/${selected.code}`}</code> and
          pass <code>{`localization={${selected.exportName}}`}</code> to{' '}
          <code>useShadcnTable</code>.
        </p>
      ) : null}
    </>
  );
};

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
