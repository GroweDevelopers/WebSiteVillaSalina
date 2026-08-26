'use client'

import { useEffect, useState } from 'react'

/** Durata della schermata di caricamento, come il delay in app.js. */
const HIDE_AFTER_MS = 1000

/**
 * Schermata bianca mostrata al caricamento.
 * Replica `Preloader()` di app.js: aggiunge `page-loaded` al body e rimuove il
 * velo dopo un secondo.
 */
export function Preloader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    document.body.classList.add('page-loaded')
    const timer = window.setTimeout(() => setIsVisible(false), HIDE_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="preloader" aria-hidden="true">
      <div className="clear-loading loading-effect-2">
        <span />
      </div>
    </div>
  )
}
