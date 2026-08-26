# Verifica degli stili — sorgente SCSS ≡ CSS di produzione

Il sito ASP.NET serviva `wwwroot/app/dist/app.css`, che era stato **modificato a mano** dopo
l'ultima compilazione dell'SCSS. Il porting non poteva quindi limitarsi a copiare il sorgente:
sarebbe uscito un sito con font e dettagli diversi da quello online.

Metodo seguito: compilare il sorgente portato e confrontarlo, riga per riga e ignorando gli
spazi, con `dist/app.css`, chiudendo una a una tutte le differenze.

```bash
npx sass --no-source-map --style=expanded src/styles/app.scss /tmp/port.css
diff <(tr -d ' \t\r' < /tmp/port.css   | grep -v '^$') \
     <(tr -d ' \t\r' < dist/app.css    | grep -v '^$')
```

## Risultato

| Passo | Righe di differenza |
|---|---:|
| Copia grezza del sorgente | **307** |
| Dopo l'allineamento della tipografia a Inter | 168 |
| Dopo i titoli e le linee del footer | 141 |
| Dopo padding, sfondi e hamburger | 110 |
| Dopo il recupero degli override in coda | 101 |
| Dopo il riordino delle dichiarazioni | **31** |

Le 31 righe rimaste sono **due sole differenze**, entrambe volute e senza alcun effetto sulle
pagine renderizzate.

## Differenze chiuse

| # | Cosa | Da | A |
|---|---|---|---|
| 1 | famiglia tipografica (31 utilizzazioni + 2 `@font-face`) | Audrey / Cerebri Sans | **Inter** |
| 2 | `.header .main-nav` | `left: 50%`, `top: 50%` | `left: 25%`, `top: 52%` |
| 3 | `.header.style-2 … .main-nav` | `left: 50%` | `left: 30.9%` |
| 4 | `.footer .widget h5` | — | `text-align: center` |
| 5 | `.footer .widget h5::before` | `left: 0` | `left: 50%` + `translateX(-50%)` |
| 6 | `.footer.style-2 .widget.time h5::before` | `left: auto; right: 0` | linea centrata 73 × 2 px |
| 7 | `.testimonials` (in `.home-3`) | `padding: 131px 0 188px` | `100px 0 100px` |
| 8 | `.testimonials` | `padding: 136px 0 235px` | `86px 0 135px` |
| 9 | `.booking` | `section/booking.jpg` + `background-attachment: fixed` | `my/tavolo.jpg`, senza `fixed` |
| 10 | `.s-formmail` | `section/s-form.jpg` | `my/sofa.jpg` |
| 11 | `.page-title.p-gallery` | `section/bg-gallery.jpg` | `gallery.png` |
| 12 | `.page-title.p-history` | `section/bg-history.jpg` | `Foto-storica-moretta.jpg` |
| 13 | `.mobile-button` (hamburger) | `background-color: #fff` | `black` |
| 14 | coda del file | — | blocco `/* Singh */`: nav a `left: 35%` sopra 991 px |
| 15 | coda del file | — | blocco `/* Sam */`: `h2.title` 28 px e `p.sub-title` 15 px sotto 500 px |
| 16 | 10 dichiarazioni dopo regole annidate | ordine dipendente dalla versione di Sass | dichiarazioni spostate prima |

I due blocchi 14–15 vivono ora in `src/styles/_overrides.scss`, caricato per ultimo da
`app.scss` così da mantenere la stessa priorità di cascata.

### Sul punto 16 — il riordino delle dichiarazioni

In 10 punti del sorgente una dichiarazione compariva **dopo** una regola annidata:

```scss
.s-menu {
    .container { max-width: 1655px; }
    padding: 134px 0 138px;      // <- dopo la regola annidata
}
```

Fino a Dart Sass 1.77 la dichiarazione veniva risalita nel blocco padre, emesso **prima** della
regola annidata. Dalla 1.78 viene emessa in un blocco separato **dopo**. `dist/app.css` era stato
compilato con la vecchia versione, quindi l'ordine non coincideva.

Le dichiarazioni sono state spostate prima delle regole annidate: l'output torna identico e il
sorgente non dipende più dalla versione di Sass.

## Le 2 differenze rimaste (volute)

### A. La modifica sbagliata su `.menu-list h5`

In `dist/app.css` qualcuno ha riscritto la regola

```css
.menu-list h5::before, .menu-list h5::after { … }
```

sostituendone il contenuto con lo stile della linea del footer, e ci ha infilato dentro due regole
`.footer .widget h5::before` e `::after`. È chiaramente un errore: voleva modificare il footer e
ha modificato il blocco sbagliato.

**Non è stata replicata**, perché è innocua e riprodurla significherebbe portarsi dietro un bug:

- `.menu-list` **non compare in nessuna delle 5 pagine** → la regola rovinata non tocca niente
- `.footer .widget h5::before { bottom: -14px }` è **identica** a quella che il sorgente già
  produce, e la regola "vera" più in basso nel file vince comunque a parità di specificità
- `.footer .widget h5::after` non ha `content` → lo pseudo-elemento non viene mai creato

### B. Il commento di intestazione di `_overrides.scss`

`dist/app.css` termina con `/*# sourceMappingURL=app.css.map */` seguito dai due blocchi aggiunti
a mano. Il file portato ha invece il commento che spiega da dove arrivano quegli override. Nessun
effetto sul rendering.

## Come rifare la verifica

```bash
npx sass --no-source-map --style=expanded src/styles/app.scss /tmp/port.css
diff <(tr -d ' \t\r' < /tmp/port.css | grep -v '^$') \
     <(tr -d ' \t\r' < "…/wwwroot/app/dist/app.css" | grep -v '^$')
# atteso: 31 righe, i due soli punti A e B
```

---

## Audit del CSS non utilizzato

Il tema compilato pesa **228 KB** non minificato (circa 160 KB minificato, 25 KB in gzip).

Delle 339 classi di primo livello del tema, **285 non compaiono in nessuna delle 5 pagine**:
sono gli stili delle pagine demo mai realizzate (blog in 6 varianti, shop, carriere, FAQ,
coming soon, gift voucher, team, sidebar dei post, effetti `animate.css`, magnific-popup…).

**Non sono state rimosse.** Motivi:

1. il guadagno reale è modesto — dopo minificazione e gzip si parla di una decina di KB su una
   pagina che ne serve oltre un migliaio di immagini;
2. il rischio è concreto — molte classi del tema vengono aggiunte dal JavaScript a runtime
   (`is-fixed`, `is-small`, `active`, `show`, `aos-animate`) e una rimozione automatica le
   toglierebbe silenziosamente;
3. il sorgente resta allineato a `dist/app.css`, e quindi verificabile con il diff qui sopra;
   svuotarlo interromperebbe questa possibilità.

Se in futuro si vorrà procedere, la strada corretta è eliminare **interi file** di
`src/styles/component/` corrispondenti a sezioni mai usate (`_comment.scss`, `_panigation.scss`,
`_progress.scss`, `_accordion.scss`, `_tab.scss`, `_dropdown.scss`, `magnific-popup.scss`),
verificando ogni volta con uno smoke test delle 5 pagine — non con un purge automatico basato
sulle classi presenti nell'HTML.
