import { chromium } from 'playwright'
import { AxeBuilder } from '@axe-core/playwright'

const base = process.argv[2] || 'http://localhost:4310'
const ROUTES = ['/', '/storia', '/gallery', '/contatti', '/prenotazioni']
const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
let total = 0
for (const route of ROUTES) {
  const page = await context.newPage()
  await page.goto(base + route, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  const res = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze()
  console.log(`\n### ${route} — ${res.violations.length} problemi`)
  for (const v of res.violations) {
    total += v.nodes.length
    console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length}x)`)
    v.nodes.slice(0, 2).forEach((n) => console.log(`      ${n.target.join(' ')}`.slice(0, 160)))
  }
  await page.close()
}
await browser.close()
console.log(`\nTOTALE elementi con problemi: ${total}`)
