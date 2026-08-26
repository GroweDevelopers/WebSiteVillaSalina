import fs from 'node:fs'
import { PNG } from 'pngjs'
const [a, b, out] = process.argv.slice(2)
const A = PNG.sync.read(fs.readFileSync(a))
const B = PNG.sync.read(fs.readFileSync(b))
const gap = 20
const W = A.width + gap + B.width
const H = Math.max(A.height, B.height)
const D = new PNG({ width: W, height: H })
D.data.fill(255)
const put = (S, ox) => {
  for (let y = 0; y < S.height; y++)
    for (let x = 0; x < S.width; x++) {
      const i = (S.width * y + x) << 2
      const j = (W * y + (x + ox)) << 2
      D.data[j] = S.data[i]; D.data[j+1] = S.data[i+1]; D.data[j+2] = S.data[i+2]; D.data[j+3] = 255
    }
}
put(A, 0); put(B, A.width + gap)
fs.writeFileSync(out, PNG.sync.write(D))
