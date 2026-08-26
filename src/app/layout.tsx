import type { Metadata } from 'next'
import type { ReactNode } from 'react'

// L'ordine di questi import determina l'ordine dei CSS in produzione e
// replica quello del <head> del layout Razor originale.
import 'bootstrap/dist/css/bootstrap.css'
import 'swiper/css/bundle'
import '@/styles/globals.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'aos/dist/aos.css'

export const metadata: Metadata = {
  title: 'Villa Salina',
  description: 'Ristorante Villa Salina — Cultura con Gusto — Moretta (CN)',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="header-fixed main home1">
        <div id="wrapper">{children}</div>
      </body>
    </html>
  )
}
