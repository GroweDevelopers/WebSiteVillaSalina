import { site } from '@/data/site'

/**
 * Immagine di apertura, condivisa da tutte le pagine che hanno lo slider.
 */
export const heroImage = {
  src: '/assets/images/my/uovo.jpg',
  alt: 'Uovo con fonduta servito a Villa Salina',
}

/** Sottotitolo dello slider, identico su tutte le pagine. */
export const heroSubtitle = (
  <>
    Entra nel nostro mondo culinario dove tradizione e raffinatezza si fondono in piatti unici.
    <br /> Ti attende un&apos;esperienza gastronomica indimenticabile, dove ogni dettaglio è curato
    con passione.
  </>
)

/** Azione dello slider nelle pagine Contatti e Prenotazioni. */
export const heroCallAction = {
  label: 'Chiama ora',
  href: site.phone.href,
  external: true,
}
