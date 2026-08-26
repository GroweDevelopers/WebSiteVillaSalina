# Convenzioni di commit — WebSiteVillaSalina

## Regola 1 — Si committa TUTTO, sempre

> Dopo ogni **task**, ogni **mini-task** e ogni **mini-mini-task** → **commit**.

Un mini-task può contenere altri task al suo interno: si committa comunque **ogni livello**.
Non deve mai esistere lavoro completato ma non committato.

In pratica:

- hai creato un file di configurazione? → commit
- hai aggiunto un singolo componente? → commit
- hai copiato un gruppo di asset? → commit
- hai corretto un solo path in un file SCSS? → commit
- hai spuntato una checkbox nel `PLAN.md`? → va nel commit del task relativo

## Regola 2 — Autore unico: Singh-Growe

Tutti i commit sono a nome di:

```
Singh-Growe <account@growe.dev>
```

**Vietato** in qualsiasi commit:

- il trailer `Co-Authored-By:` (di Claude o di chiunque altro)
- riferimenti a Claude, Anthropic, AI, "generated with", "assistito da"
- emoji di firma automatica (🤖)

Configurazione locale già applicata al repository:

```bash
git config user.name  "Singh-Growe"
git config user.email "account@growe.dev"
```

### Verifica

Controllo che la storia sia pulita:

```bash
# deve restituire 0 risultati
git log --all --format="%H %an %ae%n%b" | grep -iE "claude|co-authored|anthropic"

# deve mostrare un solo autore
git log --all --format="%an <%ae>" | sort -u
```

### Bonifica (se un co-author dovesse comparire)

```bash
git filter-branch -f --msg-filter \
  'sed "/^Co-Authored-By:/d;/^Co-authored-by:/d"' \
  --env-filter '
    export GIT_AUTHOR_NAME="Singh-Growe"
    export GIT_AUTHOR_EMAIL="account@growe.dev"
    export GIT_COMMITTER_NAME="Singh-Growe"
    export GIT_COMMITTER_EMAIL="account@growe.dev"
  ' -- --all
```

Poi `git push --force-with-lease`.

## Regola 3 — Formato del messaggio

```
<tipo>(<ambito>): <descrizione in italiano, imperativo, minuscolo>

[corpo opzionale: cosa e perché, non come]
```

### Tipi ammessi

| Tipo | Uso |
|---|---|
| `feat` | nuova funzionalità, componente, pagina |
| `fix` | correzione di un difetto |
| `style` | CSS/SCSS, aspetto visivo |
| `refactor` | riorganizzazione senza cambio di comportamento |
| `chore` | configurazione, dipendenze, tooling |
| `assets` | immagini, font, file statici |
| `docs` | documentazione |
| `perf` | performance |
| `ci` | pipeline |
| `build` | sistema di build |

### Ambiti ricorrenti

`setup`, `config`, `deps`, `layout`, `header`, `footer`, `sidebar`, `hero`, `chef`,
`eccellenza`, `michelin`, `gallery`, `storia`, `contatti`, `prenotazioni`, `counter`,
`styles`, `scss`, `fonts`, `images`, `seo`, `sitemap`, `a11y`, `plan`

### Esempi

```
chore(setup): inizializza repository e configura autore
assets(images): copia le immagini da wwwroot in public
style(scss): allinea la famiglia font a Inter come in dist/app.css
feat(header): implementa la navigazione mobile senza jQuery
docs(plan): aggiorna lo stato della fase 3
```

## Regola 4 — Commit atomici

Un commit = una modifica logica. Non mischiare rifacimenti di componenti con copie di asset.
Se un mini-task tocca più aree, si spezza in più commit.

## Regola 5 — Lingua

Messaggi di commit e documentazione in **italiano**. Codice, nomi di file, identificatori e
commenti tecnici in **inglese**.
