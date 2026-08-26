# Verifica di parità con il sito originale

Il sito ASP.NET e il sito Next.js sono stati fatti girare **contemporaneamente** e confrontati
con quattro controlli automatici. Gli strumenti sono in [`tools/visual-check`](../tools/visual-check)
e si possono rieseguire in qualsiasi momento.

```
ASP.NET Core 8   →  http://localhost:4320
Next.js 16       →  http://localhost:4310
```

---

## 1. Testo visibile — nessuna differenza

`document.body.innerText` di tutte e cinque le pagine, spazi normalizzati.

```
$ diff t2-old.txt t2-new.txt
$ echo $?
0
```

✅ **Zero differenze** su Home, Storia, Gallery, Contatti, Prenotazioni.

È il controllo che ha fatto emergere tre apostrofi tipografici (`’`) entrati al posto di quelli
dritti (`'`) durante il travaso dei testi. Corretti.

## 2. Geometria delle sezioni — tutte allineate

Per ogni sezione principale (`.top-bar`, `#header_main`, `.mySwiper`, `.page-title`,
`.chef-restaurant`, `.list-img`, `.about-restaurant`, `.s-chef`, `.s-couter`, `.event`,
`.testimonials`, `.history`, `.portfolio-mansonry`, `.location`, `.gallery-ig`, `.s-formmail`,
`footer`) sono state confrontate posizione verticale assoluta e altezza, a 1920 px e a 390 px.

✅ **Ogni sezione, su ogni pagina, a Δtop = 0 e Δh = 0.**

## 3. Altezza delle pagine — 15 su 15 identiche

| rotta           | desktop 1920 |    tablet 768 |    mobile 390 |
| --------------- | -----------: | ------------: | ------------: |
| `/`             |  7916 = 7916 | 10613 = 10613 | 11744 = 11744 |
| `/storia`       |  7058 = 7058 |   9283 = 9283 | 10275 = 10275 |
| `/gallery`      |  7787 = 7787 |   9059 = 9059 | 12215 = 12215 |
| `/contatti`     |  4020 = 4020 |   5116 = 5116 |   5470 = 5470 |
| `/prenotazioni` |  4020 = 4020 |   5116 = 5116 |   5470 = 5470 |

✅ **Scarto zero in tutte e quindici le combinazioni.**

## 4. Riquadro di ogni elemento — 2165 su 2165 allineati

Per ogni elemento visibile del DOM vengono confrontati posizione orizzontale, posizione
verticale, larghezza e altezza, su 5 pagine per 3 viewport.

```
$ cd tools/visual-check && npm run boxes
/ @1920px        187/295 elementi accoppiati  ->  ok
…
2165 elementi confrontati su 3176, 0 fuori posto oltre i 2 px
```

Gli elementi non accoppiati sono quelli che esistono solo da una parte, per scelta: i pulsanti
diventati `<button>`, il menu mobile che non sposta piu' nodi, lo spaziatore dell'header fisso.

Questo controllo e' nato **dopo** aver lasciato passare un difetto vero (vedi sotto): serviva
qualcosa che guardasse anche l'asse orizzontale.

## 5. Differenza al pixel — fra 0,005 % e 0,12 %

| pagina       | desktop |  tablet |  mobile |
| ------------ | ------: | ------: | ------: |
| home         | 0,124 % | 0,016 % | 0,030 % |
| storia       | 0,006 % | 0,005 % | 0,009 % |
| gallery      | 0,013 % | 0,019 % | 0,029 % |
| contatti     | 0,025 % | 0,034 % | 0,068 % |
| prenotazioni | 0,023 % | 0,034 % | 0,068 % |

Lo scarto residuo è stato aperto e guardato uno per uno. Viene da tre sole cose:

| dove                              | cosa                      | perché                                                                        |
| --------------------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| 2 px sotto la voce di menu attiva | linea dorata              | **aggiunta voluta**: nell'originale non si capiva in che pagina si fosse      |
| 3 px sotto i titoli del footer    | linea decorativa centrata | **già presente nell'originale**, riportata dal CSS di produzione nel sorgente |
| fotografie                        | ricampionamento           | scarto medio 8/255, impercettibile: i ritagli affiancati sono indistinguibili |

Sull'intera pagina `/contatti` a 1920 px lo scarto medio per canale è **0,04 su 255**.

## Risorse mancanti

|                | 404 / errori                                                   |
| -------------- | -------------------------------------------------------------- |
| sito originale | `https://code.highcharts.com/highcharts.js` su tutte le pagine |
| sito nuovo     | **nessuno**                                                    |

