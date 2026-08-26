# Accessibilità

Controllo eseguito con [axe-core](https://github.com/dequelabs/axe-core) su tutte e cinque le
pagine, regole `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` e `best-practice`.

```bash
cd tools/visual-check
npm run a11y        # sito Next.js
npm run a11y:old    # sito ASP.NET originale, per confronto
```

## Risultato

| | elementi con problemi | tipi di violazione per pagina |
|---|---:|---:|
| sito ASP.NET originale | **95** | 6 – 7 |
| sito Next.js | **29** | 2 |

**−70 %.** I 29 rimasti sono due soli difetti, entrambi ereditati dal design del tema e presenti
identici nell'originale. Richiedono una decisione sull'aspetto grafico, quindi non sono stati
cambiati di iniziativa: le correzioni sono pronte qui sotto.

## Problemi risolti nella migrazione

| regola | quante volte | come |
|---|---:|---|
| `link-name` — link senza testo leggibile | **6 per pagina** | i link social erano `<a>` con dentro solo un `<i>` di Font Awesome: per un lettore di schermo erano link vuoti. Ora ognuno ha `aria-label` ("Facebook", "Instagram", "Scrivici una email") e l'icona è `aria-hidden` |
| `landmark-one-main` — manca il landmark principale | 1 – 2 per pagina | il contenuto è ora dentro `<main>` |
| `page-has-heading-one` — manca il titolo di primo livello | 1 – 2 per pagina | testata e slider di apertura usano `<h1>`, con le stesse dimensioni di prima |
| `frame-title` — iframe senza nome | 1 (Contatti, Prenotazioni) | la mappa ha un `title` che dice cosa mostra |
| `region` — contenuti fuori dai landmark | da 8 a 3 per pagina | la barra contatti in alto è un `region` etichettato; il resto è rientrato in `main`, `header`, `footer`, `nav` |

Oltre a queste, e non misurate da axe perché richiedono l'interazione:

- **Hamburger e pulsante del pannello laterale** erano `<a>` senza `href`: non raggiungibili da
  tastiera, invisibili ai lettori di schermo. Ora sono `<button type="button">` con
  `aria-expanded`, `aria-controls` ed etichetta che cambia fra "Apri" e "Chiudi".
- **Il pulsante torna su** era un `<a>` vuoto sempre presente nel giro di tabulazione anche da
  invisibile. Ora è un `<button>` con `tabIndex={-1}` e `aria-hidden` finché non compare.
- **Il pannello laterale** si chiude con Esc e cliccando fuori.
- **Le immagini** hanno tutte un `alt` descrittivo: nell'originale erano tutti vuoti. Quelle
  puramente decorative (icone) hanno `alt=""` e `aria-hidden`, che è la scelta corretta.
- **La voce di menu della pagina corrente** ha `aria-current="page"`.
- **I link esterni** hanno `rel="noopener noreferrer"`.
- **I contatori** rispettano `prefers-reduced-motion`.

## I due difetti che restano

### 1. Contrasto insufficiente nel copyright del footer — `serious`

```
contrasto 3.08:1 — testo #666666 su fondo #0e1927
richiesto 4.5:1 per WCAG AA
```

Riguarda la riga «© Copyright Villa Salina by Growe Srl» in fondo a ogni pagina. Il footer
imposta `color: #fff` su tutti i suoi paragrafi tranne quelli in `.bottom-footer`, che ereditano
il grigio del `body`: sembra una dimenticanza più che una scelta.

**Correzione, se approvata:** in `src/styles/component/footer.scss`, dentro `.footer`

```scss
.bottom-footer {
    p,
    a {
        color: #fff;      /* contrasto 15.9:1 */
    }
}
```

Un'alternativa più discreta è `#a8a8a8` (contrasto 6.4:1), che resta più tenue del resto del
footer ma passa AA.

### 2. Salti nella gerarchia dei titoli — `moderate`

Da 3 a 4 punti per pagina in cui a un `<h3>` segue direttamente un `<h5>` o un `<h6>`, saltando
un livello. È la struttura del tema:

| dove | sequenza |
|---|---|
| sezione Chef | `h3` "Eccellenza Gastronomica" → `h5` "IVO DRUETTA" |
| pagina Storia | `h3` "Villa Salina: Una Riscoperta…" → `h5` sottotitolo |
| sezione Michelin | `h3` "Una menzione…" → `h5` attorno al pulsante |
| footer | `h3` della pagina → `h5` "DOVE SIAMO" |

Non è stato corretto perché cambiare il tag cambia il corpo del carattere: nel tema `h4` è 28 px,
`h5` 17 px. Portare "IVO DRUETTA" da `h5` a `h4` lo ingrandirebbe del 65 %.

**Correzioni possibili, in ordine di rischio crescente:**

1. Dove l'elemento non è davvero un titolo — il nome dello chef sotto la foto è una didascalia,
   l'`h5` attorno al pulsante "VISUALIZZA GUIDA" è solo un contenitore — toglierlo dalla gerarchia:

   ```tsx
   <p className="h5">{site.chef.toUpperCase()}</p>
   ```

   Va accompagnato dall'adeguamento dei selettori nel tema (`.chef-box .info h5` → `.chef-box .info .h5`).

2. Dove è un titolo vero (il sottotitolo della pagina Storia, i titoli del footer), usare il
   livello corretto e riportare le dimensioni in `_next-adjustments.scss`, come già fatto per
   `h1.title`.

## Cosa non è stato verificato automaticamente

axe copre circa un terzo dei criteri WCAG. Restano da provare a mano:

- navigazione completa da sola tastiera, incluso il menu mobile
- lettura con NVDA o VoiceOver
- ingrandimento al 200 % senza scorrimento orizzontale
- visibilità del focus su tutti gli elementi interattivi (il tema non definisce uno stile di
  focus proprio: si vede l'anello predefinito del browser, il che è accettabile ma migliorabile)
