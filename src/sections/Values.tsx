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
    <section id="values" className="bg-cream pt-28 md:pt-40">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 px-6 md:grid-cols-[0.72fr_1.28fr] md:gap-16 md:px-10">
        {/* left: the framing, pinned while the pillars scroll past */}
        <div className="md:sticky md:top-32 md:self-start">
          <p className="kicker text-sienna" data-reveal>What we’re built on</p>
          <h2 className="serif mt-6 text-ink" style={{ fontSize: 'clamp(1.95rem, 4vw, 3.2rem)', lineHeight: 1.06 }}>
            <span className="mask-line"><span className="mask-inner">Six quiet commitments</span></span>
            <span className="mask-line"><span className="mask-inner italic-serif text-sienna">that shape the table.</span></span>
          </h2>
          <p className="mt-7 max-w-[24rem] text-[0.96rem] leading-[1.9] text-inksoft" data-reveal>
            Not rules. A posture we bring to every gathering, every conversation and every cup of coffee.
          </p>
        </div>

        {/* right: the six pillars, big and numbered */}
        <ol className="border-t border-cocoa/15" data-reveal-group>
          {VALUES.map((v, i) => (
            <li
              key={v.t}
              className="group grid grid-cols-[auto_1fr] gap-x-5 border-b border-cocoa/15 py-8 md:grid-cols-[auto_1fr_15rem] md:items-baseline md:gap-x-8 md:py-10"
            >
              <span className="serif italic text-caramel" style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3
                className={`transition-transform duration-500 ease-out group-hover:translate-x-2 ${i % 2 ? 'italic-serif text-sienna' : 'serif text-espresso'}`}
                style={{
                  fontSize: 'clamp(2.3rem, 5.4vw, 4.4rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.01em',
                  fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 1",
                }}
              >
                {v.t}
              </h3>
              <p className="col-start-2 mt-3 max-w-[30rem] text-[0.92rem] leading-[1.85] text-inksoft md:col-start-3 md:mt-0">
                {v.d}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* "What rich means here" — a slow marquee */}
      <div className="mt-24 border-y border-cocoa/15 bg-cream2 py-7 md:mt-32">
        <div className="marquee">
          <div className="marquee__track">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
                {RICH.map((r) => (
                  <span key={r} className="serif flex items-center text-ink" style={{ fontSize: 'clamp(1.6rem,3vw,2.5rem)' }}>
                    <span className="px-8">{r}</span>
                    <span className="text-sienna/60">✦</span>
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
