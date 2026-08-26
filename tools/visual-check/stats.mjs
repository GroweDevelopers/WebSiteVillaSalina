import fs from 'node:fs'
import { PNG } from 'pngjs'
const [a, b, x0, y0, w, h] = process.argv.slice(2)
const A = PNG.sync.read(fs.readFileSync(a))
const B = PNG.sync.read(fs.readFileSync(b))
let sum = 0, max = 0, n = 0, over30 = 0
for (let y = +y0; y < +y0 + +h; y++)
  for (let x = +x0; x < +x0 + +w; x++) {
    const ia = (A.width*y+x)<<2, ib = (B.width*y+x)<<2
    for (let k = 0; k < 3; k++) {
      const d = Math.abs(A.data[ia+k]-B.data[ib+k]); sum += d; n++
      if (d > max) max = d
      if (d > 30) over30++
    }
  }
console.log(`  scarto medio ${(sum/n).toFixed(2)} / 255   massimo ${max}   canali oltre 30: ${((over30/n)*100).toFixed(3)}%`)
