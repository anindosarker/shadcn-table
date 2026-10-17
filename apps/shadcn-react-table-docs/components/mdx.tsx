import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { TableOfContentsList } from './table-of-contents-list';
import { FAQs } from './faqs';
import { CompatibilityTable } from './compatibility-table';
import { Callout, CalloutContainer } from './callout';
import { TableOptionsTable } from './prop-tables/table-options-table';
import { StateOptionsTable } from './prop-tables/state-options-table';
import AlternatePaginationExample from '@/examples/alternate-pagination';
import BasicExample from '@/examples/basic';
import RemoteExample from '@/examples/remote';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    TableOfContentsList,
    FAQs,
    CompatibilityTable,
    Callout,
    CalloutContainer,
    TableOptionsTable,
    StateOptionsTable,
    AlternatePaginationExample,
    BasicExample,
    RemoteExample,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
