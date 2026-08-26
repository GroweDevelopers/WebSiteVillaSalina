'use client'

import { useEffect, useState } from 'react'

/**
 * Segue una media query CSS.
 *
 * Durante il render sul server e alla prima idratazione restituisce sempre
 * `false`, cosi' il markup del client coincide con quello del server; il valore
 * reale arriva subito dopo il mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const list = window.matchMedia(query)
    const update = () => setMatches(list.matches)

    update()
    list.addEventListener('change', update)
    return () => list.removeEventListener('change', update)
  }, [query])

  return matches
}
