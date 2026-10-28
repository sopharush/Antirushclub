import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { useReady } from '../lib/ReadyContext'

/* A vintage photo print sliding in the hero marquee. */
type Shape = 'topWide' | 'topTall' | 'botWide' | 'botTall'
type Print = { src: string; pos: string; shape: Shape; rot: number }

const DIMS: Record<Shape, { w: string; h: string }> = {
  topWide: { w: 'clamp(208px, 27vw, 310px)', h: 'clamp(150px, 20vh, 208px)' },
  topTall: { w: 'clamp(120px, 16vw, 176px)', h: 'clamp(166px, 23vh, 240px)' },
  botWide: { w: 'clamp(168px, 22vw, 256px)', h: 'clamp(118px, 16vh, 172px)' },
  botTall: { w: 'clamp(96px, 13vw, 142px)', h: 'clamp(132px, 18vh, 196px)' },
}
const TOP_GAP = 'clamp(16px, 2.4vw, 36px)'
const BOT_GAP = 'clamp(12px, 2vw, 28px)'

// Top row — the couple up close, moving left (front plane, warmer, larger).
const TOP: Print[] = [
  { src: '/photos/hero-5.jpg', pos: '45% 30%', shape: 'topTall', rot: -3 }, // seated smiles
  { src: '/photos/gal-2.jpg', pos: 'center 40%', shape: 'topWide', rot: 2 },
  { src: '/photos/hero-7.jpg', pos: 'center 32%', shape: 'topTall', rot: -2 }, // candid laughing
  { src: '/photos/gal-4.jpg', pos: 'center 45%', shape: 'topWide', rot: 2.5 },
  { src: '/photos/hero-6.jpg', pos: '50% 30%', shape: 'topTall', rot: -1.5 }, // tender
  { src: '/photos/gal-1.jpg', pos: 'center 42%', shape: 'topWide', rot: 3 },
  { src: '/photos/hero-4.jpg', pos: 'center 30%', shape: 'topTall', rot: -2.5 }, // big smiles
]

// Bottom row — moving right (back plane, hazier, smaller) for parallax depth.
const BOTTOM: Print[] = [
  { src: '/photos/gal-3.jpg', pos: 'center 45%', shape: 'botWide', rot: 2.5 },
  { src: '/photos/hero-3.jpg', pos: 'center 22%', shape: 'botTall', rot: -2 }, // standing
  { src: '/photos/gal-5.jpg', pos: 'center 45%', shape: 'botWide', rot: 1.5 },
  { src: '/photos/hero-2.jpg', pos: '45% 32%', shape: 'botTall', rot: -3 }, // serene
  { src: '/photos/why-main.jpg', pos: 'center 40%', shape: 'botWide', rot: 2 },
  { src: '/photos/hero-1.jpg', pos: 'center 45%', shape: 'botTall', rot: -1.5 }, // grills
  { src: '/photos/exp-main.jpg', pos: 'center 42%', shape: 'botWide', rot: 2.5 },
]

function PrintCard({ p, gap, back, eager }: { p: Print; gap: string; back?: boolean; eager?: boolean }) {
  const d = DIMS[p.shape]
  return (
    <div
      className={`print${back ? ' print--back' : ''}`}
      style={{ width: d.w, height: d.h, marginRight: gap, transform: `rotate(${p.rot}deg)` }}
    >
      <img
        src={p.src}
        alt=""
        aria-hidden="true"
        style={{ objectPosition: p.pos }}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
      <span className="print__wash" />
    </div>
  )
}

function Row({ prints, gap, dir, dur, back }: { prints: Print[]; gap: string; dir: 'left' | 'right'; dur: string; back?: boolean }) {
  // Duplicate the set so translateX(-50%) loops seamlessly.
  const doubled = [...prints, ...prints]
  return (
    <div className="filmrow" aria-hidden="true">
      <div className={`filmrow__track filmrow__track--${dir}`} style={{ ['--dur' as string]: dur }}>
        {doubled.map((p, i) => (
          <PrintCard key={`${p.src}-${i}`} p={p} gap={gap} back={back} eager={!back && i < 4} />
        ))}
      </div>
    </div>
  )
}

export default function HeroMarquee() {
  const { ready } = useReady()
  const reduced = prefersReducedMotion()

  const kicker = useRef<HTMLParagraphElement>(null)
  const l1 = useRef<HTMLSpanElement>(null)
  const l2 = useRef<HTMLSpanElement>(null)
  const tag = useRef<HTMLParagraphElement>(null)
  const cta = useRef<HTMLDivElement>(null)
  const rows = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    gsap.set([l1.current, l2.current], { yPercent: 118 })
    gsap.set([kicker.current, tag.current, cta.current], { autoAlpha: 0, y: 22 })
    gsap.set(rows.current, { autoAlpha: 0 })
  }, [reduced])

  useEffect(() => {
    if (!ready || reduced) return
    const tl = gsap.timeline()
    tl.to(rows.current, { autoAlpha: 1, duration: 1.2, ease: 'power2.out' })
      .to(kicker.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.9')
      .to([l1.current, l2.current], { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 }, '-=0.5')
      .to(tag.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7')
      .to(cta.current, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.55')
    return () => { tl.kill() }
  }, [ready, reduced])

  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden bg-cream pt-24"
    >
      {/* soft warm field behind everything */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 90% at 50% 8%, rgba(216,194,154,0.5) 0%, rgba(239,227,200,0) 60%)' }}
      />

      <div ref={rows} className="relative flex min-h-0 flex-1 flex-col justify-between">
        {/* top marquee row */}
        <Row prints={TOP} gap={TOP_GAP} dir="left" dur="64s" />

        {/* center wordmark — kept in a clean cream zone for legibility */}
        <div className="relative z-10 px-6 text-center">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[120%] -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'radial-gradient(60% 55% at 50% 50%, rgba(239,227,200,0.96) 0%, rgba(239,227,200,0.72) 46%, rgba(239,227,200,0) 72%)' }}
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

        {/* bottom marquee row */}
        <Row prints={BOTTOM} gap={BOT_GAP} dir="right" dur="78s" back />
      </div>
    </section>
  )
}
