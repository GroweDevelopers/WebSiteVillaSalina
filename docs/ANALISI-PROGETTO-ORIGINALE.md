# Analisi del progetto originale (ASP.NET Core MVC)

Inventario completo del progetto di partenza, usato come specifica per la migrazione.

**Percorso:** `C:\Users\Samar\source\repos\WebSiteVillaSalina`
**Stack:** ASP.NET Core 8.0 MVC, Razor Views, jQuery 3.x, Bootstrap 5.1.3, Swiper, AOS 2.3.1

---

## 1. Backend

`Program.cs` è il template minimale: `AddControllersWithViews()`, HSTS, redirect HTTPS, file
statici, routing `{controller=Home}/{action=Index}/{id?}`.

**Nessuna logica applicativa.** Nessun database, nessun servizio, nessuna API, nessun form
gestito lato server. Il sito è interamente statico → si presta a un porting completo verso
Next.js con rendering statico.

`HomeController` espone 5 action, tutte `return View()` senza modello, con route esplicite:

| Action         | Route           |
| -------------- | --------------- |
| `Index`        | `/`             |
| `Storia`       | `/storia`       |
| `Gallery`      | `/gallery`      |
| `Prenotazioni` | `/prenotazioni` |
| `Contatti`     | `/contatti`     |

`ErrorViewModel` contiene solo `RequestId` — non ha equivalente utile in Next.js.

---

## 2. Layout (`_Layout.cshtml`)

```
<body class="header-fixed main home1">
  .preloader
  #wrapper
    _Header
    @RenderBody()
    _Footer
  #scroll-top
```

### CSS caricati, nell'ordine

1. `/app/bootstrap/css/bootstrap.css` — Bootstrap **5.1.3**
2. `/app/swiper/swiper-bundle.min.css`
3. `/app/dist/app.css` — **il tema, compilato**
4. `/assets/fontawesome-free-6.4.2-web/css/all.min.css`
5. `https://unpkg.com/aos@2.3.1/dist/aos.css` — CDN esterna

### JS caricati, nell'ordine

`jquery.min.js`, `swiper-bundle.min.js`, `swiper.js`, `app.js`, `jquery.easing.js`,
`aos.js` (CDN), `parallax.js`, `jquery.magnific-popup.min.js`, `bootstrap.min.js`,
`count-down.js`, `countto.js`

Presente anche `https://code.highcharts.com/highcharts.js` nel `<head>`: **mai usato**, va
rimosso.

---

## 3. Pagine

### `/` — Home (`Index.cshtml`)

1. Hero `swiper.mySwiper` — 1 sola slide, immagine `my/uovo.jpg`, titolo _"Esplora il Gusto / Scopri l'Eleganza"_, CTA ancora `#about-resturant`
2. `<style>` inline `.menu-image-responsive` — serve solo a una sezione commentata (menù delle feste): **da non portare**
3. Partial `_eccellenza`
4. Sezione `about-restaurant#about-resturant` — _"Un Passato di Tradizione e Eccellenza"_, immagini `my/palazzo.png` e `my/scale.png`
5. Partial `_chef`
6. `s-couter` — 4 contatori: 1 menzione Michelin, +300 coperti, +1000 recensioni, +10 anni
7. `section.event` — 2 blocchi alternati: _"Esclusività in ogni Dettaglio"_ (`my/bicchiere.png`) e _"Rinnovare con Amore per la Storia e l'Arte"_ (`my/villa.jpg`)
8. Partial `_guidamichelin`
9. Partial `_Prenotazione`

Sezioni commentate presenti nel file (menù delle feste, booking form, newsletter): **non portate**.

> ⚠️ Il valore `data-to` dei contatori non coincide con il testo mostrato: `data-to="180"` per
> "+300" coperti e `data-to="1"` per la menzione. Il testo statico è quello corretto lato
> contenuto; in migrazione si allineano `data-to` e testo finale.

### `/storia` — Storia

1. `page-title.p-history` — titolo _"Storia"_
2. `about-restaurant` — _"Villa Salina: Una Riscoperta Gastronomica"_ + `my/villa.jpg`
3. `section.history` — timeline a 6 tappe: **1800**, **1875**, **2004**, **2016**, **2020**, **2021** (alternanza classe `s1`)
4. Partial `_guidamichelin`
5. `chef-restaurant` — testo restauro + `gallery-ig` con 5 immagini (`storia/exscale.png`, `storia/exfrontale.png`, `storia/excucina.png`, `storia/erbacce.png`, `about2.jpg`)
6. Partial `_Prenotazione`

### `/gallery` — Gallery

