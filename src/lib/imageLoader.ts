import manifest from './image-manifest.json'
import { asset } from './basePath'

/**
 * Loader di `next/image` per l'export statico.
 *
 * Su GitHub Pages non gira nessun processo Node, quindi l'ottimizzatore di
 * immagini di Next non e' disponibile. I file vengono preparati in fase di
 * build da `scripts/optimize-images.mjs`, che scrive anche
 * `image-manifest.json`: qui si traduce la larghezza richiesta da Next nel file
 * corrispondente. `srcset`, `sizes` e il caricamento in differita continuano a
 * funzionare come prima.
 *
 * Il manifest non e' sostituibile con una regola sul nome del file, per due
 * motivi:
 *
 * 1. Le larghezze disponibili cambiano da immagine a immagine, perche' nessuna
 *    viene ingrandita oltre il proprio sorgente. Next chiede sempre i suoi
 *    `deviceSizes` (640, 750, 828, …), che non coincidono con le larghezze
 *    native.
 * 2. Su qualche sorgente gia' compresso in JPEG il WebP viene piu' grande
 *    dell'originale: in quei casi il manifest rimanda al file originale.
 *
 * Costa 1,7 KB gzippati nel bundle: il loader finisce anche nel client, perche'
 * lo slider e i caroselli sono componenti client.
 */

type Variante = [larghezza: number, url: string]

// TypeScript legge le coppie del JSON come `(number | string)[]`: non sa che
// hanno sempre due elementi nell'ordine giusto. Il formato lo garantisce lo
// script che genera il manifest.
const varianti = manifest as unknown as Record<string, Variante[]>

/**
 * Le chiavi del manifest non hanno il prefisso `/assets/images/`: cosi' il
 * manifest impacchettato nel bundle non sembra un elenco di riferimenti a quei
 * file, e scripts/prune-export.mjs puo' togliere dall'export gli originali che
 * non servono piu'.
 */
const PREFISSO = '/assets/images/'

export default function imageLoader({ src, width }: { src: string; width: number }): string {
  const chiave = src.startsWith(PREFISSO) ? src.slice(PREFISSO.length) : src
  const disponibili = varianti[chiave]
  // Con un loader custom `basePath` non viene applicato: il prefisso va messo
  // qui, o in sottocartella tutte le immagini rispondono 404.
  if (!disponibili?.length) return asset(src)

  // la piu' piccola che copre la larghezza richiesta, altrimenti la piu' grande
  const scelta = disponibili.find(([w]) => w >= width) ?? disponibili[disponibili.length - 1]
  return asset(scelta ? scelta[1] : src)
}
