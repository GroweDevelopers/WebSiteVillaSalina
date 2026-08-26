import { chromium } from 'playwright'

/**
 * Confronta la risoluzione REALE dei pixel serviti sui due siti.
 *
 * Attenzione: `img.naturalWidth` non va bene. Quando l'immagine viene scelta da
 * un `srcset` con descrittori `w`, il browser la corregge per la densita'
 * effettiva, e restituisce un valore piu' piccolo di quello vero. Qui il file
 * scelto viene riscaricato e decodificato per leggerne le dimensioni reali.
 */
const ROUTES = ['/', '/storia', '/gallery', '/contatti']
const VPS = [1920, 1440, 991, 768, 390]
const browser = await chromium.launch()

async function collect(base) {
  const map = new Map()
  for (const w of VPS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 })
    for (const route of ROUTES) {
      const page = await ctx.newPage()
      await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 })
      await page.addStyleTag({ content: '[data-aos]{opacity:1!important;transform:none!important}.preloader{display:none!important}' })
      await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager')))
      await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 60000 }).catch(() => {})
      await page.waitForTimeout(600)
      const data = await page.evaluate(async () => {
        const out = []
        for (const im of document.images) {
          const shown = Math.round(im.getBoundingClientRect().width)
          const src = im.currentSrc || im.src
          if (shown < 20 || !src || /\.svg/.test(src)) continue
          let real = 0
          try {
            const bmp = await createImageBitmap(await (await fetch(src)).blob())
            real = bmp.width
            bmp.close()
          } catch {
            real = im.naturalWidth
          }
          const file = (decodeURIComponent(src).match(/\/assets\/images\/[^&?"]+/) || [src])[0]
          out.push({ file, shown, real })
        }
        return out
      })
      for (const d of data) {
        const key = `${w}|${route}|${d.file}|${d.shown}`
        const prev = map.get(key)
        if (!prev || d.real > prev.real) map.set(key, d)
      }
      await page.close()
    }
    await ctx.close()
  }
  return map
}

const oldMap = await collect('http://localhost:4320')
const newMap = await collect('http://localhost:4310')
await browser.close()

let worse = 0, same = 0, checked = 0
const report = []
for (const [key, o] of oldMap) {
  const n = newMap.get(key)
  if (!n) continue
  checked++
  // conta solo se il nuovo serve meno pixel del vecchio E meno di quanti ne mostra
  if (n.real < o.real - 2 && n.real < o.shown - 2) {
    worse++
    report.push(`  ${key.split('|').slice(0, 3).join(' ')}  mostrata ${o.shown}px | vecchio ${o.real}px -> nuovo ${n.real}px`)
  } else same++
}
report.sort()
report.forEach((r) => console.log(r))
console.log(`\n${checked} confronti: ${worse} con meno pixel, ${same} uguali o migliori`)
