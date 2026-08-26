# PLAN — Migrazione Villa Salina da ASP.NET MVC a Next.js

> **Progetto:** WebSiteVillaSalina
> **Origine:** `C:\Users\Samar\source\repos\WebSiteVillaSalina` (ASP.NET Core MVC 8.0, Razor Views)
> **Destinazione:** `C:\Users\Samar\Documents\Work\Growe - Telebi\villasalina\WebSiteVillaSalina` (Next.js App Router + TypeScript)
> **Remote:** https://github.com/GroweDevelopers/WebSiteVillaSalina.git
> **Autore commit:** Singh-Growe `<account@growe.dev>` — **mai** co-authored da Claude o altri.

---

## Regola operativa fondamentale

**Dopo OGNI task, mini-task e mini-mini-task → si committa.**

Nessun lavoro resta non committato. Un mini-task può contenere altri task: si committa comunque
ogni sotto-livello. I commit sono atomici, in italiano, con prefisso conventional-commit.

I commit sono **esclusivamente** a nome di **Singh-Growe `<account@growe.dev>`**.
Nessun trailer `Co-Authored-By:`. Nessuna menzione di Claude, AI o generatori.

Dettagli completi in [`docs/CONVENZIONI-COMMIT.md`](docs/CONVENZIONI-COMMIT.md).

---

## Obiettivo

Riprodurre **fedelmente al pixel** il sito attuale, sostituendo lo stack Razor/jQuery con
Next.js + React + TypeScript, senza perdere nulla del design e migliorando:

