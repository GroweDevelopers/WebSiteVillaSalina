# Audit degli asset

Cosa è stato portato dal progetto ASP.NET, cosa è stato scartato e perché.

Metodo: sono stati estratti tutti i riferimenti a `assets/images/…` dalle 14 view Razor e tutti
gli `url(…)` da `wwwroot/app/dist/app.css` (il CSS effettivamente servito). L'unione dei due
insiemi è l'insieme da portare; il complemento è stato scartato.

## Riepilogo

|                    |                  Originale |                Portato |  Risparmio |
| ------------------ | -------------------------: | ---------------------: | ---------: |
| Immagini           |           32 MB (233 file) |  **15,1 MB (74 file)** |    15,7 MB |
| Font               |      18 MB (23 file + FA5) |    **916 KB (6 file)** |    17,1 MB |
| Font Awesome       | 31,3 MB (2 copie su disco) |             **da npm** |    31,3 MB |
| Bootstrap          |                     7,4 MB |             **da npm** |     7,4 MB |
| JS di tema         |                     1,3 MB | **riscritto in React** |     1,3 MB |
| **Totale in repo** |                 **~89 MB** |             **~16 MB** | **~73 MB** |

## Immagini — portate (74)

Tutte quelle citate almeno una volta da una view o da `dist/app.css`:

- radice: `about2.jpg`, `favicon.png`, `frame1.svg`, `gallery.png`, `logo.svg`, `logogold.svg`,
  `logo/logo.png`, `Foto-storica-moretta.jpg`,
  `close-up-photo-of-fresh-basil-italian-basilico-…jpg`
- `gallery/` — 12 piatti della pagina Gallery
- `my/` — 16 foto del ristorante e dei piatti
- `storia/` — 9 foto storiche e del restauro
- `icon/` — 5 icone (`chef.png`, `quote.png`, `x.png`, `eccellenza.svg`, `innovazione.svg`,
  `ospitalita.svg`)
- `prenotazioni/` — `menu1.jpg`, `menu2.jpg`
- `section/` — 21 sfondi citati dal CSS

## Immagini — scartate (159, 15,7 MB)

Sono tutte immagini demo del tema originale, mai referenziate:

| Cartella        | File scartati | Cosa erano                                                           |
| --------------- | ------------: | -------------------------------------------------------------------- |
| `section/`      |           105 | sfondi e foto per blog, chef, menu, shop, team, testimonial del tema |
| `partner/`      |            22 | loghi partner fittizi                                                |
| `icon/`         |             8 | icone di servizi non usate                                           |
| `my/`           |             7 | scatti alternativi non montati                                       |
| `logo/`         |             6 | varianti di logo del tema                                            |
| `slider/`       |             5 | slide demo                                                           |
| `storia/`       |             4 | scatti alternativi                                                   |
| `prenotazioni/` |             1 | slider demo                                                          |
| radice          |             1 | `logo.png` del tema                                                  |

## Font — portati (6, 916 KB)

Esattamente i file dichiarati da un `@font-face` in `dist/app.css`:

| File                     | Famiglia     | Peso | Realmente usato                    |
| ------------------------ | ------------ | ---- | ---------------------------------- |
| `Inter-Regular.ttf`      | Inter        | 400  | ✅ sì — è il font di tutto il sito |
| `Inter-Medium.ttf`       | Inter        | 500  | ✅ sì                              |
| `Audrey-Medium.otf`      | Audrey       | 500  | ⚠️ solo dichiarato                 |
| `Audrey-Normal.otf`      | Audrey       | 400  | ⚠️ solo dichiarato                 |
| `CerebriSans-Book.ttf`   | Cerebri Sans | 400  | ⚠️ solo dichiarato                 |
| `CerebriSans-Medium.ttf` | Cerebri Sans | 500  | ⚠️ solo dichiarato                 |

Le quattro famiglie "solo dichiarate" restano perché `dist/app.css` le dichiara: il browser non
le scarica finché nessuna regola le usa, quindi non costano nulla a runtime. Sono state tenute per
non perdere la possibilità di tornare alla tipografia originale del tema.

## Font — scartati

- 17 varianti di Audrey e Cerebri Sans mai dichiarate (~1,6 MB)
- `assets/font/icon/` — webfont **Font Awesome 5** completo (15 MB): nessun riferimento nel CSS
  né nel markup, il sito usa Font Awesome 6
- `assets/font/font-awesome.css` — foglio di stile FA5, mai incluso dal layout

## Font Awesome

L'originale ne aveva **due copie** su disco:

- `assets/fontawesome-free/` (3,3 MB) — legacy, mai inclusa dal layout
- `assets/fontawesome-free-6.4.2-web/` (28 MB) — inclusa, ma di cui servivano solo
  `css/all.min.css` (~100 KB) e `webfonts/` (944 KB)

Entrambe sostituite dal pacchetto npm `@fortawesome/fontawesome-free@6.4.2`, **stessa identica
versione**. Il bundler risolve da solo i path dei webfont e ne emette solo i formati serviti.

## Bootstrap

`app/bootstrap/` (7,4 MB: css, js, sourcemap, varianti RTL) sostituito da `bootstrap@5.1.3` da
npm — la versione esatta usata dall'originale. Si importa **solo il CSS**: il JS di Bootstrap non
serve, nessun componente interattivo di Bootstrap è usato nel markup.

## JavaScript di tema

`app/js/` (1,3 MB) non è stato portato: jQuery, Swiper standalone, magnific-popup, parallax,
apexcharts, chart.js, count-down, countto, easing, sticky-sidebar, ResizeSensor, rAF, input-file,
donatProgress, jquery-validate. I comportamenti effettivamente attivi sono stati riscritti in
React (vedi `PLAN.md`, sezione "JavaScript da riscrivere"); il resto era codice morto.

Rimosso anche `https://code.highcharts.com/highcharts.js`, caricato dal `<head>` del layout
originale e mai utilizzato.

## Nota aperta — favicon

`favicon.png` è **169 × 43 px**: è il lockup orizzontale del logo, non un'icona quadrata. Viene
schiacciato dai browser nel tab e nei segnalibri. È stato portato così com'è per fedeltà, ma
converrebbe generare un set quadrato (32, 180, 192, 512 px) da `logo.svg`.
