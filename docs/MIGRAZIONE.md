# Migrazione da ASP.NET a Next.js — cosa è cambiato

Riassunto di cosa è stato fatto, cosa è cambiato e cosa è rimasto identico.

## In una riga

Il sito è lo stesso — testo identico, geometria identica su tutte le pagine e tutti i formati di
schermo — ma pesa un terzo, non usa più jQuery, ha metadati e dati strutturati per Google e ha il
70 % di problemi di accessibilità in meno.

## I numeri

|                                        |        prima |    dopo |        |
| -------------------------------------- | -----------: | ------: | ------ |
| home                                   |      6,36 MB | 2,14 MB | −66 %  |
| storia                                 |      4,55 MB | 2,19 MB | −52 %  |
| gallery                                |     10,25 MB | 2,84 MB | −72 %  |
| contatti                               |      6,09 MB | 3,65 MB | −40 %  |
| font per pagina                        |       864 KB |  456 KB | −47 %  |
| CSS per pagina                         |       588 KB |  463 KB | −21 %  |
| JavaScript di terze parti              |       1,3 MB |       0 | −100 % |
| dimensione del repository              |        89 MB |   17 MB | −81 %  |
| elementi con problemi di accessibilità |           95 |      29 | −70 %  |
| risorse che rispondono con errore      | 1 per pagina |       0 |        |

Il residuo di `/contatti` è quasi tutto la mappa di Google: 2,3 MB di JavaScript che arrivano dal
loro iframe e su cui non si può intervenire, se non sostituendo l'embed con un'immagine cliccabile.

## Cosa è rimasto esattamente uguale

Verificato automaticamente, non a occhio (vedi [`VERIFICA-PARITA.md`](VERIFICA-PARITA.md)):

- **il testo**, parola per parola, su tutte e cinque le pagine
- **la posizione e l'altezza di ogni sezione**, a 1920, 768 e 390 px
- **l'altezza totale di ogni pagina**, in tutte e 15 le combinazioni pagina/formato
- **i colori, i caratteri, le spaziature**: la differenza al pixel resta sotto lo 0,13 %, e quello
  che resta è riconducibile a tre modifiche volute

## Le cinque cose che sono cambiate sotto

### 1. Niente più jQuery

`app.js` erano 700 righe di jQuery, di cui la maggior parte codice morto — form ajax, accordion,
tab, dropdown, popup video, sidebar sticky: nessuno di questi selettori esiste nelle cinque pagine
del sito.

Quello che era davvero attivo è stato riscritto in React:

| jQuery                                | React                                         |
| ------------------------------------- | --------------------------------------------- |
| `headerFixed()`                       | `useHeaderFixed()`                            |
| `mobileNav()` — spostava nodi nel DOM | due menu che si alternano con una media query |
| toggle su `.btn-side`                 | stato in `SidebarPanel`                       |
| `goTop()`                             | `ScrollTopButton`                             |
| `Preloader()`                         | `Preloader`                                   |
| `flatCounter()` + `countTo`           | `useCountUp()`                                |
| `AOS.init()`                          | `AosProvider`                                 |
| init globali di Swiper                | istanze `swiper/react` nei componenti         |

Non sono stati portati: jQuery, magnific-popup, parallax, apexcharts, chart.js, countdown,
easing, sticky-sidebar, jquery-validate e il JavaScript di Bootstrap. Nemmeno Highcharts, che il
layout caricava da CDN in ogni pagina senza usarlo mai.

### 2. I contenuti stanno in un posto solo

