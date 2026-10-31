import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { TableOfContentsList } from './table-of-contents-list';
import { InitCommand, InstallCommand } from './mdx/install-command';
import { AgentPrompt } from './mdx/agent-prompt';
import { StorybookLink } from './mdx/storybook-link';
import { OrDivider } from './or-divider';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Callout, CalloutContainer } from './callout';
import { TableOptionsTable } from './prop-tables/table-options-table';
import { StateOptionsTable } from './prop-tables/state-options-table';
import { ColumnOptionsTable } from './prop-tables/column-options-table';
import { TableInstanceAPIsTable } from './prop-tables/table-instance-apis-table';
import { ColumnInstanceAPIsTable } from './prop-tables/column-instance-apis-table';
import { RowInstanceAPIsTable } from './prop-tables/row-instance-apis-table';
import { CellInstanceAPIsTable } from './prop-tables/cell-instance-apis-table';
import {
  CellInstanceAPIsSource,
  ColumnInstanceAPIsSource,
  ColumnOptionsSource,
  RowInstanceAPIsSource,
  StateOptionsSource,
  TableInstanceAPIsSource,
  TableOptionsSource,
} from './prop-tables/prop-table-source';
import { exampleComponents } from '@/example-groups/map';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    TableOfContentsList,
    InitCommand,
    InstallCommand,
    AgentPrompt,
    StorybookLink,
    OrDivider,
    Step,
    Steps,
    Tab,
    Tabs,
    Callout,
    CalloutContainer,
    TableOptionsTable,
    StateOptionsTable,
    ColumnOptionsTable,
    TableInstanceAPIsTable,
    ColumnInstanceAPIsTable,
    RowInstanceAPIsTable,
    CellInstanceAPIsTable,
    TableOptionsSource,
    ColumnOptionsSource,
    StateOptionsSource,
    TableInstanceAPIsSource,
    ColumnInstanceAPIsSource,
    RowInstanceAPIsSource,
    CellInstanceAPIsSource,
    ...exampleComponents,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
