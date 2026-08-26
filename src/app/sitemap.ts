import type { MetadataRoute } from 'next'
import { site } from '@/data/site'

/**
 * Mappa del sito. Le cinque rotte sono statiche e conosciute a compilazione,
 * quindi l'elenco e' scritto qui invece di essere dedotto dal file system.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: 'monthly' | 'yearly' }[] = [
    { path: '', priority: 1, changeFrequency: 'monthly' },
    { path: '/storia', priority: 0.8, changeFrequency: 'yearly' },
    { path: '/gallery', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/prenotazioni', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/contatti', priority: 0.9, changeFrequency: 'monthly' },
  ]

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    changeFrequency,
    priority,
  }))
}
