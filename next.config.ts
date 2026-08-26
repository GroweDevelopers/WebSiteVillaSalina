import path from 'node:path'
import type { NextConfig } from 'next'

/**
 * Sottocartella da cui il sito viene servito.
 *
 * Vuota per un dominio proprio (www.villa-salina.com), valorizzata per
 * l'anteprima su growedevelopers.github.io/WebSiteVillaSalina/.
 * Vedi src/lib/basePath.ts e docs/DEPLOY.md.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  basePath,
  assetPrefix: basePath || undefined,

  /**
   * Sito pubblicato come export statico su GitHub Pages: nessun processo Node
   * a runtime. Vedi docs/DEPLOY.md.
   */
  output: 'export',

  /**
   * GitHub Pages serve `/storia/` da `storia/index.html`. Con lo slash finale
   * l'export genera quella struttura e ogni rotta risponde senza riscritture.
   */
  trailingSlash: true,

  sassOptions: {
    // permette `@use 'abstracts' as *` senza risalire con i ../
    includePaths: [path.join(process.cwd(), 'src/styles')],
    // il sorgente portato dall'originale usa ancora la sintassi legacy in qualche punto
    silenceDeprecations: ['legacy-js-api', 'import'],
  },

  images: {
    /**
     * Le fotografie sono convertite in WebP prima della build da
     * `scripts/optimize-images.mjs`; il loader traduce le larghezze richieste
     * da Next nei file generati. `formats` e `qualities` non servono piu':
     * riguardano l'ottimizzatore a runtime, che qui non gira.
     *
     * Solo WebP, niente AVIF: a parita' di peso l'encoder AVIF di sharp
     * impasta le texture. Su gallery/cotolette.png, a 4 ingrandimenti, la
     * panatura sparisce gia' a q75 e non torna nemmeno a q100. WebP q95 e'
     * indistinguibile dall'originale e pesa un quinto del PNG.
     */
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  },
}

export default nextConfig
