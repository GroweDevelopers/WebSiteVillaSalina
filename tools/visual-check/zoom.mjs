import { chromium } from 'playwright'
const src = process.argv[2]
const w = +process.argv[3]
const out = process.argv[4]
const zx = +(process.argv[5] || 230)
const zy = +(process.argv[6] || 110)
const QS = (process.argv[7] || '82,88,95,100').split(',')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 460 * (QS.length + 1) + 40, height: 540 } })
await page.goto('http://localhost:4310/', { waitUntil: 'domcontentloaded' })
const varianti = await page.evaluate(
  async ({ src, w, qs }) => {
    const WEBP = { Accept: 'image/webp,image/apng,*/*' }
    const lista = [['originale PNG', src, undefined], ...qs.map((q) => [`webp q${q}`, `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=${q}`, WEBP])]
    const out = []
    for (const [nome, url, headers] of lista) {
      const r = await fetch(url, headers ? { headers } : undefined)
      const blob = await r.blob()
      const dataUrl = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob) })
      out.push({ nome, dataUrl, kb: Math.round(blob.size / 1024) })
    }
    return out
  },
  { src, w, qs: QS }
)
varianti.forEach((v) => console.log(`  ${v.nome.padEnd(14)} ${v.kb}KB`))
const html = `<body style="margin:0;background:#111;font:13px sans-serif;color:#fff;white-space:nowrap">
${varianti.map((v) => `<div style="display:inline-block;margin:4px;text-align:center;vertical-align:top">
  <div style="padding:5px">${v.nome} — ${v.kb}KB</div>
  <div style="width:440px;height:440px;overflow:hidden;position:relative;border:1px solid #444">
    <img src="${v.dataUrl}" style="position:absolute;left:0;top:0;transform:scale(4) translate(${-zx}px,${-zy}px);transform-origin:0 0;image-rendering:pixelated">
  </div></div>`).join('')}</body>`
await page.setContent(html)
await page.waitForTimeout(1500)
await page.screenshot({ path: out })
await browser.close()
