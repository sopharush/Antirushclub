import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
import PhotoBG from './PhotoBG'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { useReady } from '../lib/ReadyContext'

const HeroShader = lazy(() => import('./HeroShader'))

export default function Hero() {
  const { ready } = useReady()
  const reduced = prefersReducedMotion()

  const kicker = useRef<HTMLParagraphElement>(null)
  const l1 = useRef<HTMLSpanElement>(null)
  const l2 = useRef<HTMLSpanElement>(null)
  const tag = useRef<HTMLParagraphElement>(null)
  const cta = useRef<HTMLDivElement>(null)
  const cue = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (reduced) return
    gsap.set([l1.current, l2.current], { yPercent: 118 })
    gsap.set([kicker.current, tag.current, cta.current, cue.current], { autoAlpha: 0, y: 22 })
  }, [reduced])

  useEffect(() => {
    if (!ready || reduced) return
    const tl = gsap.timeline()
    tl.to(kicker.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' })
      .to([l1.current, l2.current], { yPercent: 0, duration: 1.3, ease: 'power4.out', stagger: 0.12 }, '-=0.35')
      .to(tag.current, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .to([cta.current, cue.current], { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, '-=0.55')
    return () => { tl.kill() }
  }, [ready, reduced])

  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <PhotoBG tone="dusk" overlay={0.52} />
      <Suspense fallback={null}><HeroShader /></Suspense>

      <div className="relative z-10 px-6 text-center">
        <p ref={kicker} className="kicker mb-7 text-caramel" style={{ color: '#e6bd84' }}>
          A slow-living club · rooted in faith
        </p>

        <h1
          className="serif uppercase text-paper"
          style={{ fontSize: 'clamp(3.2rem, 11.5vw, 9.5rem)', lineHeight: 0.88, letterSpacing: '0.012em', textShadow: '0 2px 40px rgba(24,14,7,0.5)' }}
        >
          <span className="block overflow-hidden"><span ref={l1} className="block">Anti-Rush</span></span>
          <span className="block overflow-hidden"><span ref={l2} className="block italic-serif" style={{ textTransform: 'none' }}>Club</span></span>
        </h1>

        <p ref={tag} className="italic-serif mx-auto mt-7 text-cream" style={{ fontSize: 'clamp(1.05rem, 2.1vw, 1.55rem)' }}>
          Come as you are. Slow down. Stay awhile.
        </p>

        <div ref={cta} className="mt-9">
          <a
            href="#invitation"
            className="kicker inline-block rounded-full bg-cream px-8 py-4 text-espresso transition-transform hover:-translate-y-0.5"
          >
            Pull Up a Chair
          </a>
        </div>
      </div>

      <div ref={cue} className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 flex flex-col items-center gap-3">
        <span className="kicker text-[0.6rem] text-cream/80">Scroll</span>
        <span className="block h-10 w-px bg-cream/40">
          <span className={`block h-3 w-px bg-cream ${reduced ? '' : 'animate-[cue_1.8s_ease-in-out_infinite]'}`} />
        </span>
      </div>

      <style>{`@keyframes cue{0%,100%{transform:translateY(0);opacity:.4}50%{transform:translateY(26px);opacity:1}}`}</style>
    </section>
  )
}
