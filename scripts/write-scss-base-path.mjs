/**
 * Scrive `src/styles/abstracts/_base-path.scss` con la sottocartella corrente.
 *
 * `basePath` di Next non tocca gli `url()` dentro il CSS, quindi lo SCSS deve
 * conoscere il prefisso da solo. Passarlo con `sassOptions.additionalData` non
 * funziona: con Turbopack arriva al solo foglio di ingresso, non ai partial, e
 * ognuno di loro esplode con "undefined variable".
 *
 * Il file viene invece generato e riesportato da `abstracts/_index.scss`, che
 * ogni partial importa gia' con `@use '../abstracts/' as *`.
 *
 * Resta versionato, col valore vuoto, cosi' un `next dev` senza questo passo
 * compila comunque.
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''
const DESTINAZIONE = path.join(process.cwd(), 'src/styles/abstracts/_base-path.scss')

const contenuto = `// GENERATO da scripts/write-scss-base-path.mjs — non modificare a mano.
//
// Sottocartella da cui il sito viene servito, letta da NEXT_PUBLIC_BASE_PATH.
// Vuota per un dominio proprio, valorizzata per l'anteprima in sottocartella.
$base-path: "${BASE_PATH}";
`

const attuale = await fs.readFile(DESTINAZIONE, 'utf8').catch(() => null)
if (attuale !== contenuto) {
  await fs.writeFile(DESTINAZIONE, contenuto, 'utf8')
  console.log(`base-path SCSS: "${BASE_PATH || '(radice)'}"`)
} else {
  console.log(`base-path SCSS: "${BASE_PATH || '(radice)'}" (invariato)`)
}
