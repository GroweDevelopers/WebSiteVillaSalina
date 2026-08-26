/** Voce di navigazione del menu principale o della mappa del sito. */
export type NavItem = {
  label: string
  href: string
}

/** Immagine con testo alternativo obbligatorio. */
export type ImageRef = {
  src: string
  alt: string
}

/** Tappa della timeline nella pagina Storia. */
export type HistoryStep = {
  year: string
  title: string
  text: string
  image: ImageRef
}

/** Qualità del ristorante mostrata nella sezione "Eccellenza". */
export type Quality = {
  icon: string
  title: string
  text: string
}

/** Contatore numerico della home. */
export type Counter = {
  /** Valore finale dell'animazione */
  value: number
  /** Prefisso mostrato davanti al numero, ad esempio "+" */
  prefix?: string
  label: string
}
