/** Closing CTA — the ask. */
export default function Invitation() {
  return (
    <section id="invitation" className="relative overflow-hidden bg-black2 py-36 md:py-52">
      <div className="mx-auto max-w-[900px] px-6 text-center">
        <p className="kicker text-cream/60" data-reveal>Your seat is waiting</p>
        <h2 className="serif mt-7 text-cream" style={{ fontSize: 'clamp(2.3rem, 6vw, 5rem)', lineHeight: 0.98 }}>
          <span className="mask-line"><span className="mask-inner">Welcome to</span></span>
          <span className="mask-line"><span className="mask-inner italic-serif">the club.</span></span>
        </h2>
        <p className="mx-auto mt-8 max-w-[34rem] text-[0.98rem] leading-[1.95] text-cream/80" data-reveal data-reveal-delay="0.08">
          You’ll never have to pretend here. You’ll never be too busy to belong. Pull up a chair,
          and let’s discover together what it truly means to live rich.
        </p>
        <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row" data-reveal data-reveal-delay="0.16">
          <a
            href="#top"
            className="kicker inline-block rounded-full bg-cream px-9 py-4 text-choc transition-transform hover:-translate-y-0.5"
          >
            Pull Up a Chair
          </a>
          <a href="#why" className="kicker text-cream/70 underline-offset-8 hover:underline">
            Learn our story
          </a>
        </div>
        <p className="kicker mt-14 text-cream/40" data-reveal>Slow down · Look up · Stay awhile</p>
      </div>
    </section>
  )
}
