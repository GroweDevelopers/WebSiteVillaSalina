import { site } from '@/data/site'

/**
 * Contatti, orari e mappa. E' il corpo delle pagine Contatti e Prenotazioni,
 * che nell'originale erano due file identici.
 */
export function LocationSection() {
  return (
    <section className="location">
      <div className="container">
        <div className="row">
          <div className="col-xl-5 col-md-12">
            <div className="content">
              <div className="block-text">
                <p className="subtitle" data-aos-duration="1000" data-aos="fade-up">
                  RISTORANTE
                </p>
                <h3 className="title" data-aos-duration="1000" data-aos="fade-up">
                  Contatti
                </h3>
                <p className="text" data-aos-duration="1000" data-aos="fade-up">
                  Assapora l&apos;eleganza culinaria di Villa Salina: prenota ora il tuo
                  <br /> tavolo. Il gusto della tradizione incontra l&apos;innovazione.
                </p>
                <h6 data-aos-duration="1000" data-aos="fade-up">
                  Per prenotazioni e info
                </h6>
                <h3 className="phone" data-aos-duration="1000" data-aos="fade-up">
                  <a href={site.phone.href}>{site.phone.short}</a>
                </h3>
                <h6 data-aos-duration="1000" data-aos="fade-up">
                  INDIRIZZO E ORARI
                </h6>
                <p className="mb-6" data-aos-duration="1000" data-aos="fade-up">
                  <span>Indirizzo:</span> {site.address.contact}
                </p>
                <p className="mb-6" data-aos-duration="1000" data-aos="fade-up">
                  <span>Mail:</span> <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
                <p className="mb-6" data-aos-duration="1000" data-aos="fade-up">
                  <span>Orari:</span> {site.openingHours.display}
                </p>
                <a
                  href={site.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tf-button style3"
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-md-12" data-aos-duration="1000" data-aos="fade-left">
            <div className="image right">
              <iframe
                src={site.links.googleMapsEmbed}
                title={`Mappa con la posizione di ${site.name} a ${site.address.city}`}
                width={500}
                height={500}
                style={{
                  border: 0,
                  marginTop: -30,
                  marginLeft: -30,
                  filter: 'grayscale(100%)',
                  WebkitFilter: 'grayscale(100%)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
