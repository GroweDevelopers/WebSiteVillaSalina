import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

/**
 * Con `output: 'export'` Next vuole sapere esplicitamente che questa rotta e'
 * statica: non ha modo di dedurlo da sola per i file generati.
 */
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${site.url}/sitemap.xml`,
  }
}
