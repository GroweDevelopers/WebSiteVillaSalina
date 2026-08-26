import { chromium } from 'playwright'
import fs from 'node:fs'
const ROUTES = ['/', '/storia', '/gallery', '/contatti', '/prenotazioni']
const browser = await chromium.launch()
for (const [label, base] of [['old', 'http://localhost:4320'], ['new', 'http://localhost:4310']]) {
  const out = []
  for (const route of ROUTES) {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } })
    await page.goto(base + route, { waitUntil: 'load', timeout: 60000 })
    // testo dell'intera pagina, normalizzato: cattura la stringa finale che
    // l'utente legge, indipendentemente da come e' spezzata nel DOM
    const txt = await page.evaluate(() => {
      document.querySelectorAll('.preloader').forEach((e) => e.remove())
      return document.body.innerText.replace(/\s+/g, ' ').trim()
    })
    out.push(`##### ${route}`)
    // una frase per riga, cosi' il diff e' leggibile
    out.push(...txt.split(/(?<=[.!?:])\s+/))
    await page.close()
  }
  fs.writeFileSync(`t2-${label}.txt`, out.join('\n') + '\n', 'utf8')
}
await browser.close()
console.log('fatto')
