import type { Metadata } from 'next'
import { EccellenzaSection } from '@/components/sections/EccellenzaSection'
import { HeroSlider } from '@/components/sections/HeroSlider'
import { LocationSection } from '@/components/sections/LocationSection'
import { heroCallAction, heroImage, heroSubtitle } from '@/data/hero'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Prenotazioni',
  description: `Prenota un tavolo da Villa Salina: chiama il ${site.phone.display} o scrivi a ${site.email}. ${site.address.contact}.`,
  alternates: { canonical: '/prenotazioni/' },
}

/**
 * Nel progetto originale `Prenotazioni.cshtml` e `Contatti.cshtml` erano due
 * file identici a meno del titolo. Restano due rotte distinte, perche' i link
 * interni puntano a entrambe, ma condividono gli stessi componenti.
 */
export default function PrenotazioniPage() {
  return (
    <>
      <HeroSlider
        image={heroImage}
        title={
          <>
            Esplora il Gusto,
            <br />
            Scopri l&apos;Eleganza
          </>
        }
        subtitle={heroSubtitle}
        action={heroCallAction}
      />

      <LocationSection />
      <EccellenzaSection />
    </>
  )
}
