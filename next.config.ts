import path from 'node:path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  sassOptions: {
    // permette `@use 'abstracts' as *` senza risalire con i ../
    includePaths: [path.join(process.cwd(), 'src/styles')],
    // il sorgente portato dall'originale usa ancora la sintassi legacy in qualche punto
    silenceDeprecations: ['legacy-js-api', 'import'],
  },

  images: {
    // le immagini sono tutte locali in /public: nessun remote pattern necessario

    // Solo WebP, niente AVIF. A parita' di peso l'encoder AVIF di sharp
    // impasta le texture: su gallery/cotolette.png, a 4 ingrandimenti, la
    // panatura sparisce gia' a q75 e non torna nemmeno a q100. WebP q95 e'
    // indistinguibile dall'originale e pesa comunque un quinto del PNG.
    formats: ['image/webp'],

    // Next 16 rifiuta le qualita' non dichiarate: vedi IMAGE_QUALITY in
    // src/lib/image.ts
    qualities: [95],
  },
}

export default nextConfig
