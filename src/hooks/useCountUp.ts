'use client'

import { useEffect, useRef, useState } from 'react'

/** Durata dell'animazione, come il `data-speed` del markup originale. */
const DURATION_MS = 2000

/**
 * Conta da zero al valore finale quando l'elemento entra nel viewport.
 *
 * Nel progetto originale l'animazione era prevista (`data-to`, `data-speed`,
 * `data-inviewport` sul markup) ma non partiva mai: `flatCounter()` in app.js
 * si attivava solo con la classe `counter-scroll` sul body, che non c'era.
 *
 * Il valore restituito parte gia' dal totale, cosi' il render sul server e chi
 * ha JavaScript disattivato vedono il numero giusto. L'animazione parte solo se
 * l'elemento e' ancora fuori dallo schermo al mount: se e' gia' visibile
 * resterebbe il salto dal totale a zero, che e' peggio del non animare.
 */
export function useCountUp(target: number): {
  ref: React.RefObject<HTMLSpanElement | null>
  value: number
} {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(target)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = element.getBoundingClientRect()
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0
    if (alreadyVisible) return

    let frame = 0
    let start = 0

    const step = (now: number) => {
      if (!start) start = now
      const progress = Math.min((now - start) / DURATION_MS, 1)
      // easing out: rallenta verso il valore finale
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(target * eased))
      if (progress < 1) frame = window.requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry?.isIntersecting) return
        observer.disconnect()
        setValue(0)
        frame = window.requestAnimationFrame(step)
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => {
      observer.disconnect()
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [target])

  return { ref, value }
}
