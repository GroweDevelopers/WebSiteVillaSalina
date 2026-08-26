import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Preloader } from '@/components/layout/Preloader'
import { ScrollTopButton } from '@/components/layout/ScrollTopButton'
import { TopBar } from '@/components/layout/TopBar'
import { AosProvider } from '@/components/providers/AosProvider'
import { RestaurantJsonLd } from '@/components/seo/RestaurantJsonLd'
import { site } from '@/data/site'

// L'ordine di questi import determina l'ordine dei CSS in produzione e
// replica quello del <head> del layout Razor originale.
import 'bootstrap/dist/css/bootstrap.css'
import 'swiper/css/bundle'
import '@/styles/globals.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'aos/dist/aos.css'

const siteTitle = `${site.name} — ${site.tagline}`

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // Il layout Razor componeva "@ViewData[\"Title\"] - Villa Salina".
    default: siteTitle,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: 'Growe Srl', url: site.links.agency }],
  keywords: [
    'ristorante Moretta',
    'ristorante Cuneo',
    'guida Michelin Piemonte',
    'cucina piemontese',
    'Ivo Druetta',
    'Villa Salina',
  ],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: site.name,
    title: siteTitle,
    description: site.description,
    url: site.url,
    images: [
      {
        url: '/assets/images/my/uovo.jpg',
        width: 1920,
        height: 1080,
        alt: `Un piatto di ${site.name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: site.description,
    images: ['/assets/images/my/uovo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        {/*
          Inter e' l'unica famiglia usata dal tema: senza precaricarla il
          browser la scopre solo dopo aver scaricato e interpretato il CSS, e
          il testo resta invisibile (font-display: block) per tutto quel tempo.
          Le altre @font-face dichiarate nel tema non vengono mai richieste,
          perche' nessuna regola le usa.
        */}
        <link
          rel="preload"
          href="/assets/font/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/assets/font/Inter-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="header-fixed main home1">
        <RestaurantJsonLd />
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
