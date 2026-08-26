'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SidebarPanel } from '@/components/layout/SidebarPanel'
import { bookingHref, mainNav } from '@/data/navigation'
import { site } from '@/data/site'
import { useHeaderFixed } from '@/hooks/useHeaderFixed'

export function Header() {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { headerRef, isFixed, isSmall, spacerHeight } = useHeaderFixed()

  // Cambiando pagina il menu mobile deve richiudersi: senza router lato client
  // il problema nell'originale non esisteva. Lo stato si azzera durante il
  // render, non in un effetto, per evitare un secondo giro di rendering.
  const [renderedPathname, setRenderedPathname] = useState(pathname)
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname)
    setIsMobileNavOpen(false)
  }

  const isCurrent = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))

  const menuItems = mainNav.map((item) => (
    <li key={item.href} className={`menu-item${isCurrent(item.href) ? ' current-menu-item' : ''}`}>
      <Link
        style={{ color: 'black' }}
        href={item.href}
        aria-current={isCurrent(item.href) ? 'page' : undefined}
      >
        {item.label}
      </Link>
    </li>
  ))

  const headerClasses = ['header', 'style-1', isFixed && 'is-fixed', isSmall && 'is-small']
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <header
        ref={headerRef}
        style={{ backgroundColor: 'white' }}
        id="header_main"
        className={headerClasses}
      >
        <div className="container">
          <div id="site-header-inner">
            <div className="header__logo">
              <Link href="/">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/images/frame1.svg" alt={`${site.name} Ristorante`} />
              </Link>
            </div>

            <nav id="main-nav" className="main-nav" aria-label="Menu principale">
              <ul id="menu-primary-menu" className="menu">
                {menuItems}
              </ul>
            </nav>

            <Link style={{ color: 'black' }} href={bookingHref} className="tf-button style1">
              PRENOTA UN TAVOLO
            </Link>

            <SidebarPanel />

            <button
              type="button"
              className={`mobile-button${isMobileNavOpen ? ' active' : ''}`}
              style={{ border: 0, padding: 0 }}
              onClick={() => setIsMobileNavOpen((open) => !open)}
              aria-expanded={isMobileNavOpen}
              aria-controls="main-nav-mobi"
              aria-label={isMobileNavOpen ? 'Chiudi il menu' : 'Apri il menu'}
            >
              <span />
            </button>
          </div>
        </div>

        {isMobileNavOpen && (
          <nav id="main-nav-mobi" aria-label="Menu principale">
            <ul className="menu">{menuItems}</ul>
          </nav>
        )}
      </header>

      {/* Compensa lo spazio lasciato dall'header quando passa a position: fixed. */}
      <div
        aria-hidden="true"
        style={{ height: spacerHeight ?? 0, display: isFixed ? 'block' : 'none' }}
      />
    </>
  )
}
