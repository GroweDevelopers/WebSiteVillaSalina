import Image from 'next/image'
import { historySteps } from '@/data/history'

/** Timeline delle sei tappe della storia di Villa Salina. */
export function HistoryTimeline() {
  return (
    <section className="history">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="history-main">
              {historySteps.map((step, index) => {
                // Le tappe si alternano: quelle dispari prendono la classe s1
                // e l'immagine entra dal lato opposto.
                const isMirrored = index % 2 === 1

                return (
                  <div
                    className={`history-box${isMirrored ? ' s1' : ''}`}
                    key={`${step.year}-${step.title}`}
                  >
                    <div className="icon" />
                    <div
                      className="img"
                      data-aos-duration="1000"
                      data-aos={isMirrored ? 'fade-left' : 'fade-right'}
                    >
                      <Image
                        src={step.image.src}
                        alt={step.image.alt}
                        width={step.image.width}
                        height={step.image.height}
                        sizes="(max-width: 991px) 100vw, 45vw"
                      />
                    </div>
                    <div className="content">
                      <p className="time" data-aos-duration="1000" data-aos="fade-up">
                        {step.year}
                      </p>
                      <h4 data-aos-duration="1000" data-aos="fade-up">
                        {step.title}
                      </h4>
                      <p data-aos-duration="1000" data-aos="fade-up">
                        {step.text}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
