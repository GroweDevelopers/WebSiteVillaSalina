import { chromium } from 'playwright'

/**
 * Confronta il riquadro di OGNI elemento visibile fra i due siti: posizione
 * orizzontale e verticale, larghezza e altezza.
 *
 * Nasce da un difetto sfuggito ai controlli precedenti: i caroselli della
 * sezione Eccellenza avevano un'altezza fissa di 459 px, quindi la geometria
 * verticale tornava perfetta anche quando dentro restava una sola slide su tre
 * e il resto della striscia era vuoto. Misurare solo l'altezza non basta.
 *
 * Gli elementi vengono accoppiati per `tag.classi` e posizione fra i fratelli.
 * Quando la struttura dei due siti diverge di proposito (i menu, i pulsanti
 * diventati `<button>`) l'elemento compare solo da una parte e viene ignorato:
 * quello che conta e' che tutti gli elementi in comune stiano nello stesso
 * punto.
 */

const ROUTES = ['/', '/storia', '/gallery', '/contatti', '/prenotazioni']
const VPS = [1920, 768, 390]
const TOLLERANZA = 2

const FREEZE = `
  [data-aos] { opacity: 1 !important; transform: none !important; transition: none !important; }
  .preloader { display: none !important; }
  *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
`

const browser = await chromium.launch()

async function boxes(base, route, width) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 })
  await page.addStyleTag({ content: FREEZE })
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'))
  })
  await page
    .waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 60000 })
    .catch(() => {})
  await page.waitForTimeout(700)

  const data = await page.evaluate(() => {
    const out = []
    const seen = new Map()
    // classi che esistono solo da una parte: se entrassero nella chiave
    // sfalserebbero i progressivi e farebbero accoppiare elementi sbagliati.
    // `current-menu-item` e' l'evidenziazione della pagina corrente, aggiunta
    // dalla migrazione; le `aos-*` le mette AOS a runtime.
    const IGNORA = new Set(['current-menu-item', 'aos-init', 'aos-animate'])

    const walk = (el) => {
      const r = el.getBoundingClientRect()
      if (r.width > 0 && r.height > 0) {
        // chiave stabile: catena tag.classi dei genitori + progressivo
        const parts = []
        let n = el
        let depth = 0
        while (n && n !== document.body && depth < 6) {
          const cls = (n.className || '')
            .toString()
            .trim()
            .split(/\s+/)
            .filter((c) => c && !IGNORA.has(c))
            .sort()
            .join('.')
          parts.unshift(n.tagName.toLowerCase() + (cls ? '.' + cls : ''))
          n = n.parentElement
          depth++
        }
        const base = parts.join(' > ')
        const i = (seen.get(base) || 0) + 1
        seen.set(base, i)
        out.push({
          key: `${base}#${i}`,
          x: Math.round(r.left),
          y: Math.round(r.top + window.scrollY),
          w: Math.round(r.width),
          h: Math.round(r.height),
        })
      }
      for (const c of el.children) walk(c)
    }
    walk(document.body)
    return out
  })

  await ctx.close()
  return new Map(data.map((d) => [d.key, d]))
}

let totale = 0
let confrontati = 0
let diversi = 0

for (const route of ROUTES) {
  for (const width of VPS) {
    const a = await boxes('http://localhost:4320', route, width)
    const b = await boxes('http://localhost:4310', route, width)
    let n = 0
    const bad = []
    for (const [key, o] of a) {
      const v = b.get(key)
      if (!v) continue
      n++
      const dx = v.x - o.x
      const dy = v.y - o.y
      const dw = v.w - o.w
      const dh = v.h - o.h
      if (
        Math.abs(dx) > TOLLERANZA ||
        Math.abs(dy) > TOLLERANZA ||
        Math.abs(dw) > TOLLERANZA ||
        Math.abs(dh) > TOLLERANZA
      ) {
        bad.push(`    ${key.slice(-90)}  Δx ${dx} Δy ${dy} Δw ${dw} Δh ${dh}`)
      }
    }
    confrontati += n
    totale += a.size
    diversi += bad.length
    const esito = bad.length === 0 ? 'ok' : `${bad.length} fuori posto`
    console.log(`${route} @${width}px  ${n}/${a.size} elementi accoppiati  ->  ${esito}`)
    bad.slice(0, 12).forEach((l) => console.log(l))
    if (bad.length > 12) console.log(`    … e altri ${bad.length - 12}`)
  }
}

await browser.close()
console.log(
  `\n${confrontati} elementi confrontati su ${totale}, ${diversi} fuori posto oltre i ${TOLLERANZA} px`
)
process.exit(diversi === 0 ? 0 : 1)
