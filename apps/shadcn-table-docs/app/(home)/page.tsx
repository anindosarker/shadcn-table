import type { Metadata } from 'next';
import { HomePage } from '@/components/dev-home/v12/home-page';
import { JsonLd } from '@/components/json-ld';
import { siteDescription } from '@/lib/shared';
import { softwareSourceCodeJsonLd, websiteJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  description: siteDescription,
};

export default function Page() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={softwareSourceCodeJsonLd(siteDescription)} />
      <HomePage />
    </>
  );
}
