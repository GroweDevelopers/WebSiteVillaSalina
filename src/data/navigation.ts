import type { NavItem } from '@/types'

/** Voci del menu principale, nell'ordine dell'header originale. */
export const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Storia', href: '/storia' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contatti', href: '/contatti' },
]

/** Voci della mappa del sito nel footer. */
export const footerNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Storia', href: '/storia' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Prenotazioni', href: '/prenotazioni' },
]

/** Rotta della call to action "Prenota un tavolo". */
export const bookingHref = '/prenotazioni'
