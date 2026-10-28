import PhotoBG from '../components/PhotoBG'

/** A cinematic breath — the theme scripture over a muted warm photograph. */
export default function Pause() {
  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden py-28 md:py-40">
      <PhotoBG src="/photos/pause.jpg" overlay={0.6} position="center 35%" />
      <div className="relative z-10 mx-auto max-w-[920px] px-6 text-center">
        <p className="kicker text-caramel" data-reveal style={{ color: '#e6bd84' }}>Theme Scripture · Romans 12:2</p>
        <blockquote
          className="serif mt-8 text-paper"
          style={{ fontSize: 'clamp(1.7rem, 3.9vw, 3.1rem)', lineHeight: 1.22, textShadow: '0 2px 30px rgba(24,14,7,0.5)' }}
          data-parallax="36"
        >
          <span className="mask-line"><span className="mask-inner">“Do not conform to the pattern</span></span>
          <span className="mask-line"><span className="mask-inner">of this world, but be transformed</span></span>
          <span className="mask-line"><span className="mask-inner italic-serif text-sand">by the renewing of your mind.”</span></span>
        </blockquote>
        <p className="mx-auto mt-10 max-w-[33rem] text-[0.96rem] leading-[1.9] text-paper/80" data-reveal data-reveal-delay="0.1">
          This is the invitation underneath everything we make. Not a louder life — a deeper one.
          Rooted. Unhurried. Rich in the ways that actually last.
        </p>
      </div>
    </section>
  )
}
