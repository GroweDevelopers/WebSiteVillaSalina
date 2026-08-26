import { site } from '@/data/site'

/**
 * Barra superiore con email, indirizzo e telefono.
 *
 * Il `role` con etichetta la rende un punto di riferimento per i lettori di
 * schermo: senza, i suoi contenuti restavano fuori da qualsiasi landmark e
 * chi naviga saltando fra le sezioni non li incontrava mai.
 */
export function TopBar() {
  return (
    <div className="top-bar" role="region" aria-label="Contatti rapidi">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-md-12">
            <div className="list-info">
              <ul>
                <li>
                  <i
                    style={{ color: 'black' }}
                    className="fa fa-envelope-open"
                    aria-hidden="true"
                  />{' '}
                  <a style={{ color: 'black' }} href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </li>
                <li>
                  <i className="fa fa-map" aria-hidden="true" /> {site.address.inline}
                </li>
              </ul>
            </div>
          </div>
          <div className="col-xl-4 col-md-12">
            <div className="language">
              <i style={{ color: 'black' }} className="fa fa-phone" aria-hidden="true" />{' '}
              <a style={{ color: 'black' }} href={site.phone.href}>
                {site.phone.display}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
