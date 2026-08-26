# Pubblicazione su GitHub Pages

Il sito è un **export statico**: nessun server applicativo, solo file. Il workflow
[`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) lo costruisce a ogni push su
`main` e lo pubblica su GitHub Pages.

Dominio: **www.villa-salina.com**, con `villa-salina.com` che redirige al `www`.

---

## Da fare una volta sola

### 1. Il repository deve poter usare Pages

`GroweDevelopers/WebSiteVillaSalina` è **privato**. GitHub Pages da repository privato è
disponibile solo sui piani **Team ed Enterprise**: sul piano gratuito il deploy fallisce.

Due strade:

- il piano dell'organizzazione è Team o superiore → si procede;
- altrimenti il repository va reso **pubblico** (Settings → General → Change repository
  visibility). Nel codice non ci sono credenziali né dati riservati, quindi renderlo pubblico non
  espone nulla.

### 2. Attivare Pages con GitHub Actions come sorgente

Settings → **Pages** → _Build and deployment_ → **Source: GitHub Actions**.

Non serve scegliere branch o cartella: se la sorgente è impostata su un branch, il workflow non
viene usato e il sito resta vuoto.

### 3. Lanciare il primo deploy

Basta una push su `main`, oppure Actions → _Pubblica su GitHub Pages_ → **Run workflow**.

Al termine, il sito è già raggiungibile sull'indirizzo provvisorio
`https://growedevelopers.github.io/WebSiteVillaSalina/` — che però mostrerà il sito **senza CSS
né immagini**, perché tutti i percorsi sono assoluti (`/assets/...`) e lì il sito vive in una
sottocartella. **È normale e si risolve da sé appena il dominio è attivo.** Se serve verificare
prima di puntare il DNS, si può usare l'anteprima locale (vedi in fondo).

### 4. I record DNS

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

### 5. Impostare il dominio su GitHub

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
| il deploy fallisce con "Pages is not enabled"         | manca il passo 2, o il repository è privato su piano gratuito                                                                           |
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
