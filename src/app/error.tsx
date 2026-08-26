'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { site } from '@/data/site'

/**
 * Schermata mostrata quando una pagina va in errore.
 *
 * Sostituisce `Views/Shared/Error.cshtml`, che mostrava il RequestId e le
 * istruzioni per attivare l'ambiente di sviluppo di ASP.NET: informazioni
 * inutili per chi visita un sito di ristorante.
 */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="about-restaurant" style={{ paddingTop: 200 }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="block-text center">
              <p className="subtitle">Qualcosa è andato storto</p>
              <h3 className="title">Non riusciamo a mostrarti questa pagina</h3>
              <p className="text">
                Riprova tra qualche istante. Se il problema resta, chiamaci allo{' '}
                <a href={site.phone.href}>{site.phone.short}</a> o scrivici a{' '}
                <a href={`mailto:${site.email}`}>{site.email}</a>.
              </p>
              <button type="button" onClick={reset} className="tf-button style3">
                Riprova
              </button>{' '}
              <Link href="/" className="tf-button style3">
                Torna alla home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
