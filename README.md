# Villa Salina — sito web

Sito del ristorante **Villa Salina**, Moretta (CN). Next.js 16 con App Router e TypeScript.

Riscrittura del precedente sito ASP.NET Core MVC, con lo stesso identico aspetto: la parità è
verificata automaticamente, pagina per pagina e viewport per viewport
(vedi [`docs/VERIFICA-PARITA.md`](docs/VERIFICA-PARITA.md)).

|                           | prima (ASP.NET) | dopo (Next.js) |
| ------------------------- | --------------: | -------------: |
| peso della home           |         6,36 MB |    **2,93 MB** |
| peso della gallery        |        10,25 MB |    **3,03 MB** |
| problemi di accessibilità |              95 |         **29** |
| repository                |           89 MB |      **17 MB** |
| jQuery e plugin           |          1,3 MB |          **0** |

---

## Avvio

```bash
npm install
npm run dev          # http://localhost:3000
```

Serve **Node 20.9 o superiore**.

## Comandi

| comando             | cosa fa                                      |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | server di sviluppo                           |
| `npm run build`     | build di produzione                          |
| `npm run start`     | serve la build                               |
| `npm run lint`      | ESLint                                       |
| `npm run typecheck` | `tsc --noEmit`                               |
| `npm run format`    | Prettier                                     |
| `npm run check`     | lint + typecheck + build, in sequenza        |
| `npm run images`    | converte le foto in WebP (lo fa già `build`) |
| `npm run prune`     | toglie dall'export gli asset non richiesti   |

## Struttura

```
src/
  app/                  rotte App Router
    page.tsx              /              home
    storia/page.tsx       /storia
    gallery/page.tsx      /gallery
    prenotazioni/page.tsx /prenotazioni
    contatti/page.tsx     /contatti
    layout.tsx            layout radice: CSS, metadata, header, footer
    sitemap.ts robots.ts  SEO
    not-found.tsx error.tsx
  components/
    layout/             TopBar, Header, SidebarPanel, Footer, Preloader, ScrollTopButton
    sections/           le sezioni riusabili delle pagine
    ui/                 ImagesSwiper
    providers/          AosProvider
    seo/                RestaurantJsonLd
  data/                 tutti i testi e le immagini del sito, tipizzati
  hooks/                useHeaderFixed, useCountUp, useMediaQuery
  lib/                  utilita'
  styles/               SCSS del tema, portato e riconciliato
  types/                tipi condivisi
public/assets/          immagini, font, favicon
tools/visual-check/     confronto automatico con il sito ASP.NET originale
docs/                   analisi, verifiche, decisioni
```

## Dove si modificano le cose

**I testi e i contatti** stanno tutti in `src/data/`. Cambiare numero di telefono, orari o
indirizzo significa toccare **un solo file**, `src/data/site.ts`: header, footer, pannello
laterale, pagina contatti e dati strutturati si aggiornano insieme.

| cosa                                      | dove                                    |
| ----------------------------------------- | --------------------------------------- |
| telefono, email, indirizzo, orari, social | `src/data/site.ts`                      |
| voci di menu                              | `src/data/navigation.ts`                |
| tappe della pagina Storia                 | `src/data/history.ts`                   |
| foto della gallery e dei caroselli        | `src/data/gallery.ts`                   |
| le tre qualità, i contatori               | `src/data/qualities.ts`                 |
| titoli e descrizioni per Google           | il `metadata` in cima a ogni `page.tsx` |

**Gli stili** stanno in `src/styles/`, in due parti distinte:

- `app.scss` e i suoi componenti sono il tema portato dal progetto originale. Restano
  confrontabili riga per riga con il CSS che girava in produzione: non vanno modificati per
  esigenze di Next.
- `_next-adjustments.scss` contiene le poche regole aggiunte da questa migrazione, ognuna con
  scritto il perché.

**Aggiungere un'immagine**: metterla in `public/assets/images/`, poi dichiararne `src`, `alt`,
`width` e `height` nel file di `src/data/` corrispondente. Le dimensioni sono obbligatorie: senza,
la pagina sobbalza mentre le immagini arrivano.

## Pubblicazione

Il sito è online come **export statico su GitHub Pages**:

> **https://growedevelopers.github.io/WebSiteVillaSalina/**

È l'anteprima; il passaggio a **www.villa-salina.com** è già predisposto e richiede di svuotare due
variabili nel workflow. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) converte le
immagini, genera l'export e lo pubblica.

Istruzioni complete — record DNS, attivazione di Pages, cosa fare se qualcosa non torna — in
[`docs/DEPLOY.md`](docs/DEPLOY.md).

Anteprima locale identica a Pages:

```bash
npm run build
node tools/visual-check/serve-export.mjs 4310
```

Non essendoci un runtime Node in produzione, le fotografie non possono essere convertite su
richiesta: le prepara `scripts/optimize-images.mjs` prima della build. Il perché delle scelte di
formato e qualità è in [`src/lib/image.ts`](src/lib/image.ts).

## Verificare che non si sia rotto niente

In `tools/visual-check` c'è il confronto automatico con il sito ASP.NET originale: testo visibile,
geometria delle sezioni, altezze delle pagine, differenza al pixel, risoluzione delle immagini e
accessibilità. Istruzioni in [`tools/visual-check/README.md`](tools/visual-check/README.md).

## Documentazione

| documento                                                                  | contenuto                                     |
| -------------------------------------------------------------------------- | --------------------------------------------- |
| [`PLAN.md`](PLAN.md)                                                       | il piano della migrazione, fase per fase      |
| [`docs/ANALISI-PROGETTO-ORIGINALE.md`](docs/ANALISI-PROGETTO-ORIGINALE.md) | com'era fatto il sito ASP.NET                 |
| [`docs/VERIFICA-PARITA.md`](docs/VERIFICA-PARITA.md)                       | prova che il sito nuovo è identico al vecchio |
| [`docs/VERIFICA-STILI.md`](docs/VERIFICA-STILI.md)                         | come è stato riconciliato il CSS              |
| [`docs/ASSET-AUDIT.md`](docs/ASSET-AUDIT.md)                               | cosa è stato portato degli 89 MB originali    |
| [`docs/ACCESSIBILITA.md`](docs/ACCESSIBILITA.md)                           | audit e i due difetti ancora aperti           |
| [`docs/CONVENZIONI-COMMIT.md`](docs/CONVENZIONI-COMMIT.md)                 | come si committa su questo repo               |

## Note tecniche

- **ESLint è fissato alla versione 9.** La 10 rompe `eslint-plugin-react`, incluso in
  `eslint-config-next` 16.
- **Bootstrap 5.1.3** è importato solo come CSS. Il suo JavaScript non serve: nel markup non c'è
  nessun componente interattivo di Bootstrap.
- **Niente jQuery.** Header fisso, menu mobile, pannello laterale, torna-su, preloader e contatori
  sono riscritti in React.

---

© Villa Salina — sviluppo [Growe Srl](https://growe.dev)
