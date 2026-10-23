import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { useReady } from '../lib/ReadyContext'

const SLIDES = [
  { src: '/photos/hero-5.jpg', pos: '40% 28%' }, // seated, smiling, headroom (favorite — opens first)
  { src: '/photos/hero-1.jpg', pos: 'center 42%' }, // grills close-up
  { src: '/photos/hero-6.jpg', pos: 'center 34%' }, // tender, leaning
  { src: '/photos/hero-7.jpg', pos: 'center 34%' }, // candid, laughing together
  { src: '/photos/hero-2.jpg', pos: '40% 32%' }, // seated, serene
]
const INTERVAL = 5500

export default function Hero() {
  const { ready } = useReady()
  const reduced = prefersReducedMotion()
  const [idx, setIdx] = useState(0)

  const kicker = useRef<HTMLParagraphElement>(null)
  const l1 = useRef<HTMLSpanElement>(null)
  const l2 = useRef<HTMLSpanElement>(null)
  const tag = useRef<HTMLParagraphElement>(null)
  const cta = useRef<HTMLDivElement>(null)
  const controls = useRef<HTMLDivElement>(null)

  const go = (i: number) => setIdx((i + SLIDES.length) % SLIDES.length)

  // auto-advance (paused under reduced motion / before ready).
  // Depends on idx so manual navigation resets the timer instead of
  // letting it fire immediately after a click.
  useEffect(() => {
    if (reduced || !ready) return
    const t = setTimeout(() => setIdx((i) => (i + 1) % SLIDES.length), INTERVAL)
    return () => clearTimeout(t)
  }, [reduced, ready, idx])

  useLayoutEffect(() => {
    if (reduced) return
    gsap.set([l1.current, l2.current], { yPercent: 118 })
    gsap.set([kicker.current, tag.current, cta.current, controls.current], { autoAlpha: 0, y: 22 })
  }, [reduced])

  useEffect(() => {
    if (!ready || reduced) return
    const tl = gsap.timeline()
    tl.to(kicker.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
      .to([l1.current, l2.current], { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 }, '-=0.35')
      .to(tag.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .to([cta.current, controls.current], { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, '-=0.55')
    return () => { tl.kill() }
  }, [ready, reduced])

  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center overflow-hidden bg-espresso">
      {/* slides */}
      {SLIDES.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === idx ? 'opacity-100' : 'opacity-0'
          } ${i === idx && !reduced ? 'kenburns' : ''}`}
          style={{ objectPosition: s.pos }}
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
        />
      ))}

      {/* film overlays */}
      <div className="absolute inset-0" style={{ background: '#281a10', opacity: 0.14, mixBlendMode: 'multiply' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(125% 110% at 50% 45%, transparent 55%, rgba(24,14,7,0.45) 100%)' }} />
      {/* warm scrim up top so the espresso wordmark always reads */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[62%]"
        style={{ background: 'linear-gradient(180deg, rgba(239,227,200,0.9) 0%, rgba(239,227,200,0.46) 42%, rgba(239,227,200,0) 100%)' }}
      />

      <div className="relative z-10 px-6 pt-[11vh] text-center">
        <p ref={kicker} className="kicker mb-6 text-sienna">A slow-living club · rooted in faith</p>
        <h1
          className="serif uppercase text-espresso"
          style={{ fontSize: 'clamp(2.6rem, 9vw, 7rem)', lineHeight: 0.9, letterSpacing: '0.012em', textShadow: '0 2px 30px rgba(239,227,200,0.9), 0 0 2px rgba(239,227,200,0.55)' }}
        >
          <span className="block overflow-hidden"><span ref={l1} className="block">Anti-Rush</span></span>
          <span className="block overflow-hidden"><span ref={l2} className="block italic-serif" style={{ textTransform: 'none' }}>Club</span></span>
        </h1>
        <p ref={tag} className="italic-serif mx-auto mt-6 text-ink" style={{ fontSize: 'clamp(1.05rem, 2.1vw, 1.5rem)', textShadow: '0 1px 16px rgba(239,227,200,0.98), 0 0 3px rgba(239,227,200,0.9)' }}>
          Come as you are. Slow down. Stay awhile.
        </p>
        <div ref={cta} className="mt-8">
          <a href="#invitation" className="kicker inline-block rounded-full bg-espresso px-8 py-4 text-cream transition-transform hover:-translate-y-0.5">
            Pull Up a Chair
          </a>
        </div>
      </div>

      {/* carousel controls */}
      <div ref={controls} className="absolute inset-x-0 bottom-9 z-20 flex items-center justify-center gap-5">
        <button onClick={() => go(idx - 1)} aria-label="Previous photo" className="grid h-9 w-9 place-items-center rounded-full border border-cream/40 text-cream/90 transition-colors hover:bg-cream hover:text-espresso">
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to photo ${i + 1}`}
              aria-current={i === idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'w-7 bg-cream' : 'w-1.5 bg-cream/45 hover:bg-cream/70'}`}
            />
          ))}
        </div>
        <button onClick={() => go(idx + 1)} aria-label="Next photo" className="grid h-9 w-9 place-items-center rounded-full border border-cream/40 text-cream/90 transition-colors hover:bg-cream hover:text-espresso">
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  )
}
