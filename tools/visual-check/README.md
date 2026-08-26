# visual-check — confronto con il sito ASP.NET originale

Strumenti che mettono affiancati il sito Next.js e il vecchio sito ASP.NET e ne misurano le
differenze. Sono serviti a validare la migrazione e restano qui per poter rifare la verifica
dopo qualsiasi modifica agli stili o ai componenti.

## Preparazione

Servono **due server accesi contemporaneamente**:

```bash
# terminale 1 — sito originale ASP.NET
cd C:/Users/Samar/source/repos/WebSiteVillaSalina/WebSiteVillaSalina
dotnet run --no-launch-profile --urls http://localhost:4320

# terminale 2 — sito Next.js
cd <questo repo>
npm run build && npx next start -p 4310

# terminale 3 — strumenti
cd tools/visual-check
npm run setup      # installa le dipendenze e scarica Chromium
```

Le porte sono fissate negli script: `4320` = vecchio, `4310` = nuovo.

## I quattro controlli

### 1. Testo visibile — `npm run text`

Estrae `document.body.innerText` da tutte e cinque le pagine, normalizza gli spazi e confronta.
È il controllo più severo sui contenuti: intercetta un apostrofo diverso, una parola mancante,
un accento sbagliato.

```bash
npm run text
diff t2-old.txt t2-new.txt      # atteso: nessuna differenza
```

### 2. Geometria delle sezioni — `node measure.mjs <rotta> <larghezza>`

Per ogni sezione principale confronta la posizione verticale assoluta e l'altezza.
È il controllo che ha fatto emergere sia il problema delle immagini senza dimensioni sia il
padding delle colonne di Bootstrap.

```bash
node measure.mjs / 1920
node measure.mjs /storia 390
```

Le colonne `Δtop` e `Δh` devono essere tutte a zero. Le righe con scarto sono marcate `**`.

### 3. Riquadro di ogni elemento — `npm run boxes`

Il controllo piu' completo. Per **ogni elemento visibile** del DOM confronta posizione
orizzontale, posizione verticale, larghezza e altezza, su tutte le pagine e tre viewport.
Esce con codice 1 se qualcosa si sposta di piu' di 2 px.

```bash
npm run boxes
# 2165 elementi confrontati su 3176, 0 fuori posto oltre i 2 px
```

Esiste perche' misurare solo le altezze non bastava: i caroselli hanno altezza fissa, e restavano
perfetti in verticale anche mostrando una slide su tre.

### 4. Screenshot e altezze — `npm run shots`

Fotografa ogni pagina a piena altezza su tre viewport (1920, 768, 390), confronta le altezze
totali e segnala le risorse che rispondono con un errore.

Durante lo scatto disattiva le animazioni, forza il caricamento immediato delle immagini
(altrimenti quelle in differita restano vuote nello screenshot) e nasconde i caroselli in loop,
che partono da slide diverse a seconda della versione di Swiper.

### 5. Differenza al pixel — `npm run pixels`

Confronta gli screenshot generati dal punto 3 e scrive un `-diff.png` per ogni pagina che
supera lo 0,05 %.

## Come leggere i risultati

Al momento della migrazione il confronto dava:

| controllo | esito |
|---|---|
| testo visibile, 5 pagine | **nessuna differenza** |
| riquadro di ogni elemento | **2165 su 2165 allineati** |
| geometria, 5 pagine × 3 viewport | **15 su 15 identiche** |
| posizione e altezza di ogni sezione | **tutte a zero** |
| differenza al pixel | **da 0,005 % a 0,12 %** |

Lo scarto al pixel residuo non è un difetto: corrisponde alle tre aggiunte volute
(voce di menu attiva evidenziata, linee decorative dei titoli del footer centrate) più il
ricampionamento delle fotografie, impercettibile a occhio.

**Se dopo una modifica il testo o la geometria non tornano a zero, è una regressione.**

## Strumenti di supporto

| file | a cosa serve |
|---|---|
| `diffrows.mjs a.png b.png` | elenca le fasce orizzontali di pixel che differiscono: dice *dove* guardare |
| `crop.mjs src out y h [x w]` | ritaglia una porzione di screenshot |
| `sidebyside.mjs a.png b.png out.png` | affianca due ritagli per il confronto visivo |
| `stats.mjs a.png b.png x y w h` | scarto medio e massimo per canale in una regione |
| `npm run swiper` | posizione e contenuto di ogni slide dei caroselli, sui due siti |
| `npm run images` | risoluzione reale servita per ogni immagine, sui due siti |
| `npm run perf` | peso e numero di richieste per pagina |
| `npm run a11y` | audit di accessibilita' con axe |
