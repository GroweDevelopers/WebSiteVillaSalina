import { site } from '@/data/site'

/** Barra superiore con email, indirizzo e telefono. */
export function TopBar() {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-md-12">
            <div className="list-info">
              <ul>
                <li>
                  <i style={{ color: 'black' }} className="fa fa-envelope-open" aria-hidden="true" />{' '}
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
