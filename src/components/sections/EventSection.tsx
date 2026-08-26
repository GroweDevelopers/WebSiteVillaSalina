import Link from 'next/link'
import { bookingHref } from '@/data/navigation'
import { eventHighlights } from '@/data/qualities'

/** I due blocchi alternati su eventi e restauro, nella home. */
export function EventSection() {
  return (
    <section className="event">
      <div className="shape" />
      <div className="container">
        <div className="row">
          <div className="col-xl-5 col-md-12">
            <div className="event-image" data-aos-duration="1000" data-aos="fade-right">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/my/bicchiere.png"
                alt="Calice di vino servito a Villa Salina"
                width={501}
                height={609}
                loading="lazy"
              />
            </div>
          </div>

          <div className="col-xl-7 col-md-12">
            <div className="event-content">
              <div className="block-text">
                <h3 className="title" data-aos-duration="1000" data-aos="fade-up">
                  Esclusività in
                  <br />
                  ogni Dettaglio
                </h3>
                <p data-aos-duration="1000" data-aos="fade-up">
                  Rendiamo ogni evento speciale con la nostra eleganza senza tempo e
                  l&apos;attenzione ai dettagli. Dai matrimoni alle cene aziendali, offriamo
                  ambienti raffinati e un servizio impeccabile per creare ricordi duraturi.
                </p>
                <ul className="list">
                  {eventHighlights.map((highlight) => (
                    <li key={highlight} data-aos-duration="1000" data-aos="fade-up">
                      {highlight}
                    </li>
                  ))}
                </ul>
                <Link href={bookingHref} className="tf-button style3">
                  Prenota ora
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-74">
          <div className="col-xl-7 col-md-12">
            <div className="event-content style-2">
              <div className="block-text">
                <h3 className="title" data-aos-duration="1000" data-aos="fade-up">
                  Rinnovare con Amore
                  <br /> per la Storia e l&apos;Arte
                </h3>
                <p data-aos-duration="1000" data-aos="fade-up">
                  La ristrutturazione di Villa Salina è stata guidata da una profonda passione per
                  preservare il suo patrimonio storico e artistico. Con rispetto per l&apos;antico,
                  abbiamo lavorato con maestria per conservare e valorizzare ogni dettaglio,
                  garantendo che il fascino e l&apos;eleganza originali siano stati magnificamente
                  mantenuti.
                </p>
                <Link href="/storia" className="tf-button style3">
                  Scopri la storia
                </Link>
              </div>
            </div>
          </div>

          <div className="col-xl-5 col-md-12">
            <div className="event-image style-2" data-aos-duration="1000" data-aos="fade-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/my/villa.jpg"
                alt="Villa Salina vista dal giardino"
                width={1140}
                height={855}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
