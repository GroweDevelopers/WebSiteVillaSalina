import Link from 'next/link'
import { footerNav } from '@/data/navigation'
import { site } from '@/data/site'
import { asset } from '@/lib/basePath'

export function Footer() {
  return (
    <footer className="footer style-2">
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-md-12 text-center">
            <div className="widget logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset('/assets/images/logogold.svg')} alt={site.name} />
              <p>{site.description}</p>
              <ul className="list-social style-2 d-flex justify-content-center">
                <li>
                  <a
                    href={site.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <i className="fa-brands fa-facebook-f" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} aria-label="Scrivici una email">
                    <i className="fa-solid fa-envelope" aria-hidden="true" />
                  </a>
                </li>
                <li>
                  <a
                    href={site.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                  >
                    <i className="fa-brands fa-instagram" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-xl-4 col-md-12 text-center">
            <div className="widget locations">
              <h5>DOVE SIAMO</h5>
              <ul className="list-unstyled">
                <li>
                  <p>
                    <span>Indirizzo:</span> {site.address.short}
                  </p>
                  <p>
                    <span>PRENOTAZIONI:</span> {site.email}
                  </p>
                  <p className="cl">
                    <a href={site.phone.href}>{site.phone.display}</a>{' '}
                  </p>
                </li>
                <li className="text-center">{site.openingHours.display}</li>
              </ul>
            </div>
          </div>

          <div className="col-xl-4 col-md-12 text-center">
            <div className="widget time pd-n">
              <h5>MAPPA DEL SITO</h5>
              <ul className="list-unstyled">
                {footerNav.map((item) => (
                  <li key={item.href} className="text-center">
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
                {/* Nell'originale il link e' un segnaposto (href="#"): la pagina
                    non esiste ancora. Mantenuto identico in attesa del testo. */}
                <li className="text-center">
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 30 }} className="row bottom-footer">
          <div className="text-center">
            <p>
              © Copyright {site.name} by{' '}
              <a href={site.links.agency} rel="nofollow noopener noreferrer" target="_blank">
                Growe Srl
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
