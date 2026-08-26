type PageTitleProps = {
  title: string
  /** Modificatore che sceglie l'immagine di sfondo, ad esempio `p-history`. */
  variant?: 'p-history' | 'p-gallery'
}

/** Testata con titolo e immagine di sfondo, in cima alle pagine interne. */
export function PageTitle({ title, variant }: PageTitleProps) {
  return (
    <section className={['page-title', variant].filter(Boolean).join(' ')}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="page-title-main">
              <h1 className="title">{title}</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
