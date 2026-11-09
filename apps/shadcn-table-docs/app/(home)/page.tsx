import type { Metadata } from 'next';
import { HomePage } from '@/components/dev-home/v12/home-page';
import { JsonLd } from '@/components/json-ld';
import { softwareSourceCodeJsonLd, websiteJsonLd } from '@/lib/structured-data';

const description =
  'A production-ready table library built with TanStack Table and shadcn/ui. Sorting, filtering, grouping, pinning, virtualization, and more, all built in.';

export const metadata: Metadata = {
  description,
};

export default function Page() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareSourceCodeJsonLd(description)} />
      <HomePage />
    </>
  );
}
