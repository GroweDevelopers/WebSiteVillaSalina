import { ImagesSwiper } from '@/components/ui/ImagesSwiper'
import { showcaseSliders } from '@/data/gallery'
import { qualities } from '@/data/qualities'
import { asset } from '@/lib/basePath'

/**
 * Le tre qualita' del ristorante seguite dai due caroselli di piatti.
 *
 * Nell'originale (`_eccellenza.cshtml`) i titoli erano `<p>` chiusi con `</a>`,
 * gli attributi `data-aos-duration` erano duplicati e i path delle immagini
 * erano relativi: qui il markup e' quello che il browser costruiva davvero.
 */
export function EccellenzaSection() {
  return (
    <section style={{ backgroundColor: '#F9F1E8' }} className="chef-restaurant">
      <div className="container" style={{ paddingBottom: 50 }}>
        <div className="row">
          <div className="menu-content">
            <div className="block-text center">
              <p className="subtitle" data-aos-duration="1000" data-aos="fade-up">
                Ristorante
              </p>
              <h3 className="title" data-aos-duration="1000" data-aos="fade-up">
                Eccellenza, Passione,
                <br /> Innovazione: Le Nostre Qualità
              </h3>
            </div>
          </div>
        </div>

        <div className="row">
          {qualities.map((quality, index) => (
            <div className="col-md-4" key={quality.title}>
              <div
                className="services-box"
                data-aos-duration="1000"
                data-aos="fade-up"
                data-aos-delay={index === 0 ? undefined : String(index * 100)}
              >
                <div className="icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(quality.icon)} alt="" aria-hidden="true" />
                </div>
                <div className="content">
                  <p className="mb-3 h5" style={{ color: '#0E1618', fontSize: 20 }}>
                    {quality.title}
                  </p>
                  <p style={{ color: '#212B38' }}>{quality.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-fluid">
        <div className="list-img">
          <ImagesSwiper images={showcaseSliders[0] ?? []} />
          <ImagesSwiper images={showcaseSliders[1] ?? []} className="mt-5" />
        </div>
      </div>
    </section>
  )
}
