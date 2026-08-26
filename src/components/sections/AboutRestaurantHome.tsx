import Image from 'next/image'
import Link from 'next/link'
import { IMAGE_SIZES } from '@/lib/imageSizes'

/**
 * Blocco "Un Passato di Tradizione e Eccellenza" della home.
 *
 * L'id `about-resturant` conserva il refuso dell'originale: e' il bersaglio
 * dell'ancora nel pulsante dello slider di apertura.
 */
export function AboutRestaurantHome() {
  return (
    <section className="about-restaurant" id="about-resturant">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="about-restaurant-main">
              <div className="image left" data-aos-duration="1000" data-aos="fade-right">
                <Image
                  src="/assets/images/my/palazzo.png"
                  alt="La facciata storica di Villa Salina"
                  width={722}
                  height={722}
                  sizes={IMAGE_SIZES}
                />
              </div>

              <div className="content">
                <div className="block-text center">
                  <p className="subtitle" data-aos-duration="1000" data-aos="fade-up">
                    Villa salina
                  </p>
                  <h3 className="title" data-aos-duration="1000" data-aos="fade-up">
                    Un Passato di
                    <br /> Tradizione e Eccellenza
                  </h3>
                  <p className="text" data-aos-duration="1000" data-aos="fade-up">
                    Fondato su una storia familiare radicata nel settore alimentare, Villa Salina si
                    erge come un simbolo di eccellenza culinaria.
                  </p>
                  <p data-aos-duration="1000" data-aos="fade-up">
                    Attraverso un&apos;attenta ristrutturazione, abbiamo trasformato un edificio
                    storico in un ristorante d&apos;eccezione, mantenendo intatto il suo splendore
                    originale. Oggi, con orgoglio e umiltà, celebriamo la menzione nella guida
                    Michelin, testimone del nostro impegno per l&apos;alta gastronomia.
                  </p>
                  <Link href="/storia" className="tf-button style3">
                    Scopri di più
                  </Link>
                </div>
              </div>

              <div
                className="image right d-none d-lg-block"
                data-aos-duration="1000"
                data-aos="fade-left"
              >
                <Image
                  src="/assets/images/my/scale.png"
                  alt="Lo scalone interno di Villa Salina"
                  width={1000}
                  height={1000}
                  sizes={IMAGE_SIZES}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
