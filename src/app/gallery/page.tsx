import type { Metadata } from 'next'
import { ChefSection } from '@/components/sections/ChefSection'
import { EccellenzaSection } from '@/components/sections/EccellenzaSection'
import { GalleryMasonry } from '@/components/sections/GalleryMasonry'
import { PageTitle } from '@/components/sections/PageTitle'

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'I piatti di Villa Salina in fotografia: tortellini, vitello tonnato, gnocchi, cotoletta alla ' +
    'piemontese e i dolci della casa, firmati dallo chef Ivo Druetta.',
  alternates: { canonical: '/gallery' },
}

export default function GalleryPage() {
  return (
    <>
      <PageTitle title="Gallery" variant="p-gallery" />
      <GalleryMasonry />
      <ChefSection />
      <EccellenzaSection />
    </>
  )
}
