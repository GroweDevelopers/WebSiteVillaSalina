'use client'

import { useEffect, useRef, useState } from 'react'

/** Oltre questo scroll l'header diventa fisso (`headerFixed()` in app.js). */
const FIXED_FROM = 200
/** Oltre questo scroll l'header compare e si rimpicciolisce. */
const SMALL_FROM = 300

type HeaderFixedState = {
  /** Da assegnare a `<header id="header_main">` */
  headerRef: React.RefObject<HTMLElement | null>
  isFixed: boolean
  isSmall: boolean
  /**
   * Altezza dello spaziatore da rendere subito dopo l'header, per compensare
   * lo spazio che l'header lascia quando passa a `position: fixed`.
   * `null` finche' l'altezza non e' stata misurata.
   */
  spacerHeight: number | null
}

/**
 * Replica `headerFixed()` di app.js: aggiunge `is-fixed` oltre i 200 px di
 * scroll e `is-small` oltre i 300 px, inserendo uno spaziatore alto quanto
 * l'header per evitare il salto del contenuto.
 */
export function useHeaderFixed(): HeaderFixedState {
  const headerRef = useRef<HTMLElement | null>(null)
  const [isFixed, setIsFixed] = useState(false)
  const [isSmall, setIsSmall] = useState(false)
  const [spacerHeight, setSpacerHeight] = useState<number | null>(null)

  useEffect(() => {
    // L'altezza va letta mentre l'header e' ancora nel flusso, come faceva
    // jQuery al DOM ready.
    const header = headerRef.current
    if (header) setSpacerHeight(header.offsetHeight)

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY
        setIsFixed(y > FIXED_FROM)
        setIsSmall(y > SMALL_FROM)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return { headerRef, isFixed, isSmall, spacerHeight }
}
