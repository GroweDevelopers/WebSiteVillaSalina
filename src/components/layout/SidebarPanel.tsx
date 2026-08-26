'use client'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/data/site'

/**
 * Pannello laterale con i contatti, aperto dal pulsante a tre righe.
 * Sostituisce il toggle su `.btn-side` che in app.js era gestito da jQuery.
 */
export function SidebarPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Chiude il pannello cliccando fuori o premendo Esc: nell'originale restava
  // aperto finche' non si ricliccava il pulsante.
  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <div className="sidebar-btn" ref={containerRef}>
      <button
        type="button"
        className={`btn-side${isOpen ? ' active' : ''}`}
        style={{ border: 0, background: 'transparent' }}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="sidebar-content"
        aria-label={isOpen ? 'Chiudi le informazioni di contatto' : 'Apri le informazioni di contatto'}
      >
        <span />
      </button>

      <div id="sidebar-content" className={`sidebar-content${isOpen ? ' active' : ''}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="mb-50" src="/assets/images/logogold.svg" alt={site.name} />
        <p className="mb-46">{site.description}</p>
        <h4 className="mb-11">{site.phone.short}</h4>
        <p className="mb-5p">{site.address.short}</p>
        <p className="mb-30">{site.email}</p>
        <div className="line" />
        <p>
          Orari:
          <br /> {site.openingHours.display}
        </p>
        <div className="line" />
        <ul className="list-social">
          <li>
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fa-brands fa-facebook-f" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} aria-label="Scrivici una email">
              <i className="fa-solid fa-envelope" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
