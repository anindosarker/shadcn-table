'use client';

import { useId, useState, type ReactNode } from 'react';
import type { CodeBlockProps } from 'fumadocs-ui/components/codeblock';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { BaseTabs } from '@/components/base-selector';
import {
  IconLibrarySwitch,
  useIconLibrary,
} from '@/components/icon-library-selector';
import { LocaleSwitch } from '@/components/locale-selector';
import { Label } from '@/components/ui-radix/label';
import { Switch } from '@/components/ui-radix/switch';
import { cn } from '@/lib/cn';
import { trackInstallCommandCopied } from '@/lib/analytics';
import {
  addCommand,
  editionAddCommand,
  editionItem,
  initCommand,
  installDir,
  localeAddCommand,
  namespaceAddCommand,
  packageManagers,
  perBase,
  registryEntry,
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
  before,
}: {
  command: (base: Base, pm: PackageManager) => string;
  onCopied?: (base: Base, pm: PackageManager) => void;
  /** Controls at the end of the base tab row. */
  actions?: ReactNode;
  /** Content above the package-manager tabs, in every base tab. */
  before?: ReactNode;
}) => (
  <BaseTabs
    actions={actions}
    {...perBase((base) => (
      <>
        {before}
        <CommandTabs
          command={(pm) => command(base, pm)}
          onCopied={onCopied && ((pm) => onCopied(base, pm))}
        />
      </>
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
 * The "Short form" switch at the end of the base tab row: on, the command
 * uses the `@shadcn-table` namespace instead of the full URL.
 */
const ShortFormSwitch = ({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) => {
  const id = useId();
  return (
    <div className="flex items-center gap-2 text-sm text-fd-muted-foreground">
      <Switch
        id={id}
        size="sm"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id} className="font-normal">
        Short form
      </Label>
    </div>
  );
};

/** The namespace registration step of the short form. */
const RegistryEntry = () => (
  <div className="px-4 pt-3 text-sm">
    <p className="my-0">
      Add the <code>@shadcn-table</code> registry to{' '}
      <code>components.json</code> once:
    </p>
    <DynamicCodeBlock lang="json" code={registryEntry} />
  </div>
);

/**
 * `shadcn add` from the hosted registry of the selected base. Without `item`
 * it installs the library edition of the page's icon library (a select in
 * the base tab row, shared by the page's commands through
 * `IconLibraryProvider`); `item` installs that registry item instead.
 * `overwrite` appends `--overwrite`, the update and switch form. A "Short
 * form" switch shows the `components.json` registries entry and the
 * `@shadcn-table/<item>` command instead of the full URL. `locale` installs a
 * locale item instead (`item` is ignored): a locale select joins the base tab
 * row and a line under the command names the import and the `localization`
 * value for the selected locale.
 */
export const InstallCommand = ({
  item,
  overwrite = false,
  locale = false,
}: {
  item?: string;
  overwrite?: boolean;
  /** Adds a locale select; the command installs the selected locale item. */
  locale?: boolean;
}) => {
  const [code, setCode] = useState(DEFAULT_LOCALE);
  const [short, setShort] = useState(false);
  const { library, setLibrary } = useIconLibrary();
  const selected =
    installableLocales.find((entry) => entry.code === code) ??
    installableLocales[0];
  const edition = !locale && item === undefined;
  const installed = locale
    ? `${libraryItem}-locale-${selected.code}`
    : (item ?? editionItem(library));
  const suffix = overwrite ? ' --overwrite' : '';
  const command = (base: Base, pm: PackageManager) => {
    if (locale) return localeAddCommand(selected.code, base, pm);
    if (short) return `${namespaceAddCommand(installed, pm)}${suffix}`;
    if (edition) return editionAddCommand(library, base, pm, overwrite);
    return `${addCommand(installed, base, pm)}${suffix}`;
  };
  return (
    <>
      <BaseCommandTabs
        command={command}
        onCopied={(base, pm) =>
          trackInstallCommandCopied({
            item: installed,
            base,
            package_manager: pm,
            surface: 'docs_page',
          })
        }
        before={short && !locale ? <RegistryEntry /> : undefined}
        actions={
          locale ? (
            <LocaleSwitch value={selected.code} onValueChange={setCode} />
          ) : (
            <>
              {edition ? (
                <IconLibrarySwitch value={library} onValueChange={setLibrary} />
              ) : null}
              <ShortFormSwitch checked={short} onCheckedChange={setShort} />
            </>
          )
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
