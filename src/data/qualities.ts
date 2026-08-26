import type { Counter, Quality } from '@/types'

/** Le tre qualità mostrate nella sezione "Eccellenza". */
export const qualities: Quality[] = [
  {
    icon: '/assets/images/icon/eccellenza.svg',
    title: 'ECCELLENZA CULINARIA',
    text:
      "Ogni piatto è un'opera d'arte, frutto di esperienza e maestria, che delizia i sensi e " +
      'conquista il cuore dei nostri ospiti.',
  },
  {
    icon: '/assets/images/icon/ospitalita.svg',
    title: "PASSIONE PER L'OSPITALITÀ",
    text:
      "Accogliamo i nostri clienti con calore e cortesia, creando un'atmosfera familiare dove ogni " +
      "momento diventa un'esperienza indimenticabile.",
  },
  {
    icon: '/assets/images/icon/innovazione.svg',
    title: 'INNOVAZIONE GASTRONOMICA',
    text:
      'Siamo costantemente alla ricerca di nuove idee e tecniche per sorprendere e stupire i nostri ' +
      'ospiti, offrendo un viaggio culinario unico.',
  },
]

/**
 * I quattro contatori della home.
 *
 * Nell'originale gli attributi `data-to` non coincidevano con il testo mostrato
 * (`data-to="180"` sotto la scritta "+300"). Il contatore non partiva mai,
 * perché il body non aveva la classe `counter-scroll` richiesta da app.js:
 * i valori validi sono quindi quelli scritti nel markup, riportati qui.
 */
export const counters: Counter[] = [
  { value: 1, label: 'menzione Michelin' },
  { value: 300, prefix: '+', label: 'Coperti' },
  { value: 1000, prefix: '+', label: 'Recensioni' },
  { value: 10, prefix: '+', label: 'Anni di attività' },
]

/** I punti di forza elencati nella sezione eventi della home. */
export const eventHighlights: string[] = [
  'Eccellenza Culinaria',
  "Passione per l'Ospitalità",
  'Menù personalizzato',
  'Sale per ogni esigenza',
]
