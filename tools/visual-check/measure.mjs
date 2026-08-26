import { chromium } from 'playwright'

const OLD = 'http://localhost:4320'
const NEW = 'http://localhost:4310'
const route = process.argv[2] || '/'
const width = +(process.argv[3] || 1920)

const FREEZE = `
  [data-aos] { opacity: 1 !important; transform: none !important; transition: none !important; }
  .preloader { display: none !important; }
  *, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }
`

// Selettori delle sezioni principali, nell'ordine in cui compaiono.
const SELECTORS = [
  '.top-bar',
  '#header_main',
  '.mySwiper',
  '.page-title',
  '.chef-restaurant',
  '.list-img',
  '.about-restaurant',
  '.s-chef',
  '.s-couter',
  '.event',
  '.testimonials',
  '.testimonials .col-md-6',
  '.testimonials-main',
  '.testimonials-img',
  '.testimonials-img img',
  '.testimonials-content',
  '.history',
  '.portfolio-mansonry',
  '.location',
  '.gallery-ig',
  '.s-formmail',
  'footer',
]

async function measure(base) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } })
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 })
  await page.addStyleTag({ content: FREEZE })
  await page.waitForTimeout(400)
  const data = await page.evaluate((sels) => {
    const out = []
    for (const sel of sels) {
      document.querySelectorAll(sel).forEach((el, i) => {
        const r = el.getBoundingClientRect()
        out.push({
          key: sel + (i ? `[${i}]` : ''),
          top: Math.round(r.top + window.scrollY),
          height: Math.round(r.height),
        })
      })
    }
    return { items: out, bodyHeight: document.body.scrollHeight }
  }, SELECTORS)
  await page.close()
  return data
}

const browser = await chromium.launch()
const o = await measure(OLD)
const n = await measure(NEW)
await browser.close()

console.log(`\n## ${route} @ ${width}px\n`)
console.log('| sezione | top vecchio | top nuovo | Δtop | h vecchio | h nuovo | Δh |')
console.log('|---|---:|---:|---:|---:|---:|---:|')
const keys = [...new Set([...o.items.map((i) => i.key), ...n.items.map((i) => i.key)])]
for (const k of keys) {
  const a = o.items.find((i) => i.key === k)
  const b = n.items.find((i) => i.key === k)
  if (!a || !b) {
    console.log(`| ${k} | ${a ? a.top : '—'} | ${b ? b.top : '—'} | **solo in ${a ? 'vecchio' : 'nuovo'}** | | | |`)
    continue
  }
  const dt = b.top - a.top
  const dh = b.height - a.height
  const mark = dh === 0 ? '' : ' **'
  console.log(`| ${k} | ${a.top} | ${b.top} | ${dt} | ${a.height} | ${b.height} | ${dh}${mark} |`)
}
console.log(`| **body** | | | | ${o.bodyHeight} | ${n.bodyHeight} | ${n.bodyHeight - o.bodyHeight} |`)
