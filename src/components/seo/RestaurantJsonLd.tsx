import { site } from '@/data/site'

/**
 * Dati strutturati schema.org di tipo Restaurant.
 *
 * Servono a Google per mostrare indirizzo, orari, telefono e valutazione nella
 * scheda del locale: il progetto ASP.NET non ne aveva.
 */
export function RestaurantJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${site.url}/#restaurant`,
    name: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    telephone: site.phone.e164,
    email: site.email,
    image: [`${site.url}/assets/images/my/villa.jpg`, `${site.url}/assets/images/my/uovo.jpg`],
    servesCuisine: ['Piemontese', 'Italiana'],
    priceRange: '€€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.province,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '23:59',
      },
    ],
    employee: {
      '@type': 'Person',
      name: site.chef,
      jobTitle: 'Chef',
    },
    hasMap: site.links.googleMaps,
    sameAs: [site.social.facebook, site.social.instagram, site.links.michelinGuide],
    acceptsReservations: `${site.url}/prenotazioni`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
