import type { MetadataRoute } from 'next';
import { publicSource } from '@/lib/source';
import { siteUrl } from '@/lib/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, priority: 1 },
    ...publicSource
      .getPages()
      .map((page) => ({ url: `${siteUrl}${page.url}` })),
  ];
}
