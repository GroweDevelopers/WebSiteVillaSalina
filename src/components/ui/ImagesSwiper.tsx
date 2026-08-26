'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import type { ImageRef } from '@/types'

type ImagesSwiperProps = {
  images: ImageRef[]
  /** Classi aggiuntive sul contenitore, ad esempio `mt-5`. */
  className?: string
}

/**
 * Carosello di immagini della sezione "Eccellenza".
 * Stessa configurazione di `.imagesSwiper` in swiper.js.
 */
export function ImagesSwiper({ images, className }: ImagesSwiperProps) {
  return (
    <Swiper
      className={['imagesSwiper', className].filter(Boolean).join(' ')}
      centeredSlides
      loop
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        768: { slidesPerView: 1.5 },
        991: { slidesPerView: 2.42 },
      }}
    >
      {images.map((image) => (
        <SwiperSlide key={image.src}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            style={{ width: '100%', height: 459, objectFit: 'cover' }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
