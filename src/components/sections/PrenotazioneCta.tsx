import Link from 'next/link'
import { bookingHref } from '@/data/navigation'
import { site } from '@/data/site'

/** Invito finale alla prenotazione. */
export function PrenotazioneCta() {
  return (
    <section className="s-formmail">
      <div className="container">
        <div className="row">
          <div className="formmail-content">
            <div className="block-text center style-2">
              <p className="subtitle" data-aos-duration="1000" data-aos="fade-up">
                {site.name}
              </p>
              <h3 className="title" data-aos-duration="1000" data-aos="fade-up">
                {site.tagline}
              </h3>
              <Link href={bookingHref} className="tf-button style1 text-center">
                prenota un tavolo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
