/**
 * Impostazioni condivise da tutte le fotografie servite con `next/image`.
 */

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
 * 2. Un `sizes` in percentuale calibrato sulla larghezza del riquadro sembra
 *    piu' accurato ma sbaglia su tutte le immagini con `object-fit: cover` —
 *    caroselli, riquadri della gallery, foto dello chef. Li' l'immagine viene
 *    scalata per **coprire** il riquadro, quindi la risoluzione necessaria e'
 *    maggiore della larghezza del riquadro, e la foto esce sfocata.
 *    Misurato con `tools/visual-check/imgquality.mjs`: con i `sizes` calibrati,
 *    107 immagini su 259 venivano servite a risoluzione piu' bassa di quella
 *    del sito originale.
 */
export const IMAGE_SIZES = '100vw'

/**
 * Qualita' di compressione delle fotografie.
 *
 * 95, non il 75 predefinito. Su un sito di ristorante le foto dei piatti sono
 * il prodotto: a 75 la panatura di una cotoletta diventa una macchia.
 * Confronto a 4 ingrandimenti sulla stessa porzione di `gallery/cotolette.png`,
 * il cui originale PNG pesa 335 KB:
 *
 * | formato   | peso  | resa                                    |
 * |-----------|-------|-----------------------------------------|
 * | WebP q82  | 36 KB | texture ammorbidita                     |
 * | WebP q88  | 47 KB | ancora leggermente morbida              |
 * | WebP q92  | 57 KB | molto vicina                            |
 * | **WebP q95** | **69 KB** | **indistinguibile dall'originale** |
 *
 * Il valore deve comparire in `images.qualities` dentro `next.config.ts`:
 * Next 16 rifiuta le qualita' non dichiarate e restituisce una risposta vuota.
 */
export const IMAGE_QUALITY = 95
