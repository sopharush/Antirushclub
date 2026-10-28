import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { useReady } from '../lib/ReadyContext'

// Cut-out figures of the couple, warm-graded, transparent PNG/WebP.
const FRONT = [
  '/photos/cutouts/standing.webp',
  '/photos/cutouts/seated-smiles.webp',
  '/photos/cutouts/tender.webp',
  '/photos/cutouts/laughing.webp',
]
const BACK = [
  '/photos/cutouts/olive.webp',
  '/photos/cutouts/clasped.webp',
  '/photos/cutouts/laughing.webp',
  '/photos/cutouts/seated-smiles.webp',
]

function FigRow({ srcs, variant, dir, dur, eagerCount = 0 }: {
  srcs: string[]; variant: 'front' | 'back'; dir: 'left' | 'right'; dur: string; eagerCount?: number
}) {
  const doubled = [...srcs, ...srcs]
  return (
    <div className={`cutrow cutrow--${variant}`} aria-hidden="true">
      <div className={`filmrow__track filmrow__track--${dir}`} style={{ ['--dur' as string]: dur }}>
        {doubled.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            className={`cutfig cutfig--${variant}`}
            loading={i < eagerCount ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>
    </div>
  )
}

export default function HeroCutout() {
  const { ready } = useReady()
  const reduced = prefersReducedMotion()

  const kicker = useRef<HTMLParagraphElement>(null)
  const l1 = useRef<HTMLSpanElement>(null)
  const l2 = useRef<HTMLSpanElement>(null)
  const tag = useRef<HTMLParagraphElement>(null)
  const cta = useRef<HTMLDivElement>(null)
  const figs = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    gsap.set([l1.current, l2.current], { yPercent: 118 })
    gsap.set([kicker.current, tag.current, cta.current], { autoAlpha: 0, y: 22 })
    gsap.set(figs.current, { autoAlpha: 0 })
  }, [reduced])

  useEffect(() => {
    if (!ready || reduced) return
    const tl = gsap.timeline()
    tl.to(figs.current, { autoAlpha: 1, duration: 1.3, ease: 'power2.out' })
      .to(kicker.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=1.0')
      .to([l1.current, l2.current], { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 }, '-=0.5')
      .to(tag.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')
      .to(cta.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.55')
    return () => { tl.kill() }
  }, [ready, reduced])

  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-cream">
      {/* soft warm field */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(216,194,154,0.45) 0%, rgba(239,227,200,0) 58%)' }}
      />

      {/* drifting cut-out figures along the lower half */}
      <div ref={figs} className="absolute inset-0">
        <FigRow srcs={BACK} variant="back" dir="right" dur="96s" />
        <FigRow srcs={FRONT} variant="front" dir="left" dur="74s" eagerCount={3} />
        {/* cream fade so figures rise out of the ground and the title zone stays clean */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(239,227,200,1) 0%, rgba(239,227,200,0.86) 24%, rgba(239,227,200,0.12) 50%, rgba(239,227,200,0) 66%, rgba(239,227,200,0.5) 100%)' }}
        />
      </div>

      {/* wordmark — upper-center, over a soft cream halo for legibility */}
      <div className="relative z-10 px-6 pt-[18vh] text-center">
        <div
          className="pointer-events-none absolute left-1/2 top-[46%] -z-10 h-[150%] w-[118%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(58% 50% at 50% 50%, rgba(239,227,200,0.95) 0%, rgba(239,227,200,0.66) 44%, rgba(239,227,200,0) 72%)' }}
        />
        <p ref={kicker} className="kicker mb-5 text-sienna">A slow-living club · rooted in faith</p>
        <h1
          className="serif uppercase text-espresso"
          style={{ fontSize: 'clamp(2.6rem, 9vw, 7rem)', lineHeight: 0.9, letterSpacing: '0.012em' }}
        >
          <span className="block overflow-hidden"><span ref={l1} className="block">Anti-Rush</span></span>
          <span className="block overflow-hidden"><span ref={l2} className="block italic-serif" style={{ textTransform: 'none' }}>Club</span></span>
        </h1>
        <p ref={tag} className="italic-serif mx-auto mt-6 text-ink" style={{ fontSize: 'clamp(1.05rem, 2.1vw, 1.5rem)' }}>
          Come as you are. Slow down. Stay awhile.
        </p>
        <div ref={cta} className="mt-8">
          <a href="#invitation" className="kicker inline-block rounded-full bg-espresso px-8 py-4 text-cream transition-transform hover:-translate-y-0.5">
            Pull Up a Chair
          </a>
        </div>
      </div>
    </section>
  )
}
