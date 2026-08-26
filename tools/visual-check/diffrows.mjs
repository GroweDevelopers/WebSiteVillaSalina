import fs from 'node:fs'
import { PNG } from 'pngjs'

const [a, b] = process.argv.slice(2)
const A = PNG.sync.read(fs.readFileSync(a))
const B = PNG.sync.read(fs.readFileSync(b))
const w = Math.min(A.width, B.width)
const h = Math.min(A.height, B.height)
console.log(`A ${A.width}x${A.height}   B ${B.width}x${B.height}`)

// percentuale di pixel diversi per riga
const rows = []
for (let y = 0; y < h; y++) {
  let diff = 0
  for (let x = 0; x < w; x++) {
    const ia = (A.width * y + x) << 2
    const ib = (B.width * y + x) << 2
    if (
      Math.abs(A.data[ia] - B.data[ib]) > 12 ||
      Math.abs(A.data[ia + 1] - B.data[ib + 1]) > 12 ||
      Math.abs(A.data[ia + 2] - B.data[ib + 2]) > 12
    ) diff++
  }
  rows.push(diff / w)
}
// raggruppa in fasce contigue di righe con >2% di pixel diversi
let start = -1
const bands = []
rows.forEach((r, y) => {
  if (r > 0.02 && start < 0) start = y
  if (r <= 0.02 && start >= 0) { bands.push([start, y - 1]); start = -1 }
})
if (start >= 0) bands.push([start, h - 1])
const merged = []
for (const [s, e] of bands) {
  const last = merged[merged.length - 1]
  if (last && s - last[1] < 40) last[1] = e
  else merged.push([s, e])
}
console.log('fasce che differiscono (y_start - y_end, altezza):')
for (const [s, e] of merged) console.log(`  ${s} - ${e}   (${e - s + 1}px)`)
if (!merged.length) console.log('  nessuna')
