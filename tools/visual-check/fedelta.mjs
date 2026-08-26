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
    function disegna(source, w, h) {
      const c = new OffscreenCanvas(w, h)
      const g = c.getContext('2d')
      g.drawImage(source, 0, 0, w, h)
      return g.getImageData(0, 0, w, h).data
    }

    /**
     * Risale al file sorgente dall'URL servito.
     *
     * Dal nome del WebP l'estensione dell'originale non si ricava
     * (cotolette-570.webp puo' venire da .png o da .jpg): si prova quale
     * delle tre risponde. Il server di verifica espone gli originali sotto
     * /__originali/, perche' l'export non li contiene piu'.
     */
    async function sorgenteDi(src) {
      const d = decodeURIComponent(src)
      const diretto = d.match(/\/assets\/images\/(.+)$/)
      if (diretto) return { rel: diretto[1], originale: '/assets/images/' + diretto[1] }

      const opt = d.match(/\/assets\/optimized\/(.+)-\d+\.webp$/)
      if (!opt) return null
      for (const ext of ['.png', '.jpg', '.jpeg']) {
        const rel = opt[1] + ext
        for (const radice of ['/__originali/', '/assets/images/']) {
          const r = await fetch(radice + rel, { method: 'HEAD' })
          if (r.ok) return { rel, originale: radice + rel }
        }
      }
      return null
    }

    const res = []
    for (const im of document.images) {
      const src = im.currentSrc || ''
      if (!src || /\.svg/.test(src)) continue
      const s = await sorgenteDi(src)
      if (!s) continue
      const bmp = await createImageBitmap(await (await fetch(s.originale)).blob())
      const w = bmp.width
      const h = bmp.height
      const a = disegna(bmp, w, h)
      const b = disegna(im, w, h)
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
        file: s.rel,
        mostrata: Math.round(im.getBoundingClientRect().width),
        psnr: +psnr.toFixed(1),
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
