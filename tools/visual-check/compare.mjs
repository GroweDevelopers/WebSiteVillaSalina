import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const OUT = process.argv[2] || './shots'
const OLD = 'http://localhost:4320'
const NEW = 'http://localhost:4310'

const ROUTES = ['/', '/storia', '/gallery', '/contatti', '/prenotazioni']
const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]

// Congela animazioni e preloader per avere screenshot confrontabili.
const FREEZE = `
  [data-aos] { opacity: 1 !important; transform: none !important; transition: none !important; }
  .preloader { display: none !important; }
  *, *::before, *::after {
    animation-duration: 0s !important; animation-delay: 0s !important;
    transition-duration: 0s !important; transition-delay: 0s !important;
  }
  iframe { visibility: hidden !important; }

`

fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const report = []

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    const slug = (route === '/' ? 'home' : route.slice(1)) + '-' + vp.name
    for (const [label, base] of [
      ['old', OLD],
      ['new', NEW],
    ]) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } })
      const missing = []
      page.on('response', (r) => {
        if (r.status() >= 400) missing.push(`${r.status()} ${r.url().replace(base, '')}`)
      })
      await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 })
      await page.addStyleTag({ content: FREEZE })
      // il caricamento in differita non scatta mai per le immagini che restano
      // fuori dallo screenshot: qui vanno caricate tutte
      await page.evaluate(() => {
        document.querySelectorAll('img[loading="lazy"]').forEach((i) => {
          i.loading = 'eager'
        })
      })
      // porta ogni carosello alla prima slide reale, cosi' i due siti mostrano
      // le stesse immagini nonostante versioni diverse di Swiper
      await page.evaluate(() => {
        document.querySelectorAll('.swiper').forEach((el) => {
          const sw = el.swiper
          if (!sw) return
          if (sw.autoplay && sw.autoplay.stop) sw.autoplay.stop()
          if (sw.params && sw.params.loop && sw.slideToLoop) sw.slideToLoop(0, 0)
          else if (sw.slideTo) sw.slideTo(0, 0)
        })
      })
      await page.waitForTimeout(300)
      // porta a fondo pagina e torna su, per far montare tutto il lazy loading
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let y = 0
          const step = () => {
            y += window.innerHeight
            window.scrollTo(0, y)
            if (y < document.body.scrollHeight) setTimeout(step, 120)
            else {
              window.scrollTo(0, 0)
              setTimeout(resolve, 300)
            }
          }
          step()
        })
      })
      // attende che ogni immagine sia effettivamente decodificata: con
      // loading="lazy" lo screenshot a pagina intera puo' catturare buchi
      await page.waitForFunction(
        () => [...document.images].every((i) => i.complete && i.naturalWidth > 0),
        null,
        { timeout: 60000 }
      ).catch(() => {})
      await page.waitForTimeout(800)
      const file = path.join(OUT, `${slug}-${label}.png`)
      await page.screenshot({ path: file, fullPage: true })
      const height = await page.evaluate(() => document.body.scrollHeight)
      report.push({ route, viewport: vp.name, label, height, missing })
      await page.close()
    }
  }
}

await browser.close()

console.log('| rotta | viewport | altezza vecchio | altezza nuovo | scarto |')
console.log('|---|---|---:|---:|---:|')
for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    const o = report.find((r) => r.route === route && r.viewport === vp.name && r.label === 'old')
    const n = report.find((r) => r.route === route && r.viewport === vp.name && r.label === 'new')
    const delta = n.height - o.height
    const pct = ((delta / o.height) * 100).toFixed(1)
    console.log(`| ${route} | ${vp.name} | ${o.height} | ${n.height} | ${delta > 0 ? '+' : ''}${delta} (${pct}%) |`)
  }
}

console.log('\n## Risorse non trovate (404)\n')
let any = false
for (const r of report) {
  if (r.missing.length) {
    any = true
    console.log(`- ${r.label} ${r.route} @${r.viewport}: ${[...new Set(r.missing)].join(', ')}`)
  }
}
if (!any) console.log('nessuna')
