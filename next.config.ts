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
    formats: ['image/avif', 'image/webp'],
  },

  eslint: {
    dirs: ['src'],
  },
}

export default nextConfig
