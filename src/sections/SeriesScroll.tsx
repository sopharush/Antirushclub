import { useEffect, useRef } from 'react'
import PhotoBG from '../components/PhotoBG'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import { useReady } from '../lib/ReadyContext'

const PANELS: { src: string; kicker: string; line: string; pos?: string }[] = [
  { src: '/photos/gal-1.jpg', kicker: 'Presence over pressure', line: 'Come as you are.', pos: 'center 35%' },
  { src: '/photos/gal-2.jpg', kicker: 'People over performance', line: 'Stay a little longer.', pos: 'center 30%' },
  { src: '/photos/gal-3.jpg', kicker: 'Rich in faith, rich in purpose', line: 'Redefining the rich life.', pos: 'center 28%' },
  { src: '/photos/gal-4.jpg', kicker: 'Where slowing down becomes sacred', line: 'Rest is holy.', pos: 'center 32%' },
  { src: '/photos/gal-5.jpg', kicker: 'A seat at the table', line: 'You belong here.', pos: 'center 30%' },
]

export default function SeriesScroll() {
  const { ready } = useReady()
  const reduced = prefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ready || reduced) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return
    const ctx = gsap.context(() => {
      const amount = () => Math.max(0, track.scrollWidth - window.innerWidth)
      gsap.to(track, {
        x: () => -amount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top top', end: () => '+=' + amount(),
          pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
        },
      })
    }, section)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ready, reduced])

  const panelCls = reduced
    ? 'relative h-[74vh] w-[84vw] shrink-0 overflow-hidden rounded-sm'
    : 'relative h-full w-[82vw] shrink-0 overflow-hidden md:w-[50vw]'

  return (
    <section
      ref={sectionRef}
      id="series"
      className={reduced ? 'bg-espresso py-20' : 'relative h-screen overflow-hidden bg-espresso'}
    >
      <div ref={trackRef} className={reduced ? 'hstrip gap-5 px-6' : 'flex h-full flex-nowrap'}>
        {/* intro panel */}
        <div className={reduced
          ? 'relative flex h-[74vh] w-[84vw] shrink-0 flex-col justify-center px-2'
          : 'relative flex h-full w-[86vw] shrink-0 flex-col justify-center px-10 md:w-[40vw] md:px-16'}>
          <p className="kicker text-caramel">The Club</p>
          <h2 className="serif mt-6 text-paper" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.02 }}>
            People come<br /><span className="italic-serif text-sand">not because it’s perfect —</span><br />because they belong.
          </h2>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-[1.9] text-paper/70">
            Strangers become friends. Stories are shared without judgment. Everyone has something to
            teach and something to learn.
          </p>
          <p className="kicker mt-8 text-paper/50">{reduced ? 'Swipe →' : 'Scroll →'}</p>
        </div>

        {/* portrait panels */}
        {PANELS.map((p) => (
          <article key={p.src} className={panelCls}>
            <PhotoBG src={p.src} overlay={0.34} position={p.pos} />
            <div className="relative z-10 flex h-full flex-col justify-end p-9 md:p-14">
              <span className="kicker text-caramel" style={{ color: '#e6bd84' }}>{p.kicker}</span>
              <h3 className="serif mt-4 text-paper" style={{ fontSize: 'clamp(1.9rem, 3.6vw, 3.2rem)', lineHeight: 1.04, textShadow: '0 2px 24px rgba(24,14,7,0.5)' }}>
                {p.line}
              </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