1. `page-title.p-gallery`
2. Due blocchi `portfolio-mansonry-main`, 12 immagini totali da `assets/images/gallery/`
3. Partial `_chef`
4. Partial `_eccellenza`

### `/prenotazioni` e `/contatti`

**I due file sono identici**, a parte `ViewData["Title"]`:

1. Hero `mySwiper` con CTA `tel:+390172911272` ("Chiama ora")
2. `section.location` — contatti, orari, indirizzo, CTA Google Maps, iframe mappa in grayscale
3. Partial `_eccellenza`

In migrazione restano **due rotte distinte** (i link interni puntano a entrambe) ma condividono
gli stessi componenti; cambiano solo i metadata.

---

## 4. Partial condivisi

| Partial          | Contenuto                                                                                                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `_Header`        | top-bar (email, indirizzo, telefono) + header bianco con logo `frame1.svg`, menu Home/Storia/Gallery/Contatti, CTA "PRENOTA UN TAVOLO", sidebar off-canvas, hamburger. Contiene un header alternativo `style-2` **interamente commentato** |
| `_Footer`        | 3 colonne: logo+social, "DOVE SIAMO", "MAPPA DEL SITO" + copyright Growe Srl                                                                                                                                                               |
| `_chef`          | Chef Ivo Druetta, `my/propietario.jpg`, CTA → `/storia`                                                                                                                                                                                    |
| `_eccellenza`    | 3 qualità (Eccellenza culinaria / Passione per l'ospitalità / Innovazione gastronomica) + due caroselli `imagesSwiper` da 3 immagini                                                                                                       |
| `_guidamichelin` | menzione Michelin, `my/bagna3.png`, link alla guida                                                                                                                                                                                        |
| `_Prenotazione`  | CTA "Cultura con Gusto" → `/prenotazioni`                                                                                                                                                                                                  |

### Difetti nel markup originale, da correggere in migrazione

- `_eccellenza`: tre `<p class="mb-3 h5">` chiusi con `</a>` invece di `</p>`
- `_eccellenza`: attributi `data-aos-duration` duplicati sullo stesso elemento
- `_eccellenza`: path immagini **relativi** (`assets/images/...`) → si rompono su rotte annidate
- `_Layout`: `<section>` con due attributi `style` (il secondo viene ignorato)
- `Index`/`Contatti`/`Prenotazioni`: hero con `./assets/images/...` (relativo)
- `_Header`: menu senza indicazione della pagina attiva
- `Storia`/`Gallery`: mix di path assoluti e relativi

---

## 5. Dati di contatto (fonte unica per `src/data/site.ts`)

| Campo                 | Valore                                                                                  |
| --------------------- | --------------------------------------------------------------------------------------- |
| Nome                  | Villa Salina — Cultura con Gusto                                                        |
| Indirizzo             | Via Santuario 25, 12033 Moretta (CN)                                                    |
| Telefono              | +39 0172 911272                                                                         |
| Email                 | info@villasalina.com                                                                    |
| Orari                 | Lunedì – Domenica, 08.00 – 00.00                                                        |
| Facebook              | https://www.facebook.com/p/Villa-Salina-Cultura-con-Gusto-100063585760219/?locale=it_IT |
| Instagram             | https://www.instagram.com/villasalina1895/                                              |
| Google Maps           | https://maps.app.goo.gl/6yhVdxEXwphhxW1J6                                               |
| Guida Michelin        | https://guide.michelin.com/it/it/piemonte/moretta_1797713/ristorante/villa-salina       |
| Chef                  | Ivo Druetta                                                                             |
| Coordinate (da embed) | ~44.7642 N, 7.5322 E                                                                    |

> Nota: `_Header` (blocco commentato) riporta orari diversi — _"Lunedì – Venerdì: 20.00 – 00.00 | Festivi: Aperto"_.
> Il valore **attivo** e usato in footer, contatti e sidebar è **Lunedì – Domenica 08.00 – 00.00**.

---

## 6. ⚠️ Deriva CSS: `dist/app.css` ≠ compilazione di `scss/app.scss`

Il file servito in produzione è `wwwroot/app/dist/app.css`. È stato **modificato a mano** dopo
l'ultima compilazione: ricompilando `scss/app.scss` con Dart Sass si ottengono **237 righe di
differenza**.

`dist/app.css` è la **fonte di verità**. Le modifiche vanno riportate nel sorgente SCSS.

### Differenze puntuali

| #   | Dove                                             | Sorgente SCSS                                          | `dist/app.css` (produzione)                                                                                     |
| --- | ------------------------------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| 1   | `@font-face`                                     | Audrey (`.otf`) + Cerebri Sans (`.ttf`)                | **aggiunti** `Inter-Regular.ttf` e `Inter-Medium.ttf`                                                           |
| 2   | tipografia globale                               | `font-family: "Audrey"` / `"CerebriSans"`              | **tutto sostituito con `"Inter"`**                                                                              |
| 3   | `.footer .widget h5::before/::after`             | linea a sinistra, 100 % × 1 px, `bottom: 15px`         | linea **centrata** `left:50% / translateX(-50%)`, 73 px × 2 px, `bottom: -14px` / `-15px`                       |
| 4   | `.location`                                      | `padding: 131px 0 188px`                               | `padding: 100px 0 100px`                                                                                        |
| 5   | `.s-formmail`                                    | `padding: 136px 0 235px`                               | `padding: 86px 0 135px`                                                                                         |
| 6   | `.booking`                                       | `section/booking.jpg` + `background-attachment: fixed` | `my/tavolo.jpg`, senza `fixed`                                                                                  |
| 7   | `.s-formmail` bg                                 | `section/s-form.jpg`                                   | `my/sofa.jpg`                                                                                                   |
| 8   | `.p-gallery`                                     | `section/bg-gallery.jpg`                               | `gallery.png`                                                                                                   |
| 9   | `.p-history`                                     | `section/bg-history.jpg`                               | `Foto-storica-moretta.jpg`                                                                                      |
| 10  | `.sidebar-content`                               | `background-color: #fff`                               | `background-color: black`                                                                                       |
| 11  | `.block-text .title::after`                      | `left: 0`                                              | `left: 50%` + `translateX(-50%)` + `text-align: center`                                                         |
| 12  | `.block-text.style-2 .title::after` (~riga 7616) | `left: auto; right: 0`                                 | centrato, 73 px × 2 px                                                                                          |
| 13  | coda del file                                    | —                                                      | blocco `/*Singh*/`: `@media (min-width:991px) { .header .main-nav { position:absolute; left:35% } }`            |
| 14  | coda del file                                    | —                                                      | blocco `/*Sam*/`: `@media (max-width:500px) { h2.title{font-size:28px} p.sub-title{font-size:15px!important} }` |

---

## 7. Inventario asset

| Cartella                                                                      | Peso    | Destino                                         |
| ----------------------------------------------------------------------------- | ------- | ----------------------------------------------- |
| `assets/images`                                                               | 32 MB   | **portata** (236 file)                          |
| `assets/font` (Audrey + Cerebri + Inter)                                      | ~2,5 MB | **portata**                                     |
| `assets/font/icon` (Font Awesome 5)                                           | 15 MB   | **scartata** — non referenziata                 |
| `assets/fontawesome-free` (legacy)                                            | 3,3 MB  | **scartata** — non referenziata                 |
| `assets/fontawesome-free-6.4.2-web/css` + `webfonts`                          | 1,6 MB  | **portata**                                     |
| `assets/fontawesome-free-6.4.2-web` (js, less, scss, svgs, sprites, metadata) | 26 MB   | **scartata**                                    |
| `app/bootstrap`                                                               | 7,4 MB  | sostituita da pacchetto npm                     |
| `app/js`                                                                      | 1,3 MB  | sostituita da React + npm                       |
| `app/scss`                                                                    | 645 KB  | **portata** (solo `.scss`)                      |
| `app/dist`, `app/css`                                                         | 667 KB  | riferimento per la riconciliazione, non portati |

Risparmio atteso: da **89 MB** a circa **36 MB**.

---

## 8. `app.js` — cosa è realmente usato

**Usato dal markup attuale:**
`headerFixed`, `mobileNav`, `.btn-side` toggle, `goTop`, `Preloader`, `flatCounter` (+ `countTo`),
`AOS.init`, `retinaLogo`.

**Codice morto** (nessun selettore corrispondente nelle 5 pagine):
`ajaxContactForm`, `ajaxSubscribe`, `alertBox`, `flatAccordion`, `flatAccordions2`, `tabs`,
`swiper_tab` / `swiper_tab2` / `swiper_tab3` (`.slider-3/4/5`), `dropdown`, `popupVideo`,
`sticky`, la ricerca `.search` / `.close-icon`.

**Swiper attivi:** solo `.mySwiper` (hero) e `.imagesSwiper` (eccellenza). Tutte le altre ~12
istanze in `swiper.js` sono inutilizzate.

`parallax.js`, `magnific-popup`, `count-down.js`, `jquery.easing.js`, `bootstrap.min.js`,
`apexcharts`, `chart.js`, `highcharts`: **nessun uso** → non portati.
