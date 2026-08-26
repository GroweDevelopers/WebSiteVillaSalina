import { chromium } from 'playwright'

/**
 * Misura la fedelta' dell'immagine che il browser mostra davvero.
 *
 * Va letta dall'elemento <img> gia' caricato, non con una fetch: una fetch
 * manda `Accept: * / *` e riceve un formato diverso da quello che il browser
 * negozia per le immagini. Il primo tentativo misurava la cosa sbagliata.
 */
const ROUTES = ['/', '/gallery', '/storia']
const W = 1920
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: W, height: 1000 } })

const righe = []
for (const route of ROUTES) {
  const page = await ctx.newPage()
  await page.goto('http://localhost:4310' + route, { waitUntil: 'networkidle', timeout: 90000 })
  await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager')))
  await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 60000 }).catch(() => {})
  await page.waitForTimeout(800)

  const out = await page.evaluate(async () => {
    function draw(source, w, h) {
      const c = new OffscreenCanvas(w, h)
      const g = c.getContext('2d')
      g.drawImage(source, 0, 0, w, h)
      return g.getImageData(0, 0, w, h).data
    }
    const res = []
    for (const im of document.images) {
      const src = decodeURIComponent(im.currentSrc || '')
      const m = src.match(/\/assets\/images\/[^&?"]+/)
      if (!m || /\.svg/.test(m[0])) continue
      const originale = m[0]
      // l'immagine originale, non ottimizzata, servita dalla stessa origine
      const bmp = await createImageBitmap(await (await fetch(originale)).blob())
      const w = im.naturalWidth ? Math.min(bmp.width, 4000) : bmp.width
      const h = Math.round((w / bmp.width) * bmp.height)
      const a = draw(bmp, w, h)
      const b = draw(im, w, h)
      bmp.close()
      let se = 0
      for (let i = 0; i < a.length; i += 4)
        for (let k = 0; k < 3; k++) {
          const d = a[i + k] - b[i + k]
          se += d * d
        }
      const mse = se / ((a.length / 4) * 3)
      const psnr = mse === 0 ? 999 : 10 * Math.log10((255 * 255) / mse)
      res.push({
        file: originale.split('/').slice(-2).join('/'),
        mostrata: Math.round(im.getBoundingClientRect().width),
        psnr: +psnr.toFixed(1),
        ottimizzata: src.includes('/_next/image'),
      })
    }
    return res
  })
  righe.push(...out.map((o) => ({ ...o, route })))
  await page.close()
}
await browser.close()

const visti = new Map()
for (const r of righe) if (!visti.has(r.file) || visti.get(r.file).psnr > r.psnr) visti.set(r.file, r)
const ordinate = [...visti.values()].sort((a, b) => a.psnr - b.psnr)
console.log('\nPSNR fra l originale lossless e quello che il browser mostra')
console.log('  >45 dB indistinguibile · 40-45 ottimo · 35-40 visibile da vicino · <35 evidente\n')
console.log('  PSNR   mostrata  immagine')
for (const r of ordinate) {
  const flag = r.psnr < 40 ? '  <-- ' : ''
  console.log(`  ${String(r.psnr).padStart(5)}   ${String(r.mostrata).padStart(5)}px   ${r.file}${flag}`)
}
const sotto = ordinate.filter((r) => r.psnr < 40).length
console.log(`\n${ordinate.length} immagini, ${sotto} sotto i 40 dB`)
