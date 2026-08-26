'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import AOS from 'aos'

/**
 * Inizializza AOS, la libreria che anima gli elementi con `data-aos` mentre
 * entrano nel viewport.
 *
 * Rispetto all'originale c'e' una differenza necessaria: con la navigazione
 * lato client di Next il DOM cambia senza ricaricare la pagina, quindi AOS va
 * aggiornato a ogni cambio di rotta o le sezioni della pagina nuova
 * resterebbero invisibili.
 */
export function AosProvider() {
  const pathname = usePathname()

  useEffect(() => {
    AOS.init({ once: false })
  }, [])

  useEffect(() => {
    AOS.refreshHard()
  }, [pathname])

  return null
}
