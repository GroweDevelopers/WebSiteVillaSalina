'use client'

import { counters } from '@/data/qualities'
import { useCountUp } from '@/hooks/useCountUp'
import type { Counter } from '@/types'

function CounterBox({ counter }: { counter: Counter }) {
  const { ref, value } = useCountUp(counter.value)

  return (
    <div className="couter-box counter">
      <div className="number-content">
        <span className="count-number" ref={ref}>
          {counter.prefix}
          {value}
        </span>
      </div>
      <p className="text">{counter.label}</p>
    </div>
  )
}

/** I quattro numeri della home: menzione Michelin, coperti, recensioni, anni. */
export function CounterSection() {
  return (
    <div className="s-couter">
      <div className="container">
        <div className="row">
          <div className="couter-content">
            {counters.map((counter) => (
              <CounterBox key={counter.label} counter={counter} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
