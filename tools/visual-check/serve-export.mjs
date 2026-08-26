/**
 * Serve la cartella `out/` imitando GitHub Pages.
 *
 * Serve per verificare l'export con gli stessi controlli usati sul sito
 * dinamico: se un file manca o un percorso e' sbagliato, qui si vede subito
 * invece che online.
 *
 * Regole riprodotte da Pages:
 *  - una directory viene servita con il suo `index.html`
 *  - un percorso senza estensione prova anche `<percorso>.html`
 *  - un percorso senza slash finale che corrisponde a una directory redirige
 *    con lo slash, come fa Pages
 *  - qualsiasi altro miss risponde 404 con il contenuto di `404.html`
 *
 *   node tools/visual-check/serve-export.mjs [porta]
 */

import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const QUI = path.dirname(fileURLToPath(import.meta.url))
const RADICE = path.resolve(QUI, '../../out')
const PORTA = Number(process.argv[2] || 4311)

/**
 * Gli originali non fanno parte dell'export: `scripts/prune-export.mjs` li
 * toglie perche' il browser non li chiede mai. I controlli di fedelta' pero'
 * hanno bisogno di confrontarci i file serviti, e da un'altra origine non
 * possono (la canvas si "sporca"). Vengono percio' esposti qui sotto un
 * percorso che il sito vero non usa.
 */
const ORIGINALI = path.resolve(QUI, '../../public/assets/images')
const PREFISSO_ORIGINALI = '/__originali/'

/**
 * Sottocartella da simulare, la stessa passata alla build. Con
 * NEXT_PUBLIC_BASE_PATH=/WebSiteVillaSalina il sito risponde solo sotto quel
 * percorso, esattamente come sull'indirizzo di anteprima di Pages.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const TIPI = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.map': 'application/json; charset=utf-8',
}

async function tipo(p) {
  return TIPI[path.extname(p).toLowerCase()] || 'application/octet-stream'
}

async function stat(p) {
  try {
    return await fs.stat(p)
  } catch {
    return null
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORTA}`)
  let richiesto = decodeURIComponent(url.pathname)

  if (BASE_PATH) {
    if (richiesto === BASE_PATH) {
      res.writeHead(301, { Location: BASE_PATH + '/' }).end()
      return
    }
    if (richiesto.startsWith(BASE_PATH + '/')) {
      richiesto = richiesto.slice(BASE_PATH.length)
    } else if (!richiesto.startsWith(PREFISSO_ORIGINALI)) {
      res.writeHead(404, { 'Content-Type': TIPI['.html'] }).end('fuori dalla sottocartella ' + BASE_PATH)
      return
    }
  }

  if (richiesto.startsWith(PREFISSO_ORIGINALI)) {
    const p = path.normalize(path.join(ORIGINALI, richiesto.slice(PREFISSO_ORIGINALI.length)))
    if (p.startsWith(ORIGINALI) && (await stat(p))?.isFile()) {
      res.writeHead(200, { 'Content-Type': await tipo(p) }).end(await fs.readFile(p))
    } else {
      res.writeHead(404).end('404')
    }
    return
  }

  const dentro = path.normalize(path.join(RADICE, richiesto))

  // niente traversal fuori da out/
  if (!dentro.startsWith(RADICE)) {
    res.writeHead(403).end('403')
    return
  }

  const s = await stat(dentro)

  if (s?.isDirectory()) {
    if (!richiesto.endsWith('/')) {
      res.writeHead(301, { Location: BASE_PATH + richiesto + '/' }).end()
      return
    }
    const indice = path.join(dentro, 'index.html')
    if (await stat(indice)) {
      res.writeHead(200, { 'Content-Type': TIPI['.html'] }).end(await fs.readFile(indice))
      return
    }
  } else if (s?.isFile()) {
    res.writeHead(200, { 'Content-Type': await tipo(dentro) }).end(await fs.readFile(dentro))
    return
  } else if (!path.extname(dentro)) {
    // Pages aggiunge .html implicitamente
    const conHtml = dentro + '.html'
    if (await stat(conHtml)) {
      res.writeHead(200, { 'Content-Type': TIPI['.html'] }).end(await fs.readFile(conHtml))
      return
    }
  }

  const pagina404 = path.join(RADICE, '404.html')
  const corpo = (await stat(pagina404)) ? await fs.readFile(pagina404) : 'Not Found'
  res.writeHead(404, { 'Content-Type': TIPI['.html'] }).end(corpo)
})

server.listen(PORTA, () => {
  console.log(`export servito da ${RADICE}\nhttp://localhost:${PORTA}`)
})
