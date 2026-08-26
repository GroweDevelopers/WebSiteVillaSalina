/** Voce di navigazione del menu principale o della mappa del sito. */
export type NavItem = {
  label: string
  href: string
}

/**
 * Immagine con testo alternativo obbligatorio e dimensioni intrinseche.
 *
 * Le dimensioni servono al browser per riservare lo spazio prima che il file
 * arrivi: senza, le immagini caricate in differita fanno sobbalzare la pagina.
 */
export type ImageRef = {
  src: string
  alt: string
  width: number
  height: number
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
