import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Preloader } from '@/components/layout/Preloader'
import { ScrollTopButton } from '@/components/layout/ScrollTopButton'
import { TopBar } from '@/components/layout/TopBar'
import { AosProvider } from '@/components/providers/AosProvider'
import { site } from '@/data/site'

// L'ordine di questi import determina l'ordine dei CSS in produzione e
// replica quello del <head> del layout Razor originale.
import 'bootstrap/dist/css/bootstrap.css'
import 'swiper/css/bundle'
import '@/styles/globals.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'aos/dist/aos.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // Il layout Razor componeva "@ViewData[\"Title\"] - Villa Salina".
    default: `${site.name} — ${site.tagline}`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body className="header-fixed main home1">
        <Preloader />
        <div id="wrapper">
          <TopBar />
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
        <ScrollTopButton />
        <AosProvider />
      </body>
    </html>
  )
}
