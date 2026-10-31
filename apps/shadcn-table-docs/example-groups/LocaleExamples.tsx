import { LocaleExampleTabs } from '@/components/locale-example-tabs';
import { ExampleSnippet } from '@/components/mdx/example-snippet';
import { locales } from '@/lib/locales';

const codes = locales.map((locale) => locale.code);

const panels = Object.fromEntries(
  locales.map((locale) => [
    locale.code,
    <ExampleSnippet key={locale.code} name={locale.example} />,
  ]),
);

const LocaleExamples = () => (
  <LocaleExampleTabs locales={codes} panels={panels} />
);

export default LocaleExamples;
