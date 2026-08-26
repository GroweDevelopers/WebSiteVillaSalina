import type { Metadata } from 'next'
import Link from 'next/link'
import { PageTitle } from '@/components/sections/PageTitle'
import { PrenotazioneCta } from '@/components/sections/PrenotazioneCta'
import { site } from '@/data/site'

export const metadata: Metadata = {
  title: 'Pagina non trovata',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <PageTitle title="Pagina non trovata" />

      <section className="about-restaurant">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="block-text center">
                <p className="subtitle">Errore 404</p>
                <h3 className="title">La pagina che cercavi non esiste</h3>
                <p className="text">
                  Forse l&apos;indirizzo è cambiato o è stato scritto male. Torna alla home oppure
                  chiamaci allo <a href={site.phone.href}>{site.phone.short}</a>: ti aiutiamo
                  volentieri.
                </p>
                <Link href="/" className="tf-button style3">
                  Torna alla home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PrenotazioneCta />
    </>
  )
}
