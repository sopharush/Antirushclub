import PhotoBG from '../components/PhotoBG'

/** Closing CTA — the ask, over a warm muted photograph. */
export default function Invitation() {
  return (
    <section id="invitation" className="relative flex min-h-[90vh] items-center overflow-hidden py-36 md:py-52">
      <PhotoBG tone="film" overlay={0.56} />
      <div className="relative z-10 mx-auto max-w-[900px] px-6 text-center">
        <p className="kicker text-caramel" data-reveal style={{ color: '#e6bd84' }}>Your seat is waiting</p>
        <h2 className="serif mt-7 text-paper" style={{ fontSize: 'clamp(2.4rem, 6.2vw, 5.2rem)', lineHeight: 0.98, textShadow: '0 2px 40px rgba(24,14,7,0.5)' }}>
          <span className="mask-line"><span className="mask-inner">Welcome to</span></span>
          <span className="mask-line"><span className="mask-inner italic-serif text-sand">the club.</span></span>
        </h2>
        <p className="mx-auto mt-8 max-w-[34rem] text-[0.98rem] leading-[1.95] text-paper/85" data-reveal data-reveal-delay="0.08">
          You’ll never have to pretend here. You’ll never be too busy to belong. Pull up a chair,
          and let’s discover together what it truly means to live rich.
        </p>
        <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row" data-reveal data-reveal-delay="0.16">
          <a href="#top" className="kicker inline-block rounded-full bg-cream px-9 py-4 text-espresso transition-transform hover:-translate-y-0.5">
            Pull Up a Chair
          </a>
          <a href="#why" className="kicker text-paper/80 underline-offset-8 hover:underline">
            Learn our story
          </a>
        </div>
        <p className="kicker mt-14 text-paper/45" data-reveal>Slow down · Look up · Stay awhile</p>
      </div>
    </section>
  )
}
