import { chromium } from 'playwright'
const ROUTES = ['/', '/storia', '/gallery', '/contatti']
const browser = await chromium.launch()
const rows = {}
for (const [label, base] of [['vecchio', 'http://localhost:4320'], ['nuovo', 'http://localhost:4310']]) {
  for (const route of ROUTES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await ctx.newPage()
    let bytes = 0, reqs = 0, js = 0, css = 0, img = 0, fonts = 0
    page.on('response', async (r) => {
      reqs++
      try {
        const b = await r.body()
        bytes += b.length
        const t = r.request().resourceType()
        if (t === 'script') js += b.length
        else if (t === 'stylesheet') css += b.length
        else if (t === 'image') img += b.length
        else if (t === 'font') fonts += b.length
      } catch {}
    })
    await page.goto(base + route, { waitUntil: 'networkidle', timeout: 90000 })
    await page.waitForTimeout(1500)
    rows[`${route}|${label}`] = { reqs, bytes, js, css, img, fonts }
    await ctx.close()
  }
}
await browser.close()
const mb = (n) => (n / 1048576).toFixed(2)
const kb = (n) => Math.round(n / 1024)
console.log('| rotta | | richieste | totale | JS | CSS | immagini | font |')
console.log('|---|---|---:|---:|---:|---:|---:|---:|')
for (const route of ROUTES)
  for (const label of ['vecchio', 'nuovo']) {
    const r = rows[`${route}|${label}`]
    console.log(`| ${label === 'vecchio' ? route : ''} | ${label} | ${r.reqs} | ${mb(r.bytes)} MB | ${kb(r.js)} KB | ${kb(r.css)} KB | ${mb(r.img)} MB | ${kb(r.fonts)} KB |`)
  }
