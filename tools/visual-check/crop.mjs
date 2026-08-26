import fs from 'node:fs'
import { PNG } from 'pngjs'
const [src, out, ys, hs, xs, ws] = process.argv.slice(2)
const y0 = +ys, hh = +hs, x0 = xs ? +xs : 0
const S = PNG.sync.read(fs.readFileSync(src))
const w = ws ? +ws : S.width - x0
const h = Math.min(hh, S.height - y0)
const D = new PNG({ width: w, height: h })
for (let y = 0; y < h; y++)
  for (let x = 0; x < w; x++) {
    const i = (S.width * (y + y0) + (x + x0)) << 2
    const j = (w * y + x) << 2
    D.data[j] = S.data[i]; D.data[j+1] = S.data[i+1]; D.data[j+2] = S.data[i+2]; D.data[j+3] = S.data[i+3]
  }
fs.writeFileSync(out, PNG.sync.write(D))