- niente jQuery (tutta l'interattività riscritta in React)
- SEO nativo (metadata, sitemap, robots, JSON-LD)
- performance (font locali ottimizzati, immagini responsive, code splitting)
- manutenibilità (contenuti centralizzati e tipizzati, componenti riusabili)

### Vincolo di fedeltà

Il file effettivamente servito in produzione è `wwwroot/app/dist/app.css`, che è **derivato**
rispetto al sorgente `wwwroot/app/scss/`. Le differenze note (font `Inter` al posto di
Audrey/CerebriSans + ~15 override manuali) sono documentate in
[`docs/ANALISI-PROGETTO-ORIGINALE.md`](docs/ANALISI-PROGETTO-ORIGINALE.md) e vanno **riportate nel
sorgente SCSS**, non perse.

---

## Stack scelto

| Ambito | Scelta | Motivo |
|---|---|---|
| Framework | Next.js 15 (App Router) | Routing file-based, RSC, metadata API |
| Linguaggio | TypeScript strict | Sicurezza sui dati di contenuto |
| Stili | Sass (SCSS) — sorgente originale portato | Fedeltà 1:1 al design esistente |
| Griglia | Bootstrap 5.1.3 (solo CSS) | Le view usano massicciamente `col-*`, `row`, `d-*` |
| Slider | `swiper` v11 (React) | Sostituisce `swiper-bundle.min.js` |
| Animazioni scroll | `aos` v2.3.4 | Il markup usa già `data-aos` |
| Icone | `@fortawesome/fontawesome-free` 6.4.2 (CSS) | Le classi `fa-*` sono nel markup |
| Font | `next/font/local` | Audrey, Cerebri Sans, Inter self-hosted |
| Lint | ESLint (next/core-web-vitals) + Prettier | |

---

## Mappa di conversione

### Rotte

| ASP.NET (`HomeController`) | Razor View | Next.js |
|---|---|---|
| `[Route("")]` → `Index()` | `Views/Home/Index.cshtml` | `src/app/page.tsx` |
| `[Route("storia")]` → `Storia()` | `Views/Home/Storia.cshtml` | `src/app/storia/page.tsx` |
| `[Route("gallery")]` → `Gallery()` | `Views/Home/Gallery.cshtml` | `src/app/gallery/page.tsx` |
| `[Route("prenotazioni")]` → `Prenotazioni()` | `Views/Home/Prenotazioni.cshtml` | `src/app/prenotazioni/page.tsx` |
| `[Route("contatti")]` → `Contatti()` | `Views/Home/Contatti.cshtml` | `src/app/contatti/page.tsx` |
| `Error()` | `Views/Shared/Error.cshtml` | `src/app/error.tsx` + `src/app/not-found.tsx` |

### Layout e partial

| Razor | Next.js |
|---|---|
| `Views/Shared/_Layout.cshtml` | `src/app/layout.tsx` |
| `Views/Shared/_Header.cshtml` | `src/components/layout/TopBar.tsx` + `Header.tsx` + `SidebarPanel.tsx` |
| `Views/Shared/_Footer.cshtml` | `src/components/layout/Footer.tsx` |
| `Views/Shared/_chef.cshtml` | `src/components/sections/ChefSection.tsx` |
| `Views/Shared/_eccellenza.cshtml` | `src/components/sections/EccellenzaSection.tsx` |
| `Views/Shared/_guidamichelin.cshtml` | `src/components/sections/GuidaMichelinSection.tsx` |
| `Views/Shared/_Prenotazione.cshtml` | `src/components/sections/PrenotazioneCta.tsx` |

### JavaScript da riscrivere (eliminazione jQuery)

| `wwwroot/app/js/app.js` | Sostituto React |
|---|---|
| `headerFixed()` | `useHeaderFixed()` — listener scroll + classi `is-fixed` / `is-small` |
| `mobileNav()` | stato React in `Header.tsx` (niente spostamento DOM) |
| `.btn-side` toggle | stato React in `SidebarPanel.tsx` |
| `goTop()` | `ScrollTopButton.tsx` |
| `Preloader()` | `Preloader.tsx` |
| `flatCounter()` + `countTo` | `useCountUp()` + `<CounterItem />` |
| `AOS.init()` | `AosProvider.tsx` (`useEffect`) |
| `swiper.js` (init globali) | istanze `swiper/react` nei singoli componenti |
| `ajaxContactForm`, `ajaxSubscribe`, `tabs`, `dropdown`, `flatAccordion`, `popupVideo`, `sticky` | **non usati** dal markup attuale → non portati |

---

## Fasi e task

Legenda stato: `[ ]` da fare · `[x]` fatto e committato

### FASE 0 — Setup repository, piano e memoria

- [ ] 0.1 Creare cartella progetto di destinazione
- [ ] 0.2 `git init` + branch `main` + config autore locale (Singh-Growe)
- [ ] 0.3 Collegare remote `origin` a GroweDevelopers/WebSiteVillaSalina
- [ ] 0.4 `.gitignore` per Next.js
- [ ] 0.5 `PLAN.md` (questo file)
- [ ] 0.6 `docs/ANALISI-PROGETTO-ORIGINALE.md` — inventario completo dell'originale
- [ ] 0.7 `docs/CONVENZIONI-COMMIT.md` — regola commit + autore
- [ ] 0.8 `CLAUDE.md` — istruzioni permanenti per il repo
- [ ] 0.9 Scrittura in memoria Claude (regola commit + contesto progetto)
- [ ] 0.10 Verifica assenza di commit `Co-Authored-By: Claude` nella storia esistente

### FASE 1 — Scaffolding Next.js

- [ ] 1.1 `package.json` con script e dipendenze
- [ ] 1.2 Installazione dipendenze (`npm install`)
- [ ] 1.3 `tsconfig.json` strict + path alias `@/*`
- [ ] 1.4 `next.config.ts`
- [ ] 1.5 `eslint.config.mjs`
- [ ] 1.6 `.prettierrc` + `.prettierignore`
- [ ] 1.7 `.editorconfig`
- [ ] 1.8 Struttura cartelle `src/{app,components,data,hooks,lib,styles,types}`
- [ ] 1.9 `src/app/layout.tsx` minimale che compila
- [ ] 1.10 `src/app/page.tsx` placeholder — primo `next build` verde

### FASE 2 — Migrazione asset statici

- [ ] 2.1 Copia `wwwroot/assets/images/**` → `public/assets/images/**`
- [ ] 2.2 Copia font Audrey (6 file `.otf`) → `public/assets/font/`
- [ ] 2.3 Copia font Cerebri Sans (14 file `.ttf`) → `public/assets/font/`
- [ ] 2.4 Copia font Inter (2 file `.ttf`) → `public/assets/font/`
- [ ] 2.5 Font Awesome 6.4.2: solo `css/all.min.css` + `webfonts/` (scarta js/less/scss/svgs/sprites/metadata: −27 MB)
- [ ] 2.6 Rimozione asset non referenziati (`assets/font/icon` FA5, `fontawesome-free` legacy)
- [ ] 2.7 `favicon.ico` + icone da `assets/images/favicon.png`
- [ ] 2.8 Report `docs/ASSET-AUDIT.md` (cosa è stato portato, cosa scartato e perché)

### FASE 3 — Migrazione stili

- [ ] 3.1 Copia sorgenti SCSS → `src/styles/` (solo `.scss`, niente `.css`/`.map` compilati)
- [ ] 3.2 Riscrittura path `url(../../assets/…)` → `url(/assets/…)`
- [ ] 3.3 Riconciliazione deriva #1: famiglia font `Inter` (2 `@font-face` + tutte le occorrenze)
- [ ] 3.4 Riconciliazione deriva #2: `.footer .widget h5::before/::after` (linea centrata 73 px)
- [ ] 3.5 Riconciliazione deriva #3: padding sezioni `location` e `s-formmail`
- [ ] 3.6 Riconciliazione deriva #4: background `booking` → `my/tavolo.jpg`, `s-formmail` → `my/sofa.jpg`
- [ ] 3.7 Riconciliazione deriva #5: `p-gallery` → `gallery.png`, `p-history` → `Foto-storica-moretta.jpg`
- [ ] 3.8 Riconciliazione deriva #6: `.sidebar-content` background nero
- [ ] 3.9 Riconciliazione deriva #7: `.block-text .title::after` centrato
- [ ] 3.10 Riconciliazione deriva #8: override finali (`.header .main-nav` a 991px, tipografia < 500px)
- [ ] 3.11 Verifica: CSS compilato dal sorgente ≡ `dist/app.css` (diff vuoto)
- [ ] 3.12 `src/styles/globals.scss` — ordine import (bootstrap → swiper → aos → fontawesome → app)
- [ ] 3.13 Rimozione regole per pagine inesistenti (audit, non distruttivo se dubbio)

### FASE 4 — Componenti di layout

- [ ] 4.1 `src/components/layout/TopBar.tsx`
- [ ] 4.2 `src/components/layout/Header.tsx` (logo + nav desktop + CTA)
- [ ] 4.3 Navigazione mobile in React (hamburger, slide-toggle, niente jQuery)
- [ ] 4.4 `src/components/layout/SidebarPanel.tsx` (pannello laterale + toggle)
- [ ] 4.5 `src/hooks/useHeaderFixed.ts` (`is-fixed` > 200 px, `is-small` > 300 px + spacer)
- [ ] 4.6 `src/components/layout/Footer.tsx`
- [ ] 4.7 `src/components/layout/Preloader.tsx`
- [ ] 4.8 `src/components/layout/ScrollTopButton.tsx`
- [ ] 4.9 `src/components/providers/AosProvider.tsx`
- [ ] 4.10 `src/app/layout.tsx` definitivo (font, classi body, wrapper)

### FASE 5 — Componenti di sezione

- [ ] 5.1 `HeroSlider.tsx` (swiper `.mySwiper`, slide singola con overlay)
- [ ] 5.2 `EccellenzaSection.tsx` (3 servizi + doppio `imagesSwiper`)
- [ ] 5.3 `ImagesSwiper.tsx` (carosello immagini riusabile, `centeredSlides`, breakpoint 1 / 1.5 / 2.42)
- [ ] 5.4 `ChefSection.tsx`
- [ ] 5.5 `GuidaMichelinSection.tsx`
- [ ] 5.6 `PrenotazioneCta.tsx`
- [ ] 5.7 `src/hooks/useCountUp.ts`
- [ ] 5.8 `CounterSection.tsx` (4 contatori)
- [ ] 5.9 `AboutRestaurantSection.tsx`
- [ ] 5.10 `EventSection.tsx` (2 blocchi alternati)
- [ ] 5.11 `PageTitle.tsx` (varianti `p-history`, `p-gallery`)
- [ ] 5.12 `HistoryTimeline.tsx` (6 tappe)
- [ ] 5.13 `GalleryMasonry.tsx` (2 blocchi masonry)
- [ ] 5.14 `RestorationGallery.tsx` (gallery-ig prima/dopo)
- [ ] 5.15 `LocationSection.tsx` (contatti + mappa lazy)

### FASE 6 — Pagine

- [ ] 6.1 `src/app/page.tsx` — Home
- [ ] 6.2 `src/app/storia/page.tsx`
- [ ] 6.3 `src/app/gallery/page.tsx`
- [ ] 6.4 `src/app/prenotazioni/page.tsx`
- [ ] 6.5 `src/app/contatti/page.tsx`
- [ ] 6.6 `src/app/not-found.tsx`
- [ ] 6.7 `src/app/error.tsx`
- [ ] 6.8 Verifica parità visiva pagina per pagina

### FASE 7 — Contenuti centralizzati

- [ ] 7.1 `src/data/site.ts` (nome, contatti, indirizzo, orari, social, mappa)
- [ ] 7.2 `src/data/navigation.ts`
- [ ] 7.3 `src/data/history.ts` (timeline)
- [ ] 7.4 `src/data/gallery.ts`
- [ ] 7.5 `src/data/qualities.ts` (eccellenza / ospitalità / innovazione)
- [ ] 7.6 `src/data/counters.ts`
- [ ] 7.7 `src/types/` — tipi condivisi
- [ ] 7.8 Refactor componenti per consumare `src/data`

### FASE 8 — SEO e metadata

- [ ] 8.1 Metadata globali in `layout.tsx` (title template, description, lang `it`)
- [ ] 8.2 Metadata per singola pagina
- [ ] 8.3 OpenGraph + Twitter card
- [ ] 8.4 `src/app/sitemap.ts`
- [ ] 8.5 `src/app/robots.ts`
- [ ] 8.6 JSON-LD `Restaurant` (schema.org) con indirizzo, orari, telefono, geo
- [ ] 8.7 `metadataBase` + canonical

### FASE 9 — Qualità, performance, accessibilità

- [ ] 9.1 `next/font/local` per Audrey / Cerebri Sans / Inter
- [ ] 9.2 `next/image` dove porta beneficio reale
- [ ] 9.3 `loading="lazy"` su iframe Google Maps + `title`
- [ ] 9.4 `alt` significativi su tutte le immagini
- [ ] 9.5 Accessibilità: `aria-*` su hamburger/sidebar, focus visibile, landmark
- [ ] 9.6 Link esterni con `rel="noopener noreferrer"`
- [ ] 9.7 `npm run lint` pulito
- [ ] 9.8 `npx tsc --noEmit` pulito
- [ ] 9.9 `npm run build` verde
- [ ] 9.10 Smoke test runtime di tutte le rotte

### FASE 10 — Documentazione, CI e consegna

- [ ] 10.1 `README.md` (setup, script, struttura, deploy)
- [ ] 10.2 `docs/MIGRAZIONE.md` (cosa è cambiato rispetto all'originale)
- [ ] 10.3 GitHub Actions: lint + typecheck + build
- [ ] 10.4 Verifica finale storia git: nessun `Co-Authored-By`, autore unico Singh-Growe
- [ ] 10.5 Push su `origin/main`

---

## Fuori scope (esplicito)

- Backend/CMS per le prenotazioni: il sito attuale non ha form funzionanti, i CTA sono link
  `tel:` / `mailto:` e alla pagina prenotazioni. Si mantiene lo stesso comportamento.
- Multilingua: il sito è solo in italiano.
- Le pagine del tema mai usate (blog, shop, faq, careers…): il relativo CSS resta ma non si
  creano rotte.
