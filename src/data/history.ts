import type { HistoryStep } from '@/types'

/** Le sei tappe della timeline nella pagina Storia. */
export const historySteps: HistoryStep[] = [
  {
    year: '1800',
    title: 'Fondazione e Splendore',
    text:
      "Villa Salina, un gioiello architettonico, sorge con magnificenza nel cuore dell'Ottocento, " +
      'arricchendo il paesaggio con la sua maestosità e bellezza artistica.',
    image: {
      src: '/assets/images/storia/spinaci.png',
      alt: 'Piatto di spinaci servito a Villa Salina',
    },
  },
  {
    year: '1875',
    title: "Edoardo Salina e l'Eredità Culinarie",
    text:
      "L'illustre cuoco di corte Edoardo Salina, ispira il nome e il prestigio gastronomico di " +
      'Villa Salina, portando avanti una tradizione culinaria di fama regale.',
    image: {
      src: '/assets/images/storia/tavololimoni.png',
      alt: 'Tavolo apparecchiato con limoni nella sala di Villa Salina',
    },
  },
  {
    year: '2004',
    title: 'Antica Pasticceria al Cuore',
    text:
      'Dalla rinomata Antica Pasticceria del Castello, la famiglia distingue la propria esperienza ' +
      'nel settore alimentare, preparando il terreno per la nascita di Villa Salina.',
    image: {
      src: '/assets/images/storia/pastona.png',
      alt: 'Pasta fresca preparata a mano',
    },
  },
  {
    year: '2016',
    title: 'Ristrutturazione con Rispetto e Passione',
    text:
      "Con l'attenzione ai dettagli e l'amore per la storia, Villa Salina è stata ristrutturata con " +
      'maestria, preservando il suo patrimonio artistico e architettonico per le generazioni future.',
    image: {
      src: '/assets/images/storia/tavololimoni.png',
      alt: 'Dettaglio di una sala restaurata di Villa Salina',
    },
  },
  {
    year: '2020',
    title: 'Inaugurazione: Un Evento Indimenticabile',
    text:
      'Nel 2020, Villa Salina apre le sue porte con una cerimonia sontuosa, accogliendo ospiti e ' +
      'autorità locali in un’atmosfera di festa e raffinatezza.',
    image: {
      src: '/assets/images/storia/pastona.png',
      alt: 'Piatto di pasta servito la sera dell’inaugurazione',
    },
  },
  {
    year: '2021',
    title: 'Un Nuovo Capitolo di Eccellenza',
    text:
      'Villa Salina si rinnova, mantenendo intatto il suo splendore originale, pronto a scrivere ' +
      'nuove pagine di eccellenza gastronomica e ospitalità.',
    image: {
      src: '/assets/images/storia/tavololimoni.png',
      alt: 'Sala di Villa Salina dopo il rinnovamento',
    },
  },
]

/** Foto del restauro mostrate nella galleria "prima e dopo" della pagina Storia. */
export const restorationGallery = {
  left: {
    src: '/assets/images/storia/exscale.png',
    alt: 'Lo scalone di Villa Salina prima del restauro',
  },
  topLeft: {
    src: '/assets/images/storia/exfrontale.png',
    alt: 'La facciata di Villa Salina prima del restauro',
  },
  topRight: {
    src: '/assets/images/storia/excucina.png',
    alt: 'La cucina di Villa Salina prima del restauro',
  },
  bottom: {
    src: '/assets/images/storia/erbacce.png',
    alt: 'Il giardino di Villa Salina invaso dalle erbacce prima del restauro',
  },
  right: {
    src: '/assets/images/about2.jpg',
    alt: 'Una sala di Villa Salina dopo il restauro',
  },
}
