import { useEffect, useRef } from 'react'
import PhotoBG, { type PhotoTone } from '../components/PhotoBG'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import { useReady } from '../lib/ReadyContext'

const SERIES: { kicker: string; title: string; desc: string; tone: PhotoTone }[] = [
  { kicker: 'Coffee & Conversations', title: 'Just talking about life', desc: 'Two cups, no script, and the kind of honest talk that only happens when nobody’s in a hurry.', tone: 'morning' },
  { kicker: 'Hobby Club', title: 'Guests teach us something', desc: 'Pottery, bread, film, flowers — everyone brings a craft, and everyone leaves having learned one.', tone: 'bookstore' },
  { kicker: 'Slow Saturdays', title: 'Cozy, unhurried, warm', desc: 'Episodes built around rest and intentional living. Permission to do nothing beautifully.', tone: 'living' },
  { kicker: 'Around the Table', title: 'Family-style conversation', desc: 'Many voices, one table. The kind of evening you don’t want to get up from.', tone: 'table' },
  { kicker: 'What’s In Your Cup?', title: 'Your story, your brew', desc: 'Guests bring their favorite coffee or tea and pour out the story behind it.', tone: 'window' },
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
          trigger: section,
          start: 'top top',
          end: () => '+=' + amount(),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
    }, section)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ready, reduced])

  const panelCls = reduced
    ? 'relative h-[72vh] w-[84vw] shrink-0 overflow-hidden rounded-sm'
    : 'relative h-full w-[82vw] shrink-0 overflow-hidden md:w-[54vw]'

  return (
    <section
      ref={sectionRef}
      id="series"
      className={reduced ? 'bg-espresso py-20' : 'relative h-screen overflow-hidden bg-espresso'}
    >
      <div ref={trackRef} className={reduced ? 'hstrip gap-5 px-6' : 'flex h-full flex-nowrap'}>
        {/* intro panel */}
        <div className={reduced ? 'relative flex h-[72vh] w-[84vw] shrink-0 flex-col justify-center px-2' : 'relative flex h-full w-[86vw] shrink-0 flex-col justify-center px-10 md:w-[42vw] md:px-16'}>
          <p className="kicker text-caramel">The Series</p>
          <h2 className="serif mt-6 text-paper" style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.02 }}>
            What we make<br /><span className="italic-serif text-sand">together.</span>
          </h2>
          <p className="mt-6 max-w-sm text-[0.95rem] leading-[1.9] text-paper/70">
            Every episode feels like sitting with friends — no rushing, no perfect scripts. Just good
            conversation and someone’s favorite thing to share.
          </p>
          <p className="kicker mt-8 text-paper/50">{reduced ? 'Swipe →' : 'Scroll →'}</p>
        </div>

        {/* show panels */}
        {SERIES.map((s, i) => (
          <article key={s.title} className={panelCls}>
            <PhotoBG tone={s.tone} overlay={0.46} />
            <div className="relative z-10 flex h-full flex-col justify-end p-9 md:p-14">
              <span className="kicker text-caramel" style={{ color: '#e6bd84' }}>
                {String(i + 1).padStart(2, '0')} · {s.kicker}
              </span>
              <h3 className="serif mt-4 text-paper" style={{ fontSize: 'clamp(1.8rem, 3.4vw, 3rem)', lineHeight: 1.04 }}>
                {s.title}
              </h3>
              <p className="mt-4 max-w-md text-[0.92rem] leading-[1.85] text-paper/80">{s.desc}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
