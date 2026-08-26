'use client'

import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { ImageRef } from '@/types'
import { IMAGE_SIZES } from '@/lib/imageSizes'

type ImagesSwiperProps = {
  images: ImageRef[]
  /** Classi aggiuntive sul contenitore, ad esempio `mt-5`. */
  className?: string
}

/** Slide contemporaneamente visibili al breakpoint piu' largo. */
const MAX_SLIDES_PER_VIEW = 2.42

/**
 * Numero minimo di slide perche' il loop funzioni.
 *
 * Swiper fino alla 10 duplicava da solo le slide: con 3 immagini ne generava 9
 * e la striscia risultava piena. Dalla 11 il loop e' implementato spostando le
 * slide reali, e se non ce ne sono almeno il doppio di quelle visibili smette
 * di funzionare in silenzio: restano le 3 originali, una sola dentro lo
 * schermo e il resto vuoto.
 */
const MIN_SLIDES = Math.ceil(MAX_SLIDES_PER_VIEW * 2)

/**
 * Carosello di immagini della sezione "Eccellenza".
 * Stessa configurazione di `.imagesSwiper` in swiper.js dell'originale.
 */
export function ImagesSwiper({ images, className }: ImagesSwiperProps) {
  if (images.length === 0) return null

  // Si ripete la sequenza finche' non ci sono abbastanza slide per il loop:
  // e' esattamente quello che faceva da solo il vecchio Swiper.
  const repetitions = Math.max(1, Math.ceil(MIN_SLIDES / images.length))
  const slides = Array.from({ length: repetitions }, () => images).flat()

  return (
    <Swiper
      className={['imagesSwiper', className].filter(Boolean).join(' ')}
      centeredSlides
      loop
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        768: { slidesPerView: 1.5 },
        991: { slidesPerView: MAX_SLIDES_PER_VIEW },
      }}
    >
      {slides.map((image, index) => (
        <SwiperSlide key={`${image.src}-${index}`}>
          {/*
            Caricamento immediato, non in differita: le slide fuori dallo
            schermo si spostano con una transform, e il caricamento pigro non
            se ne accorge in modo affidabile. Con `lazy` restavano vuote.
          */}
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes={IMAGE_SIZES}
            loading="eager"
            style={{ width: '100%', height: 459, objectFit: 'cover' }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
