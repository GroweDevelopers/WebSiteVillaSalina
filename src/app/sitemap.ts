import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

/**
 * Con `output: 'export'` Next vuole sapere esplicitamente che questa rotta e'
 * statica: non ha modo di dedurlo da sola per i file generati.
 */
export const dynamic = 'force-static'

/**
 * Mappa del sito. Le cinque rotte sono statiche e conosciute a compilazione,
 * quindi l'elenco e' scritto qui invece di essere dedotto dal file system.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
    // Lo slash finale non e' un dettaglio: con `trailingSlash: true` le pagine
    // sono servite come /storia/, e un URL senza slash in sitemap farebbe
    // vedere a Google un redirect al posto della pagina.
    { path: '/', priority: 1, changeFrequency: 'monthly' },
    { path: '/storia/', priority: 0.8, changeFrequency: 'yearly' },
    { path: '/gallery/', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/prenotazioni/', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/contatti/', priority: 0.9, changeFrequency: 'monthly' },
  ]

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    changeFrequency,
    priority,
  }))
}
