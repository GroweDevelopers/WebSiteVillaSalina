import type { Metadata } from 'next'
import { AboutStoriaSection } from '@/components/sections/AboutStoriaSection'
import { GuidaMichelinSection } from '@/components/sections/GuidaMichelinSection'
import { HistoryTimeline } from '@/components/sections/HistoryTimeline'
import { PageTitle } from '@/components/sections/PageTitle'
import { PrenotazioneCta } from '@/components/sections/PrenotazioneCta'
import { RestorationGallery } from '@/components/sections/RestorationGallery'

export const metadata: Metadata = {
  title: 'Storia',
  description:
    'Dalla villa ottocentesca di Edoardo Salina, cuoco di casa Savoia, al restauro voluto dallo ' +
    'chef Ivo Druetta: le tappe che hanno portato Villa Salina fino alla menzione Michelin.',
  alternates: { canonical: '/storia' },
}

export default function StoriaPage() {
  return (
    <>
      <PageTitle title="Storia" variant="p-history" />
      <AboutStoriaSection />
      <HistoryTimeline />
      <GuidaMichelinSection />
      <RestorationGallery />
      <PrenotazioneCta />
    </>
  )
}
