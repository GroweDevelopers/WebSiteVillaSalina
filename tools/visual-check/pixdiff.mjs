import fs from 'node:fs'
import path from 'node:path'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'

const dir = process.argv[2]
const files = fs.readdirSync(dir).filter((f) => f.endsWith('-old.png'))
console.log('| pagina | pixel diversi | % |')
console.log('|---|---:|---:|')
let worst = []
for (const f of files.sort()) {
  const a = PNG.sync.read(fs.readFileSync(path.join(dir, f)))
  const b = PNG.sync.read(fs.readFileSync(path.join(dir, f.replace('-old', '-new'))))
  if (a.width !== b.width || a.height !== b.height) {
    console.log(`| ${f.replace('-old.png','')} | dimensioni diverse ${a.width}x${a.height} vs ${b.width}x${b.height} | |`)
    continue
  }
  const out = new PNG({ width: a.width, height: a.height })
  const n = pixelmatch(a.data, b.data, out.data, a.width, a.height, { threshold: 0.12 })
  const pct = (n / (a.width * a.height)) * 100
  console.log(`| ${f.replace('-old.png','')} | ${n} | ${pct.toFixed(3)}% |`)
  if (pct > 0.05) {
    fs.writeFileSync(path.join(dir, f.replace('-old.png', '-diff.png')), PNG.sync.write(out))
    worst.push([f.replace('-old.png',''), pct])
  }
}
if (worst.length) {
  console.log('\nDiff salvati per:', worst.map(([n,p]) => `${n} (${p.toFixed(2)}%)`).join(', '))
}
