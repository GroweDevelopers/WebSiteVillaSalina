import type { Metadata } from 'next'
import { AboutRestaurantHome } from '@/components/sections/AboutRestaurantHome'
import { ChefSection } from '@/components/sections/ChefSection'
import { CounterSection } from '@/components/sections/CounterSection'
import { EccellenzaSection } from '@/components/sections/EccellenzaSection'
import { EventSection } from '@/components/sections/EventSection'
import { GuidaMichelinSection } from '@/components/sections/GuidaMichelinSection'
import { HeroSlider } from '@/components/sections/HeroSlider'
import { PrenotazioneCta } from '@/components/sections/PrenotazioneCta'
import { heroImage, heroSubtitle } from '@/data/hero'

export const metadata: Metadata = {
  // Nell'originale il titolo era "Home Page - Villa Salina": sostituito con
  // uno che dice davvero di cosa si tratta.
  title: 'Ristorante a Moretta (CN)',
  description:
    'Villa Salina, ristorante con menzione nella guida Michelin a Moretta, in provincia di Cuneo. ' +
    'Cucina piemontese dello chef Ivo Druetta in una villa dell’Ottocento restaurata.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  return (
    <>
      <HeroSlider
        image={heroImage}
        title={
          <>
            Esplora il Gusto
            <br />
            Scopri l&apos;Eleganza
          </>
        }
        subtitle={heroSubtitle}
        action={{ label: 'Scopri di più', href: '#about-resturant', external: true }}
      />

      <EccellenzaSection />
      <AboutRestaurantHome />
      <ChefSection />
      <CounterSection />
      <EventSection />
      <GuidaMichelinSection />
      <PrenotazioneCta />
    </>
  )
}
