import { site } from '@/data/site'

/** Blocco dedicato alla menzione nella guida Michelin. */
export function GuidaMichelinSection() {
  return (
    <section className="testimonials">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-12 mt-5">
            <div className="testimonials-main">
              <div className="testimonials-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/my/bagna3.png"
                  alt="Bagna cauda servita a Villa Salina"
                  width={878}
                  height={625}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12 mt-5">
            <div className="testimonials-main">
              <div className="testimonials-content">
                <div className="d-flex align-items-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/images/icon/quote.png"
                    alt=""
                    aria-hidden="true"
                    width={47}
                    height={36}
                    className="me-3 mb-3"
                  />
                  <h3 className="text-start" style={{ color: '#fff', textTransform: 'uppercase' }}>
                    Una menzione alla
                    <br /> guida Michelin
                  </h3>
                </div>
                <p className="text-start h6">UN RICONOSCIMENTO ALLA PASSIONE E ALLA DEDIZIONE</p>
                <p className="text-start">
                  Per noi, ottenere questo prestigioso riconoscimento è un&apos;emozione
                  indescrivibile e un tributo al nostro impegno incessante nel creare esperienze
                  culinarie straordinarie. Essa ci motiva a perseverare nella ricerca della
                  perfezione, garantendo che ogni piatto che serviamo rifletta il nostro amore per
                  l&apos;arte della cucina e soddisfi le aspettative dei nostri ospiti più esigenti.
                </p>
                <div className="d-flex">
                  <h5>
                    <a
                      className="tf-button style1"
                      href={site.links.michelinGuide}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      VISUALIZZA GUIDA
                    </a>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
