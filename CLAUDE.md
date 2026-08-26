# CLAUDE.md — WebSiteVillaSalina

Istruzioni permanenti per chi lavora su questo repository.

## ⚠️ Regola di commit — non negoziabile

1. **Si committa dopo OGNI task, mini-task e mini-mini-task.** Un mini-task può contenere altri
   task: si committa comunque ogni livello. Non deve mai restare lavoro non committato.
2. **Autore unico: `Singh-Growe <account@growe.dev>`.**
3. **MAI** aggiungere `Co-Authored-By:` ai commit. Mai citare Claude, Anthropic, AI o
   "generated with" nei messaggi di commit. Nessuna emoji di firma automatica.

Dettagli: [`docs/CONVENZIONI-COMMIT.md`](docs/CONVENZIONI-COMMIT.md).

Formato messaggi: `tipo(ambito): descrizione` — in italiano, imperativo, minuscolo.

## Contesto

Porting del sito **Villa Salina** (ristorante, Moretta CN) da ASP.NET Core MVC 8 + Razor + jQuery
a **Next.js 15 App Router + TypeScript**.

- Piano completo e stato di avanzamento: [`PLAN.md`](PLAN.md)
- Analisi dell'originale: [`docs/ANALISI-PROGETTO-ORIGINALE.md`](docs/ANALISI-PROGETTO-ORIGINALE.md)
- Pubblicazione: export statico su GitHub Pages, vedi [`docs/DEPLOY.md`](docs/DEPLOY.md)
- Progetto di origine: `C:\Users\Samar\source\repos\WebSiteVillaSalina`
- Remote: https://github.com/GroweDevelopers/WebSiteVillaSalina.git

## Principi tecnici

- **Fedeltà visiva prima di tutto.** Il design non cambia. La fonte di verità per gli stili è
  `wwwroot/app/dist/app.css` dell'originale, **non** il sorgente SCSS (sono derivati: vedi
  sezione 6 dell'analisi).
- **Niente jQuery.** Ogni comportamento è riscritto in React con hook dedicati.
- **Contenuti in `src/data/`**, tipizzati. Nessuna stringa di contenuto sparsa nei componenti.
- **Path asset sempre assoluti** (`/assets/...`). L'originale usa path relativi che si rompono
  sulle rotte annidate: è un bug da non replicare.
- **TypeScript strict.** `npm run lint` e `npx tsc --noEmit` devono restare puliti.

## Struttura

```
src/
  app/          rotte App Router (page.tsx, layout.tsx, sitemap.ts, robots.ts)
  components/
    layout/     header, footer, sidebar, preloader, scroll-top
    sections/   sezioni di pagina riusabili
    ui/         primitive
    providers/  provider client-side (AOS)
  data/         contenuti tipizzati
  hooks/        hook riusabili
  lib/          utility
  styles/       SCSS portato dall'originale
  types/        tipi condivisi
public/assets/  immagini, font, font awesome
```

## Comandi

```bash
npm run dev        # sviluppo
npm run build      # build di produzione
npm run start      # server di produzione
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```
