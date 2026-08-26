/**
 * Affianca ai payload di navigazione la versione con il nome "piatto".
 *
 * Next 16, con `output: 'export'`, scrive i payload che servono alla
 * navigazione lato client dentro cartelle:
 *
 *     out/storia/__next.storia/__PAGE__.txt
 *
 * ma il browser li chiede con i segmenti uniti da un punto:
 *
 *     /storia/__next.storia.__PAGE__.txt
 *
 * Su un server con riscritture non si nota; su GitHub Pages, che serve i file
 * cosi' come stanno, ogni prefetch risponde 404. Il sito continua a funzionare,
 * perche' Next ripiega su un caricamento completo della pagina, ma ogni link
 * interno ricarica tutto invece di navigare al volo.
 *
 * Nota: succede solo su Windows. Su Linux, dove gira la build di produzione,
 * Next scrive direttamente i nomi piatti e questo script non trova nulla da
 * fare. Resta perche' la build locale su Windows serva a qualcosa, e perche' se
 * un domani il comportamento cambiasse non ci sarebbe niente da correggere.
 *
 * Qui si crea, accanto a ogni file dentro una cartella `__next.*`, un gemello
 * col nome che il browser si aspetta. Restano entrambi: costa qualche decina di
 * KB e non rompe niente se un domani Next cambia convenzione.
 *
 *   npm run flatten
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'out')

let creati = 0
let byte = 0

async function percorri(dir) {
  let voci
  try {
    voci = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }

  for (const v of voci) {
    const p = path.join(dir, v.name)
    if (!v.isDirectory()) continue

    if (v.name.startsWith('__next.')) {
      // ogni file dentro diventa anche <nomeCartella>.<nomeFile> nel genitore
      for (const f of await fs.readdir(p, { withFileTypes: true })) {
        if (!f.isFile()) continue
        const gemello = path.join(dir, `${v.name}.${f.name}`)
        try {
          await fs.access(gemello)
        } catch {
          await fs.copyFile(path.join(p, f.name), gemello)
          byte += (await fs.stat(gemello)).size
          creati++
        }
      }
    }

    await percorri(p)
  }
}

await percorri(OUT)

console.log(
  creati
    ? `${creati} payload di navigazione affiancati col nome piatto (${Math.round(byte / 1024)} KB)`
    : 'nessun payload da affiancare'
)
