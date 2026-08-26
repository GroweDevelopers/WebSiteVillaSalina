/**
 * Dati anagrafici del ristorante.
 *
 * Unica fonte per contatti, indirizzo, orari e link social: nel progetto Razor
 * erano ripetuti in header, footer, sidebar e pagina contatti, con orari che in
 * un punto divergevano. Qui stanno scritti una volta sola.
 */

export const site = {
  name: 'Villa Salina',
  tagline: 'Cultura con Gusto',
  legalName: 'Villa Salina',
  url: 'https://www.villasalina.com',

  description:
    'Entra nel nostro mondo culinario dove tradizione e raffinatezza si fondono in piatti unici. ' +
    "Ti attende un'esperienza gastronomica indimenticabile, dove ogni dettaglio è curato con passione.",

  chef: 'Ivo Druetta',

  address: {
    street: 'Via Santuario 25',
    city: 'Moretta',
    province: 'CN',
    postalCode: '12033',
    country: 'IT',
    /** Come compare in header e pagina contatti */
    inline: 'Via Santuario, 25 - 12033 Moretta (CN)',
    /** Come compare in footer e sidebar */
    short: 'Via Santuario 25 Moretta, 12033 CN',
    /** Come compare nella scheda contatti */
    contact: 'Via Santuario 25, Moretta CN 12033',
  },

  geo: {
    latitude: 44.7641908,
    longitude: 7.5321945,
  },

  phone: {
    /** Formato per l'attributo href */
    href: 'tel:+390172911272',
    /** Formato esteso mostrato in header e footer */
    display: '+39 0172 911272',
    /** Formato breve mostrato in sidebar e pagina contatti */
    short: '0172 911272',
    /** Formato E.164 per i dati strutturati */
    e164: '+390172911272',
  },

  email: 'info@villasalina.com',

  openingHours: {
    /** Testo mostrato in pagina */
    display: 'Lunedì - Domenica : 08.00 - 00.00',
    /** Formato schema.org */
    schema: 'Mo-Su 08:00-24:00',
  },

  social: {
    facebook:
      'https://www.facebook.com/p/Villa-Salina-Cultura-con-Gusto-100063585760219/?locale=it_IT',
    instagram: 'https://www.instagram.com/villasalina1895/',
  },

  links: {
    googleMaps: 'https://maps.app.goo.gl/6yhVdxEXwphhxW1J6',
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1684.401781047379!2d7.532194477582247!3d44.76419082398396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47881de46efca0f3%3A0xcd792000dab0da47!2sRistorante%20Villa%20Salina!5e0!3m2!1sit!2sit!4v1713948735913!5m2!1sit!2sit',
    michelinGuide:
      'https://guide.michelin.com/it/it/piemonte/moretta_1797713/ristorante/villa-salina',
    agency: 'https://growe.dev',
  },
} as const
