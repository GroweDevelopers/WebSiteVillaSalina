import type { ImageRef } from '@/types'

/**
 * I dodici piatti della pagina Gallery, nell'ordine dei due blocchi masonry
 * dell'originale.
 */
export const galleryDishes = {
  first: {
    hero: {
      src: '/assets/images/gallery/tortellinit.png',
      alt: 'Tortellini in brodo',
      width: 1170,
      height: 617,
    },
    left: {
      src: '/assets/images/gallery/uovo.png',
      alt: 'Uovo con fonduta e tartufo',
      width: 570,
      height: 351,
    },
    rightTop: {
      src: '/assets/images/gallery/salmon.png',
      alt: 'Salmone marinato',
      width: 570,
      height: 351,
    },
    rightBottom: {
      src: '/assets/images/gallery/remino.png',
      alt: 'Piatto di pesce con salsa',
      width: 570,
      height: 351,
    },
    bottomLeft: {
      src: '/assets/images/gallery/viteltune.png',
      alt: 'Vitello tonnato',
      width: 377,
      height: 532,
    },
    bottomRight: {
      src: '/assets/images/gallery/tortass.png',
      alt: 'Torta della casa',
      width: 764,
      height: 532,
    },
  },
  second: {
    hero: {
      src: '/assets/images/gallery/gnocchi.png',
      alt: 'Gnocchi al burro e salvia',
      width: 1170,
      height: 617,
    },
    rightTop: {
      src: '/assets/images/gallery/eu.png',
      alt: 'Antipasto della casa',
      width: 570,
      height: 732,
    },
    rightBottom: {
      src: '/assets/images/gallery/cotolette.png',
      alt: 'Cotoletta alla piemontese',
      width: 570,
      height: 351,
    },
    left: {
      src: '/assets/images/gallery/pasta2.png',
      alt: 'Pasta fresca fatta in casa',
      width: 570,
      height: 732,
    },
    bottomLeft: {
      src: '/assets/images/gallery/tortino.png',
      alt: 'Tortino al cioccolato',
      width: 764,
      height: 532,
    },
    bottomRight: {
      src: '/assets/images/gallery/pasta.png',
      alt: 'Primo piatto di pasta',
      width: 377,
      height: 532,
    },
  },
} satisfies Record<string, Record<string, ImageRef>>

/** Le sei foto dei due caroselli della sezione "Eccellenza". */
export const showcaseSliders: ImageRef[][] = [
  [
    {
      src: '/assets/images/my/cotolette.png',
      alt: 'Cotoletta impiattata',
      width: 771,
      height: 459,
    },
    {
      src: '/assets/images/my/uovo2.png',
      alt: 'Uovo con crema e guarnizione',
      width: 542,
      height: 459,
    },
    {
      src: '/assets/images/my/bagna2.png',
      alt: 'Bagna cauda servita in tavola',
      width: 536,
      height: 459,
    },
  ],
  [
    {
      src: '/assets/images/my/viteltune.png',
      alt: 'Vitello tonnato impiattato',
      width: 771,
      height: 459,
    },
    {
      src: '/assets/images/my/pastaalto.png',
      alt: 'Primo piatto di pasta visto dall’alto',
      width: 308,
      height: 459,
    },
    {
      src: '/assets/images/my/tortino.png',
      alt: 'Tortino al cioccolato con salsa',
      width: 770,
      height: 459,
    },
  ],
]
