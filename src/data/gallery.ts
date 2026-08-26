import type { ImageRef } from '@/types'

/**
 * I dodici piatti della pagina Gallery, nell'ordine dei due blocchi masonry
 * dell'originale.
 */
export const galleryDishes = {
  first: {
    hero: { src: '/assets/images/gallery/tortellinit.png', alt: 'Tortellini in brodo' },
    left: { src: '/assets/images/gallery/uovo.png', alt: 'Uovo con fonduta e tartufo' },
    rightTop: { src: '/assets/images/gallery/salmon.png', alt: 'Salmone marinato' },
    rightBottom: { src: '/assets/images/gallery/remino.png', alt: 'Piatto di pesce con salsa' },
    bottomLeft: { src: '/assets/images/gallery/viteltune.png', alt: 'Vitello tonnato' },
    bottomRight: { src: '/assets/images/gallery/tortass.png', alt: 'Torta della casa' },
  },
  second: {
    hero: { src: '/assets/images/gallery/gnocchi.png', alt: 'Gnocchi al burro e salvia' },
    rightTop: { src: '/assets/images/gallery/eu.png', alt: 'Antipasto della casa' },
    rightBottom: { src: '/assets/images/gallery/cotolette.png', alt: 'Cotoletta alla piemontese' },
    left: { src: '/assets/images/gallery/pasta2.png', alt: 'Pasta fresca fatta in casa' },
    bottomLeft: { src: '/assets/images/gallery/tortino.png', alt: 'Tortino al cioccolato' },
    bottomRight: { src: '/assets/images/gallery/pasta.png', alt: 'Primo piatto di pasta' },
  },
} satisfies Record<string, Record<string, ImageRef>>

/** Le sei foto dei due caroselli della sezione "Eccellenza". */
export const showcaseSliders: ImageRef[][] = [
  [
    { src: '/assets/images/my/cotolette.png', alt: 'Cotoletta impiattata' },
    { src: '/assets/images/my/uovo2.png', alt: 'Uovo con crema e guarnizione' },
    { src: '/assets/images/my/bagna2.png', alt: 'Bagna cauda servita in tavola' },
  ],
  [
    { src: '/assets/images/my/viteltune.png', alt: 'Vitello tonnato impiattato' },
    { src: '/assets/images/my/pastaalto.png', alt: 'Primo piatto di pasta visto dall’alto' },
    { src: '/assets/images/my/tortino.png', alt: 'Tortino al cioccolato con salsa' },
  ],
]
