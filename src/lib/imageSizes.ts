/**
 * Valore di `sizes` usato da tutte le fotografie del sito.
 *
 * Sembra una scorciatoia, ed e' invece la scelta corretta qui. Motivo:
 *
 * 1. Next serve `min(bucket scelto dal browser, larghezza del file sorgente)`.
 *    Nessuna immagine del sito supera i 1920 px, quindi con `100vw` su desktop
 *    arriva sempre il file alla sua risoluzione piena, su mobile una versione
 *    ridotta. Non si spreca banda: Next non ingrandisce mai oltre il sorgente.
 *
 * 2. Il guadagno di peso non viene dal ridimensionamento ma dalla **conversione
 *    in AVIF e WebP**, che vale l'80-90 % su queste fotografie. Quello resta
 *    tutto.
 *
 * 3. Un `sizes` in percentuale calibrato sulla larghezza del riquadro sembra
 *    piu' accurato ma sbaglia su tutte le immagini con `object-fit: cover` —
 *    caroselli, riquadri della gallery, foto dello chef. Li' l'immagine viene
 *    scalata per **coprire** il riquadro, quindi la risoluzione necessaria e'
 *    maggiore della larghezza del riquadro, e la foto esce sfocata.
 *    Misurato con `tools/visual-check/imgquality.mjs`: con i `sizes` calibrati,
 *    107 immagini su 259 venivano servite a risoluzione piu' bassa di quella
 *    del sito originale.
 *
 * Se un giorno si vorranno `sizes` piu' fini, vanno calcolati sulla
 * risoluzione **necessaria** (che per `object-fit: cover` dipende anche
 * dall'altezza del riquadro) e verificati con quello script.
 */
export const IMAGE_SIZES = '100vw'
