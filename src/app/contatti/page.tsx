import type { Metadata } from 'next'
import { EccellenzaSection } from '@/components/sections/EccellenzaSection'
import { HeroSlider } from '@/components/sections/HeroSlider'
import { LocationSection } from '@/components/sections/LocationSection'
import { heroCallAction, heroImage, heroSubtitle } from '@/data/hero'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Contatti',
  description: `Dove siamo e come raggiungerci: ${site.address.contact}. Telefono ${site.phone.display}, email ${site.email}. Aperti ${site.openingHours.display.toLowerCase()}.`,
  alternates: { canonical: '/contatti' },
}

export default function ContattiPage() {
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
