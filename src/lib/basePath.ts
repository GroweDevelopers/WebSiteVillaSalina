/**
 * Sottocartella da cui il sito viene servito.
 *
 * Vuota quando il sito sta alla radice di un dominio proprio
 * (`https://www.villa-salina.com/`), valorizzata quando sta in una
 * sottocartella, come sull'indirizzo di anteprima di GitHub Pages
 * (`https://growedevelopers.github.io/WebSiteVillaSalina/`).
 *
 * `basePath` di Next copre `next/link`, le rotte e i file sotto `_next`, ma
 * **non** i percorsi assoluti scritti a mano: gli `url()` dell'SCSS, i `src`
 * degli `<img>` semplici e quello che restituisce il loader delle immagini.
 * Quelli passano da qui.
 *
 * Il valore arriva da `NEXT_PUBLIC_BASE_PATH`, letta anche dallo SCSS
 * attraverso `sassOptions.additionalData` in `next.config.ts`.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Prefissa un percorso assoluto con la sottocartella, se c'e'. */
export function asset(percorso: string): string {
  return `${BASE_PATH}${percorso}`
}
