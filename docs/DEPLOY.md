# Pubblicazione su GitHub Pages

Il sito è un **export statico**: nessun server applicativo, solo file. Il workflow
[`.github/workflows/pages.yml`](../.github/workflows/pages.yml) lo costruisce e lo pubblica.

## Stato attuale — anteprima online

> **https://growedevelopers.github.io/WebSiteVillaSalina/**

Il repository è pubblico, Pages è attivo con sorgente _GitHub Actions_, e il sito è pubblicato e
verificato: tutte le rotte rispondono, nessuna immagine rotta, CSS e font applicati, navigazione
lato client funzionante.

Poiché su quell'indirizzo il sito vive in una **sottocartella**, la build usa due variabili
d'ambiente, dichiarate in cima al workflow:

```yaml
env:
  NEXT_PUBLIC_BASE_PATH: /WebSiteVillaSalina
  NEXT_PUBLIC_SITE_URL: https://growedevelopers.github.io/WebSiteVillaSalina
```

`basePath` di Next non copre tutto: gli `url()` dell'SCSS, i `src` degli `<img>` semplici, il
preload dei font e l'URL che restituisce il loader delle immagini passano da
[`src/lib/basePath.ts`](../src/lib/basePath.ts) e da un partial SCSS generato. Vedi
[`scripts/write-scss-base-path.mjs`](../scripts/write-scss-base-path.mjs).

## Passare al dominio www.villa-salina.com

Tre cose, nell'ordine:

### 1. Svuotare le due variabili nel workflow

```yaml
env:
  NEXT_PUBLIC_BASE_PATH: ''
  NEXT_PUBLIC_SITE_URL: https://www.villa-salina.com
```

Con la sottocartella vuota, `public/CNAME` rientra da solo nell'export e i percorsi tornano
assoluti dalla radice. Il workflow controlla entrambe le cose e fallisce se non tornano.

### 2. I record DNS

Dal pannello di chi gestisce `villa-salina.com`:

**Per il `www`** — un record CNAME:

| Tipo  | Nome  | Valore                       |
| ----- | ----- | ---------------------------- |
| CNAME | `www` | `growedevelopers.github.io.` |

**Per il dominio nudo** (`villa-salina.com`) — quattro record A, gli IP di GitHub Pages:

| Tipo | Nome | Valore            |
| ---- | ---- | ----------------- |
| A    | `@`  | `185.199.108.153` |
| A    | `@`  | `185.199.109.153` |
| A    | `@`  | `185.199.110.153` |
| A    | `@`  | `185.199.111.153` |

Se il provider supporta ALIAS o ANAME sull'apex, si può usare quello verso
`growedevelopers.github.io` al posto dei quattro A: è preferibile, perché se GitHub cambia IP non
c'è nulla da aggiornare.

Chi ha IPv6 può aggiungere anche i record AAAA:
`2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.

### 3. Impostare il dominio su GitHub

Settings → Pages → **Custom domain** → `www.villa-salina.com` → Save.

Il file [`public/CNAME`](../public/CNAME) contiene già lo stesso dominio, e finisce nell'export a
ogni build: senza, GitHub azzererebbe il dominio personalizzato a ogni deploy.

Appena la verifica DNS passa, spuntare **Enforce HTTPS**. Il certificato lo emette GitHub da sé,
di solito entro un'ora.

Con il CNAME sul `www` e i record A sull'apex, GitHub redirige da solo `villa-salina.com` a
`www.villa-salina.com`.

---

## Tempi realistici

|                             | quanto                                     |
| --------------------------- | ------------------------------------------ |
| build e deploy del workflow | 2 – 4 minuti                               |
| propagazione DNS            | da pochi minuti a 24 ore, secondo il TTL   |
| certificato HTTPS           | fino a un'ora dopo la verifica del dominio |

## Se qualcosa non torna

| sintomo                                               | causa quasi certa                                                                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| pagina bianca, in console 404 su `/_next/...`         | manca `.nojekyll`: Pages ignora le cartelle che iniziano con `_`. Il file è in `public/`, quindi controllare che sia arrivato in `out/` |
| il sito appare senza stili sull'indirizzo `github.io` | normale: i percorsi sono assoluti e lì il sito è in una sottocartella. Si risolve col dominio                                           |
| `404` su `/storia`                                    | l'export usa `/storia/`. GitHub Pages redirige da sé; se non lo fa, controllare `trailingSlash: true` in `next.config.ts`               |
| il dominio personalizzato si azzera dopo un deploy    | il file `CNAME` non è arrivato nell'export                                                                                              |
| il deploy fallisce con "Pages is not enabled"         | Settings → Pages → Source deve essere _GitHub Actions_                                                                                  |
| una push su `main` non lancia il deploy               | è successo: lanciarlo a mano da Actions → _Pubblica su GitHub Pages_ → **Run workflow**. Vedi la nota qui sotto                         |
| immagini rotte                                        | la potatura ha tolto un file richiesto. `npm run prune -- --dry` lo elenca; il workflow fallisce già da sé in quel caso                 |

## Anteprima locale, identica a Pages

```bash
npm run build
node tools/visual-check/serve-export.mjs 4310
# http://localhost:4310
```

Il server imita Pages: `index.html` per le cartelle, `.html` implicito, redirect con lo slash
finale, `404.html` sui percorsi inesistenti. È lo stesso su cui è stata verificata la parità con
il sito ASP.NET.

## Cosa fa la build

```
npm run build
  ├── optimize-images.mjs    genera i WebP e il manifest
  ├── next build             export statico in out/
  ├── flatten-rsc-paths.mjs  affianca i payload col nome che il browser chiede
  └── prune-export.mjs       toglie gli asset che nessuno scarica (29 MB → 13 MB)
```

`prune-export.mjs` fallisce, e con esso il deploy, se un file richiesto manca dall'export: è la
rete di sicurezza contro le immagini rotte.

## Se un domani si volesse tornare a un host con Node

Vercel, Netlify o un container fanno girare l'ottimizzatore di immagini di Next, che riconverte
tutto su richiesta. In quel caso, in `next.config.ts`:

- togliere `output: 'export'` e `trailingSlash: true`;
- sostituire il loader custom con `formats: ['image/webp']` e `qualities: [95]`;
- rimettere `quality={IMAGE_QUALITY}` sui componenti `<Image>`.

Lo script di conversione e la potatura diventano inutili ma non danno fastidio.

## Nota: la push su `main` non lancia il deploy

Durante la messa online si è visto che le push su `main` **non creano nessun run**, pur arrivando
al remoto (verificato con `git ls-remote` e con l'API). Il workflow ha `on: push: branches: [main]`
corretto ed è in stato _active_; la primissima push l'aveva innescato regolarmente, poi non più.

Provato senza successo: commit vuoto, commit con modifiche reali, e rinominare il file del
workflow da `deploy.yml` a `pages.yml` (che di solito reimposta i trigger). La causa non è stata
trovata.

**Il lancio a mano funziona sempre**, e va fatto dopo ogni push che debba andare online:

**Actions → Pubblica su GitHub Pages → Run workflow → main**

oppure da riga di comando, con un token che abbia scope `workflow`:

```bash
curl -X POST -H "Authorization: Bearer $TOKEN"   -H "Accept: application/vnd.github+json"   https://api.github.com/repos/GroweDevelopers/WebSiteVillaSalina/actions/workflows/343064599/dispatches   -d '{"ref":"main"}'
```

Se in futuro dà noia, vale la pena aprire una segnalazione al supporto GitHub: dall'esterno il
workflow è configurato correttamente.
