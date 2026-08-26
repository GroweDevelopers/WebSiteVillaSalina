'use client'

import Link from 'next/link'
import { Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type HeroAction = {
  label: string
  href: string
  /** true per un'ancora o un link esterno (tel:, mailto:), false per una rotta interna */
  external?: boolean
}

type HeroSliderProps = {
  image: { src: string; alt: string }
  title: React.ReactNode
  subtitle: React.ReactNode
  action: HeroAction
}

/**
 * Slider di apertura delle pagine.
 * Stessa configurazione di `.mySwiper` in swiper.js: nell'originale ha sempre
 * una sola slide, ma la struttura resta quella del carosello per poterne
 * aggiungere altre senza rimettere mano al markup.
 */
export function HeroSlider({ image, title, subtitle, action }: HeroSliderProps) {
  return (
    <Swiper
      className="mySwiper"
      modules={[Navigation, Pagination]}
      slidesPerView={1}
      spaceBetween={0}
      pagination={{
        el: '.pagination-swiper1',
        clickable: true,
        renderBullet: (index, className) => `<span class="${className}">${index + 1}</span>`,
      }}
      navigation={{ nextEl: '.next-swiper', prevEl: '.prev-swiper' }}
    >
      <SwiperSlide>
        <div className="overlay">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt} fetchPriority="high" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="box-slider">
                <div className="content-box center style-2">
                  <h1 className="title">{title}</h1>
                  <p className="sub-title">{subtitle}</p>
                  <div className="wrap-btn center st2">
                    {action.external ? (
                      <a href={action.href} className="tf-button style2">
                        {action.label}
                      </a>
                    ) : (
                      <Link href={action.href} className="tf-button style2">
                        {action.label}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  )
}
