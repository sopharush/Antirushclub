import { useEffect, useRef, useState } from 'react'

// Each feeling has a small still-life object that pops up behind its words:
// on hover with a mouse, or as the line reaches the middle of the screen on touch.
const FEELS = [
  { text: 'Sunday morning coffee', img: '/photos/objects/coffee.webp', w: 'clamp(110px, 13vw, 170px)' },
  { text: 'A cozy bookstore', img: '/photos/objects/books.webp', w: 'clamp(130px, 16vw, 210px)' },
  { text: 'A friend’s living room', img: '/photos/objects/armchair.webp', w: 'clamp(120px, 14vw, 180px)' },
  { text: 'A warm blanket on a rainy day', img: '/photos/objects/blanket.webp', w: 'clamp(130px, 16vw, 210px)' },
  { text: 'Deep conversations after church', img: '/photos/objects/bible.webp', w: 'clamp(140px, 17vw, 220px)' },
  { text: 'A place where you instantly feel safe', img: '/photos/objects/candle.webp', w: 'clamp(70px, 8vw, 100px)' },
]

export default function Experience() {
  const [active, setActive] = useState<number | null>(null)
  const [hoverMode, setHoverMode] = useState(true)
  const rows = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    setHoverMode(hover)
    if (hover) return
    // Touch: the line crossing the middle band of the screen is the active one.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    rows.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="experience" className="bg-cream2 py-28 md:py-40">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-14 px-6 md:grid-cols-[0.78fr_1.22fr] md:gap-16 md:px-10">
        <div className="md:sticky md:top-32 md:self-start">
          <p className="kicker text-sienna" data-reveal>The Experience</p>
          <h2 className="serif mt-6 text-ink" style={{ fontSize: 'clamp(1.95rem, 4.2vw, 3.3rem)', lineHeight: 1.06 }}>
            <span className="mask-line"><span className="mask-inner">It should feel like</span></span>
            <span className="mask-line"><span className="mask-inner italic-serif text-sienna">coming home.</span></span>
          </h2>
          <p className="mt-8 max-w-[26rem] text-[0.96rem] leading-[1.9] text-inksoft" data-reveal>
            People don’t come because everything is perfect. They come because they belong. There’s
            always room at the table — and a cup waiting with your name on it.
          </p>
        </div>

        <ul
          className="border-t border-cocoa/15"
          data-reveal-group
          onMouseLeave={() => hoverMode && setActive(null)}
        >
          {FEELS.map((f, i) => {
            const on = active === i
            return (
              <li
                key={f.text}
                ref={(el) => { rows.current[i] = el }}
                data-index={i}
                onMouseEnter={() => hoverMode && setActive(i)}
                className={`feel relative border-b border-cocoa/15 py-6 md:py-7 ${on ? 'is-active' : ''}`}
              >
                <img
                  src={f.img}
                  alt=""
                  aria-hidden="true"
                  className="feel__obj"
                  style={{ width: f.w }}
                  loading="lazy"
                  decoding="async"
                />
                <p
                  className="serif relative z-10 flex items-baseline gap-4 text-ink transition-colors duration-300"
                  style={{ fontSize: 'clamp(1.45rem, 3.1vw, 2.45rem)', lineHeight: 1.12 }}
                >
                  <span className={`kicker text-[0.6rem] transition-colors duration-300 ${on ? 'text-sienna' : 'text-sienna/60'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={on ? 'italic-serif text-sienna' : ''}>{f.text}</span>
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
