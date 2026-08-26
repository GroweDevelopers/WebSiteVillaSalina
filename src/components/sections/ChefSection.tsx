import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/data/site'
import { IMAGE_SIZES } from '@/lib/image'

/** Presentazione dello chef, con ritratto e rimando alla pagina Storia. */
export function ChefSection() {
  return (
    <div className="s-chef">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="chef-main">
              <div className="block-text center style-2 col-12 col-lg-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/icon/chef.png"
                  alt=""
                  aria-hidden="true"
                  width={69}
                  height={71}
                  data-aos-duration="1000"
                  data-aos="fade-up"
                />
                <p className="subtitle" data-aos-duration="1000" data-aos="fade-up">
                  CHEF
                </p>
                <h3 className="title" data-aos-duration="1000" data-aos="fade-up">
                  Eccellenza Gastronomica
                </h3>
                <p className="text" data-aos-duration="1000" data-aos="fade-up">
                  Chef {site.chef} celebra la freschezza degli ingredienti locali e la tradizione
                  culinaria, creando piatti che esprimono l&apos;essenza del territorio. La sua
                  passione per l&apos;innovazione si fonde con il rispetto per le radici, regalando
                  esperienze gustative autentiche e memorabili.
                </p>
                <Link href="/storia" className="tf-button style1">
                  Scopri di più
                </Link>
              </div>

              <div className="chef-box col-12 col-lg-6">
                <div className="img" data-aos-duration="1000" data-aos="fade-left">
                  <Image
                    src="/assets/images/my/propietario.jpg"
                    alt={`Lo chef ${site.chef} nel ristorante ${site.name}`}
                    width={1066}
                    height={1066}
                    sizes={IMAGE_SIZES}
                    style={{ objectPosition: 'center' }}
                  />
                </div>
                <div className="info">
                  <h5 data-aos-duration="1000" data-aos="fade-up">
                    {site.chef.toUpperCase()}
                  </h5>
                  <p data-aos-duration="1000" data-aos="fade-up">
                    chef
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
