import { restorationGallery } from '@/data/history'
import type { ImageRef } from '@/types'

function IgBox({ image }: { image: ImageRef }) {
  return (
    <div className="ig-box">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} loading="lazy" />
    </div>
  )
}

/**
 * Galleria del restauro nella pagina Storia.
 *
 * Nell'originale le classi `aos-init aos-animate` erano scritte nel markup:
 * le aggiunge AOS a runtime, qui non servono.
 */
export function RestorationGallery() {
  return (
    <section className="chef-restaurant" style={{ padding: '128px 0' }}>
      <div className="container mb-5">
        <div className="row">
          <div className="menu-content">
            <div className="block-text center">
              <p className="subtitle" data-aos-duration="1000" data-aos="fade-up">
                Villa salina
              </p>
              <h3 className="title" data-aos-duration="1000" data-aos="fade-up">
                Un Passato di
                <br /> Tradizione e Eccellenza
              </h3>
              <p className="text" data-aos-duration="1000" data-aos="fade-up">
                Scopri l&apos;incredibile trasformazione di Villa Salina con le nostre foto del
                prima e dopo. <br />
                Rispettando l&apos;antica bellezza, abbiamo conservato reperti artistici e riportato
                l&apos;edificio al suo splendore originale.
                <br />
                Grazie alla meticolosa opera di Dafne Engineering e Dafne Costruzioni, ogni
                dettaglio è stato curato con attenzione per una fusione perfetta tra storia e
                modernità.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery-ig">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="gallery-ig-main">
                <div className="col-img">
                  <IgBox image={restorationGallery.left} />
                </div>
                <div className="col-img">
                  <div className="top">
                    <IgBox image={restorationGallery.topLeft} />
                    <IgBox image={restorationGallery.topRight} />
                  </div>
                  <div className="bottom">
                    <IgBox image={restorationGallery.bottom} />
                  </div>
                </div>
                <div className="col-img">
                  <IgBox image={restorationGallery.right} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
