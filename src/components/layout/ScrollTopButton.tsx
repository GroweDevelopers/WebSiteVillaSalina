'use client'

import { useEffect, useState } from 'react'

/** Oltre questo scroll compare il pulsante (`goTop()` in app.js). */
const SHOW_FROM = 800

/** Pulsante che riporta in cima alla pagina. */
export function ScrollTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        setIsVisible(window.scrollY > SHOW_FROM)
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <button
      type="button"
      id="scroll-top"
      className={isVisible ? 'show' : undefined}
      style={{ border: 0, padding: 0, background: 'transparent' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      aria-label="Torna all'inizio della pagina"
    />
  )
}