Numero di telefono, email, indirizzo e orari erano ripetuti in quattro punti diversi, e in uno
gli orari **divergevano** ("Lunedì – Venerdì 20.00 – 00.00" contro "Lunedì – Domenica 08.00 –
00.00"). Ora stanno in `src/data/site.ts` e da lì raggiungono header, footer, pannello laterale,
pagina contatti e dati strutturati.

Lo stesso per navigazione, timeline della pagina Storia, fotografie e testi delle sezioni.

### 3. Gli stili sono tracciabili

Il CSS che girava in produzione, `wwwroot/app/dist/app.css`, era stato **modificato a mano** dopo
l'ultima compilazione dell'SCSS: 16 differenze, fra cui il cambio di tutta la tipografia da
Audrey/Cerebri Sans a Inter. Chiunque avesse ricompilato l'SCSS avrebbe mandato online un sito con
i caratteri sbagliati senza accorgersene.

Le modifiche sono state riportate una per una nel sorgente, che ora ricompila producendo lo stesso
CSS. Dettaglio in [`VERIFICA-STILI.md`](VERIFICA-STILI.md).

Stessa storia per `bootstrap.css`, anch'esso ritoccato a mano in un punto solo su 11.265 righe.

### 4. Le immagini

- Portate solo le 74 effettivamente usate, su 233 (le altre erano demo del tema)
- Ognuna dichiara `width` e `height`, così la pagina non sobbalza mentre arrivano
- Le fotografie passano da `next/image`, che le converte in AVIF e WebP e le ridimensiona
- I font sono in WOFF2: 916 KB diventano 316 KB

### 5. SEO e accessibilità

Il progetto originale non aveva sitemap, robots, OpenGraph né dati strutturati, e il titolo della
home era «Home Page - Villa Salina».

Ora ci sono: metadati per pagina, OpenGraph e Twitter card, `sitemap.xml`, `robots.txt`, canonical
e la scheda `Restaurant` di schema.org con indirizzo, coordinate, orari, telefono, chef e social.

Sul fronte accessibilità: i link social erano vuoti per un lettore di schermo (solo un'icona
dentro), nessuna pagina aveva un titolo di primo livello, mancava il landmark principale, la mappa
non aveva nome e i pulsanti non erano raggiungibili da tastiera. Tutto sistemato — restano due
difetti di design ereditati, documentati in [`ACCESSIBILITA.md`](ACCESSIBILITA.md).

## Difetti dell'originale corretti strada facendo

| difetto                                                    | dove                              |
| ---------------------------------------------------------- | --------------------------------- |
| tre titoli `<p>` chiusi con `</a>`                         | `_eccellenza.cshtml`              |
| attributi `data-aos-duration` duplicati                    | `_eccellenza.cshtml`              |
| classi `aos-init aos-animate` scritte a mano nel markup    | `Storia.cshtml`                   |
| `<section>` con due attributi `style`, il secondo ignorato | `_eccellenza.cshtml`              |
| Highcharts caricato e mai usato                            | `_Layout.cshtml`                  |
| animazione dei contatori mai avviata                       | manca `counter-scroll` sul `body` |
| orari divergenti fra header e footer                       | `_Header.cshtml`                  |
| `alt` vuoti su tutte le immagini                           | ovunque                           |
| pagina di errore con RequestId e istruzioni per ASP.NET    | `Error.cshtml`                    |

## Cosa è rimasto in sospeso

|                             |                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| **Privacy Policy**          | il link nel footer punta a `#`: la pagina non esiste. Serve il testo                               |
| **favicon**                 | è il logo orizzontale 169 × 43, schiacciato nel tab. Servirebbe un set quadrato                    |
| **contrasto del copyright** | 3,08:1, sotto lo standard. La correzione è pronta, serve l'ok sul colore                           |
| **gerarchia dei titoli**    | il tema salta da `h3` a `h5`. Sistemarlo cambia le dimensioni: serve una decisione                 |
| **menù delle feste**        | la sezione natalizia è commentata nell'originale; le immagini sono state portate, la sezione no    |
| **mappa di Google**         | 2,3 MB di JavaScript per un iframe. Un'immagine statica cliccabile costerebbe qualche decina di KB |

## Come si verifica che non si sia rotto niente

Tenendo acceso anche il vecchio sito, `tools/visual-check` rifà tutti i confronti: testo,
geometria, pixel, risoluzione delle immagini, accessibilità e peso delle pagine. Istruzioni in
[`../tools/visual-check/README.md`](../tools/visual-check/README.md).
