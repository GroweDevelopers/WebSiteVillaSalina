import Image from 'next/image'
import { galleryDishes } from '@/data/gallery'
import type { ImageRef } from '@/types'
import { IMAGE_SIZES } from '@/lib/imageSizes'

function PortfolioBox({ image, className }: { image: ImageRef; className?: string }) {
  return (
    <div className={['portfolio-box-2', className].filter(Boolean).join(' ')}>
      <div className="image">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes={IMAGE_SIZES}
        />
      </div>
    </div>
  )
}

/** I due blocchi masonry della pagina Gallery, dodici piatti in tutto. */
export function GalleryMasonry() {
  const { first, second } = galleryDishes

  return (
    <section className="portfolio-mansonry">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="portfolio-mansonry-main">
              <div className="row-box">
                <PortfolioBox image={first.hero} className="t1" />
              </div>
              <div className="row-box">
                <div className="left">
                  <PortfolioBox image={first.left} />
                </div>
                <div className="right">
                  <PortfolioBox image={first.rightTop} />
                  <PortfolioBox image={first.rightBottom} />
                </div>
              </div>
              <div className="row-box">
                <div className="left">
                  <PortfolioBox image={first.bottomLeft} />
                </div>
                <div className="right">
                  <PortfolioBox image={first.bottomRight} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="portfolio-mansonry-main">
              <div className="row-box">
                <PortfolioBox image={second.hero} className="t1" />
              </div>
              <div className="row-box">
                <div className="right">
                  <PortfolioBox image={second.rightTop} />
                  <PortfolioBox image={second.rightBottom} />
                </div>
                <div className="left">
                  <PortfolioBox image={second.left} />
                </div>
              </div>
              <div className="row-box">
                <div className="left">
                  <PortfolioBox image={second.bottomLeft} />
                </div>
                <div className="right">
                  <PortfolioBox image={second.bottomRight} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
