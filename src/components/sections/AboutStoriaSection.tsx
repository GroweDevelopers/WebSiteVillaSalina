/** Introduzione della pagina Storia: chi siamo e da dove viene il nome. */
export function AboutStoriaSection() {
  return (
    <section className="about-restaurant">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="about-restaurant-main">
              <div className="content col-md-7">
                <div className="block-text">
                  <p className="subtitle" data-aos-duration="1000" data-aos="fade-up">
                    Chi siamo
                  </p>
                  <h3 className="title" data-aos-duration="1000" data-aos="fade-up">
                    Villa Salina: Una Riscoperta Gastronomica
                  </h3>
                  <h5 className="text text-uppercase" data-aos-duration="1000" data-aos="fade-up">
                    Il Rinascimento di un&apos;icona
                    <br /> culinaria nel cuore dell&apos;Ottocento
                  </h5>
                  <p data-aos-duration="1000" data-aos="fade-up">
                    Deve il suo nome a Edoardo Salina, cuoco di casa Savoia, questa villa di metà
                    ‘800 con diverse sale impreziosite da soffitti affrescati. Il coraggioso
                    chef-patron Ivo Druetta l&apos;ha totalmente restaurata e riportata a nuova vita
                    per allargare i suoi orizzonti gastronomici, che nascono in pasticceria. Oggi è
                    un moderno locale multitasking che a pranzo, insieme alla carta influenzata dal
                    territorio ma con proposte di pesce, prevede un business lunch e alla sera anche
                    una carta di pizze gourmet. D&apos;estate si apre all&apos;esterno nella bella
                    veranda ed è possibile passeggiare nel curato giardino, di proprietà comunale.
                  </p>
                </div>
              </div>

              <div
                className="col-md-5"
                data-aos-duration="1000"
                data-aos="fade-left"
                style={{ maxWidth: 676 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/images/my/villa.jpg"
                  alt="Villa Salina vista dall'esterno"
                  width={1140}
                  height={855}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
