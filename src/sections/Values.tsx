const VALUES = [
  { t: 'Slow Living', d: 'Life isn’t a race. Slowing down is how we notice God’s presence at all.' },
  { t: 'Faith First', d: 'God is the foundation of every conversation we have here.' },
  { t: 'Authenticity', d: 'No filters. No pretending. Just real people sharing real lives.' },
  { t: 'Curiosity', d: 'Everyone knows something you don’t. Every person carries a story worth hearing.' },
  { t: 'Community', d: 'No one was made to do life alone. We’re building a table, not a stage.' },
  { t: 'Simplicity', d: 'Joy hides in the small things — coffee, books, flowers, quiet mornings, laughter.' },
]

const RICH = ['Peace', 'Time', 'Faith', 'Family', 'Purpose', 'Joy', 'Connection', 'Rest', 'Presence', 'God’s love']

export default function Values() {
  return (
    <section id="values" className="bg-paper py-28 md:py-40">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <div className="max-w-[46rem]">
          <p className="kicker text-choc2" data-reveal>What we’re built on</p>
          <h2 className="serif mt-6 text-choc" style={{ fontSize: 'clamp(1.9rem, 4.4vw, 3.3rem)', lineHeight: 1.06 }}>
            <span className="mask-line"><span className="mask-inner">Six quiet commitments</span></span>
            <span className="mask-line"><span className="mask-inner italic-serif text-choc2">that shape the table.</span></span>
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" data-reveal-group>
          {VALUES.map((v) => (
            <div key={v.t}>
              <div className="hairline mb-5 text-choc" />
              <h3 className="serif text-choc" style={{ fontSize: '1.5rem' }}>{v.t}</h3>
              <p className="mt-3 text-[0.9rem] leading-[1.85] text-inksoft">{v.d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* "What rich means here" — a slow marquee */}
      <div className="mt-24 border-y border-choc/10 py-6 md:mt-32">
        <div className="marquee">
          <div className="marquee__track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
                {RICH.map((r) => (
                  <span key={r} className="serif flex items-center text-choc" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>
                    <span className="px-8">{r}</span>
                    <span className="text-choc2/40">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