Highcharts era caricato dal `<head>` del layout Razor e non veniva mai usato: non è stato portato.

---

## Difetti trovati e corretti grazie a questi controlli

### Immagini in differita senza dimensioni

Avevo aggiunto `loading="lazy"` senza `width` e `height`. Finché il file non arrivava, l'immagine
occupava zero pixel: la sezione della menzione Michelin perdeva **70 px** e la pagina sobbalzava
durante lo scorrimento. Ora ogni immagine dichiara le proprie dimensioni intrinseche e il browser
riserva lo spazio in anticipo — il difetto è sparito e ne guadagna anche il punteggio di
stabilità visiva.

### I caroselli mostravano una slide su tre

**Difetto sfuggito ai primi controlli, segnalato dall'utente.**

Swiper fino alla versione 10 costruiva il loop **duplicando le slide**: con 3 immagini ne
generava 9, e la striscia risultava piena. Dalla 11 il loop e' implementato spostando le slide
reali, e se non ce ne sono almeno il doppio di quelle visibili
(`slidesPerView: 2.42` → ne servono 5) smette di funzionare **senza segnalare niente**.

Risultato: restavano le 3 slide originali, di cui una sola dentro lo schermo, e i due terzi
destri della striscia erano vuoti. Si vedeva su home, gallery, contatti e prenotazioni.

Perche' non l'avevo visto:

1. La striscia ha `height: 459px` **fissa**. Con una slide o con nove, l'altezza della sezione e
   della pagina non cambiava di un pixel: il controllo sulla geometria verticale tornava perfetto.
2. Nel confronto al pixel avevo aggiunto `.imagesSwiper { visibility: hidden }`, perche' i due
   Swiper partivano da slide diverse e sporcavano il risultato. Ho mascherato proprio la cosa
   rotta invece di indagarla.

Correzione: la sequenza di immagini viene ripetuta finche' non ci sono abbastanza slide, che e'
esattamente quello che faceva da solo il vecchio Swiper. Le posizioni tornano identiche, `transform`
del wrapper compresa (`-1816.86px` su entrambi i siti).

Per non ripetere l'errore e' stato aggiunto `boxes.mjs`, che confronta il riquadro di ogni
elemento, e la maschera sui caroselli e' stata rimossa.

### Il padding delle colonne di Bootstrap

Nel progetto ASP.NET anche `bootstrap.css` era stato modificato a mano: in 11.265 righe l'unica
differenza rispetto al pacchetto ufficiale 5.1.3 è

```css
.row > * {
  padding-right: 15px; /* invece di calc(var(--bs-gutter-x) * .5) = 12px */
  padding-left: 15px;
}
```

Senza riprodurla, ogni colonna del sito era larga 6 px in più: impercettibile a occhio, ma
sufficiente a far scendere di 4 px il fondo di due pagine. La regola è ora in
`src/styles/_next-adjustments.scss`.

---

## Differenze volute rispetto all'originale

Sono tutte migliorie, elencate qui perché non siano scambiate per regressioni.

| #   | Cosa                                                            | Perché                                                                                                                     |
| --- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1   | La voce di menu della pagina corrente è evidenziata             | l'originale non dava alcun riscontro di dove si fosse                                                                      |
| 2   | Il titolo principale di ogni pagina è un `<h1>` (era `<h2>`)    | nessuna pagina aveva un titolo di primo livello; le dimensioni sono invariate                                              |
| 3   | I contatori animano da zero allo scorrimento                    | l'originale lo prevedeva (`data-to`, `data-speed`) ma non partiva mai, perché al `body` mancava la classe `counter-scroll` |
| 4   | Telefono e email nella pagina contatti sono link                | si può chiamare o scrivere con un tocco da telefono                                                                        |
| 5   | Le immagini sotto la prima schermata si caricano in differita   | l'originale le scaricava tutte subito                                                                                      |
| 6   | Il pannello laterale si chiude con Esc o cliccando fuori        | prima restava aperto finché non si ricliccava il pulsante                                                                  |
| 7   | I pulsanti sono `<button>`, non `<a>` senza `href`              | raggiungibili da tastiera e annunciati dai lettori di schermo                                                              |
| 8   | Tutte le immagini hanno un `alt` descrittivo                    | nell'originale erano tutti vuoti                                                                                           |
| 9   | La mappa ha un `title`                                          | i lettori di schermo annunciavano solo "iframe"                                                                            |
| 10  | Niente Highcharts, jQuery, magnific-popup, parallax, apexcharts | codice mai usato: circa 1,3 MB di JavaScript in meno                                                                       |
