/** A cinematic breath — the theme scripture on a chocolate ground, with a
 *  gentle parallax drift. Calm by design. */
export default function Pause() {
  return (
    <section className="relative overflow-hidden bg-choc py-32 md:py-48">
      <div className="mx-auto max-w-[900px] px-6 text-center">
        <p className="kicker text-cream/60" data-reveal>Theme Scripture · Romans 12:2</p>
        <blockquote
          className="serif mt-8 text-cream"
          style={{ fontSize: 'clamp(1.6rem, 3.8vw, 3rem)', lineHeight: 1.22 }}
          data-parallax="40"
        >
          <span className="mask-line"><span className="mask-inner">“Do not conform to the pattern</span></span>
          <span className="mask-line"><span className="mask-inner">of this world, but be transformed</span></span>
          <span className="mask-line"><span className="mask-inner italic-serif">by the renewing of your mind.”</span></span>
        </blockquote>
        <p className="mx-auto mt-10 max-w-[32rem] text-[0.95rem] leading-[1.9] text-cream/80" data-reveal data-reveal-delay="0.1">
          This is the invitation underneath everything we make. Not a louder life — a deeper one.
          Rooted. Unhurried. Rich in the ways that actually last.
        </p>
      </div>
    </section>
  )
}
