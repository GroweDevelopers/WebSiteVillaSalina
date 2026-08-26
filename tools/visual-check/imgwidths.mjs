import { chromium } from 'playwright'
const ROUTES = ['/', '/storia', '/gallery', '/contatti']
const VPS = [1920, 1440, 991, 768, 390]
const browser = await chromium.launch()
const rows = new Map()
for (const w of VPS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } })
  for (const route of ROUTES) {
    const page = await ctx.newPage()
    await page.goto('http://localhost:4320' + route, { waitUntil: 'networkidle', timeout: 60000 })
    await page.addStyleTag({ content: '[data-aos]{opacity:1!important;transform:none!important}.preloader{display:none!important}' })
    await page.waitForTimeout(400)
    const data = await page.evaluate(() => {
      const out = []
      document.querySelectorAll('img').forEach((im) => {
        const r = im.getBoundingClientRect()
        if (r.width < 5) return
        // percorso del contenitore, per riconoscere il componente
        const parent = im.parentElement
        out.push({ src: im.getAttribute('src').split('/').slice(-2).join('/'), w: Math.round(r.width), ctx: parent.className || parent.tagName })
      })
      return out
    })
    for (const d of data) {
      const key = `${d.ctx}|${d.src}`
      if (!rows.has(key)) rows.set(key, {})
      rows.get(key)[w] = Math.max(rows.get(key)[w] || 0, d.w)
    }
    await page.close()
  }
  await ctx.close()
}
await browser.close()
console.log('| contenitore | immagine | ' + VPS.map((v) => v + 'px').join(' | ') + ' |')
console.log('|---|---|' + VPS.map(() => '---:').join('|') + '|')
for (const [k, v] of [...rows.entries()].sort()) {
  const [ctx, src] = k.split('|')
  console.log(`| ${ctx.slice(0, 34)} | ${src} | ` + VPS.map((p) => {
    const px = v[p]
    return px ? `${px} (${Math.round((px / p) * 100)}vw)` : '—'
  }).join(' | ') + ' |')
}
