/**
 * Toglie dall'export gli asset che il browser non scarichera' mai.
 *
 * Dopo la conversione in WebP, `public/assets/images` resta la fonte di verita'
 * per lo sviluppo, ma nel sito pubblicato serve solo una parte: le immagini
 * convertite, gli SVG, i font, e quei pochi originali che il manifest indica
 * come piu' leggeri del WebP corrispondente.
 *
 * Il punto delicato e' *come* si decide che un file serve. Cercare la stringa
 * `/assets/...` in tutto l'export non funziona: l'HTML porta dentro anche i
 * prop serializzati di React, dove `src` e' ancora il percorso originale anche
 * se il tag reso punta al WebP. Cosi' sembrava che servisse tutto.
 *
 * Si guarda percio' solo dove un percorso significa davvero una richiesta:
 * `src`, `srcset`, `href` e `url()`. Tutto il resto e' testo.
 *
 *   npm run prune            cancella
 *   npm run prune -- --dry   elenca senza cancellare
 */

import fs from 'node:fs/promises'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'out')
const ASSETS = path.join(OUT, 'assets')
const DRY = process.argv.includes('--dry')

/**
 * Quando il sito sta in una sottocartella i riferimenti sono
 * `/WebSiteVillaSalina/assets/...`: va tolto il prefisso prima di confrontarli
 * con i file, che stanno comunque sotto `out/assets`.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Estensioni dei file generati in cui cercare i riferimenti. */
const TESTUALI = new Set(['.html', '.css', '.js', '.mjs', '.json', '.txt', '.xml', '.map'])

/**
 * Contesti in cui un percorso e' una richiesta e non una stringa qualsiasi.
 * `srcset` va spezzato sulle virgole, perche' porta piu' URL con il descrittore
 * di larghezza attaccato.
 */
const CONTESTI = [
  { re: /\bsrc\s*=\s*["']([^"']+)["']/gi, lista: false },
  { re: /\bhref\s*=\s*["']([^"']+)["']/gi, lista: false },
  { re: /\bsrc[sS]et\s*=\s*["']([^"']+)["']/gi, lista: true },
  { re: /url\(\s*["']?([^"')]+)["']?\s*\)/gi, lista: false },
]

async function elenca(dir, base = '') {
  let voci
  try {
    voci = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
  const out = []
  for (const v of voci) {
    const rel = base ? `${base}/${v.name}` : v.name
    if (v.isDirectory()) out.push(...(await elenca(path.join(dir, v.name), rel)))
    else out.push(rel)
  }
  return out
}

function raccogli(testo, dentro) {
  for (const { re, lista } of CONTESTI) {
    for (const m of testo.matchAll(re)) {
      const valori = lista ? m[1].split(',').map((p) => p.trim().split(/\s+/)[0]) : [m[1]]
      for (const v of valori) {
        const senzaBase = BASE_PATH && v?.startsWith(BASE_PATH) ? v.slice(BASE_PATH.length) : v
        if (!senzaBase?.startsWith('/assets/')) continue
        const rel = decodeURIComponent(senzaBase.split('?')[0]).replace(/^\/assets\//, '')
        if (rel && !rel.endsWith('/')) dentro.add(rel)
      }
    }
  }
}

const generati = await elenca(OUT)
const citati = new Set()
for (const rel of generati) {
  if (rel.startsWith('assets/')) continue
  if (!TESTUALI.has(path.extname(rel).toLowerCase())) continue
  raccogli(await fs.readFile(path.join(OUT, rel), 'utf8'), citati)
}

const presenti = await elenca(ASSETS)
const daTenere = presenti.filter((f) => citati.has(f))
const daTogliere = presenti.filter((f) => !citati.has(f))

let byteTolti = 0
for (const f of daTogliere) {
  const p = path.join(ASSETS, f)
  byteTolti += (await fs.stat(p)).size
  if (!DRY) await fs.rm(p)
}

async function svuota(dir) {
  let voci
  try {
    voci = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const v of voci) if (v.isDirectory()) await svuota(path.join(dir, v.name))
  try {
    if (dir !== ASSETS && (await fs.readdir(dir)).length === 0) await fs.rmdir(dir)
  } catch {
    /* non vuota */
  }
}
if (!DRY) await svuota(ASSETS)

/**
 * Un dominio personalizzato non puo' vivere in una sottocartella: se il CNAME
 * restasse, GitHub redirigerebbe l'anteprima verso un dominio non ancora
 * configurato e il sito risulterebbe irraggiungibile.
 */
if (BASE_PATH) {
  const cname = path.join(OUT, 'CNAME')
  try {
    await fs.rm(cname)
    console.log(`CNAME rimosso: il sito e' in sottocartella (${BASE_PATH})`)
  } catch {
    /* non c'era */
  }
}

const mb = (n) => (n / 1048576).toFixed(1)
console.log(
  `${presenti.length} asset nell'export: ${daTenere.length} richiesti, ${daTogliere.length} mai richiesti\n` +
    `${DRY ? 'da togliere' : 'rimossi'}: ${mb(byteTolti)} MB`
)

// Rete di sicurezza: un file richiesto ma assente e' un'immagine rotta online.
// Meglio fallire la build.
const mancanti = [...citati].filter((c) => !presenti.includes(c))
if (mancanti.length) {
  console.error(`\nERRORE: ${mancanti.length} asset richiesti ma assenti dall'export:`)
  mancanti.slice(0, 20).forEach((m) => console.error(`  /assets/${m}`))
  process.exit(1)
}
