/**
 * Pre-converte le fotografie in WebP, a piu' larghezze, e scrive un manifest.
 *
 * Serve perche' il sito viene pubblicato come export statico su GitHub Pages:
 * non c'e' nessun processo Node a runtime, quindi l'ottimizzatore di immagini
 * di Next non puo' girare. I file vengono percio' preparati in fase di build e
 * `src/lib/imageLoader.ts` li indirizza a `next/image`, che continua a
 * costruire da solo `srcset` e `sizes`.
 *
 * Formato e qualita' non sono scelti a caso: vedi `src/lib/image.ts`.
 *
 *   npm run images          converte solo cio' che manca
 *   npm run images:force    riconverte tutto
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

/** Qualita' WebP: deve restare allineata a IMAGE_QUALITY in src/lib/image.ts. */
const QUALITY = 95

/**
 * Larghezze generate. Sono i `deviceSizes` predefiniti di Next: usando gli
 * stessi valori il `srcset` che Next scrive combacia con i file che esistono.
 */
const WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048]

const ROOT = process.cwd()
const SORGENTI = path.join(ROOT, 'public/assets/images')
const DESTINAZIONE = path.join(ROOT, 'public/assets/optimized')
const MANIFEST = path.join(ROOT, 'src/lib/image-manifest.json')
const ESTENSIONI = new Set(['.png', '.jpg', '.jpeg'])
const FORZA = process.argv.includes('--force')

async function elencaImmagini(dir, base = '') {
  const voci = await fs.readdir(dir, { withFileTypes: true })
  const out = []
  for (const v of voci) {
    const rel = base ? `${base}/${v.name}` : v.name
    if (v.isDirectory()) out.push(...(await elencaImmagini(path.join(dir, v.name), rel)))
    else if (ESTENSIONI.has(path.extname(v.name).toLowerCase())) out.push(rel)
  }
  return out
}

const immagini = (await elencaImmagini(SORGENTI)).sort()
const manifest = {}
let generati = 0
let scartati = 0
let byteSorgente = 0
let byteServiti = 0

if (FORZA) await fs.rm(DESTINAZIONE, { recursive: true, force: true })

for (const rel of immagini) {
  const sorgente = path.join(SORGENTI, rel)
  const meta = await sharp(sorgente).metadata()
  const pesoSorgente = (await fs.stat(sorgente)).size
  byteSorgente += pesoSorgente

  // Mai ingrandire: solo le larghezze fino a quella del sorgente, piu' la
  // larghezza nativa, che e' quella servita sui monitor grandi.
  const larghezze = [...new Set([...WIDTHS.filter((w) => w < meta.width), meta.width])].sort(
    (a, b) => a - b
  )

  const varianti = []
  for (const w of larghezze) {
    const relWebp = rel.replace(/\.(png|jpe?g)$/i, `-${w}.webp`)
    const destinazione = path.join(DESTINAZIONE, relWebp)
    await fs.mkdir(path.dirname(destinazione), { recursive: true })

    let pesoWebp
    try {
      pesoWebp = (await fs.stat(destinazione)).size
      if (FORZA) throw new Error('forza')
    } catch {
      await sharp(sorgente)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(destinazione)
      pesoWebp = (await fs.stat(destinazione)).size
      generati++
    }

    // Su un sorgente gia' compresso in JPEG, il WebP alla larghezza nativa puo'
    // venire piu' grande dell'originale: riconvertire spende bit per conservare
    // gli artefatti del JPEG. In quel caso si serve l'originale.
    if (pesoWebp >= pesoSorgente) {
      await fs.rm(destinazione, { force: true })
      scartati++
      varianti.push({ w, url: `/assets/images/${rel}`, kb: Math.round(pesoSorgente / 1024) })
      byteServiti += pesoSorgente
    } else {
      varianti.push({ w, url: `/assets/optimized/${relWebp}`, kb: Math.round(pesoWebp / 1024) })
      byteServiti += pesoWebp
    }
  }

  // Chiave senza il prefisso /assets/images/: se ci fosse, il manifest
  // impacchettato nel bundle sembrerebbe un elenco di riferimenti a quei file e
  // scripts/prune-export.mjs non potrebbe piu' togliere gli originali inutili.
  manifest[rel] = varianti.map(({ w, url }) => [w, url])
}

// Ripulisce i webp orfani, rimasti da immagini poi cancellate
async function ripulisci(dir, base = '') {
  let voci
  try {
    voci = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const v of voci) {
    const p = path.join(dir, v.name)
    const rel = base ? `${base}/${v.name}` : v.name
    if (v.isDirectory()) {
      await ripulisci(p, rel)
      if ((await fs.readdir(p)).length === 0) await fs.rmdir(p)
    } else {
      const usato = Object.values(manifest).some((vs) =>
        vs.some(([, url]) => url === `/assets/optimized/${rel}`)
      )
      if (!usato) await fs.rm(p, { force: true })
    }
  }
}
await ripulisci(DESTINAZIONE)

await fs.mkdir(path.dirname(MANIFEST), { recursive: true })
await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 1) + '\n', 'utf8')

const mb = (n) => (n / 1048576).toFixed(1)
console.log(
  `${immagini.length} sorgenti · ${generati} convertiti, ${scartati} scartati perche' piu' grandi dell'originale\n` +
    `${mb(byteSorgente)} MB di sorgenti -> ${mb(byteServiti)} MB di file serviti (tutte le larghezze insieme)\n` +
    `manifest: ${path.relative(ROOT, MANIFEST)}`
)
