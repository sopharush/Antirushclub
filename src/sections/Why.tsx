import Photo from '../components/Photo'

export default function Why() {
  return (
    <section id="why" className="relative bg-cream py-28 md:py-40">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-14 px-6 md:grid-cols-2 md:px-10">
        <div>
          <p className="kicker text-sienna" data-reveal>Our Why</p>
          <h2 className="serif mt-7 text-ink" style={{ fontSize: 'clamp(1.95rem, 4.1vw, 3.2rem)', lineHeight: 1.08 }}>
            <span className="mask-line"><span className="mask-inner">The world says hustle.</span></span>
            <span className="mask-line"><span className="mask-inner italic-serif text-sienna">God says be still.</span></span>
          </h2>

          <div className="mt-8 max-w-[34rem] space-y-6">
            <p className="text-[0.96rem] leading-[1.95] text-inksoft" data-reveal>
              The world tells us to hustle, to achieve more, to move faster and chase a success that
              always sits just out of reach. Anti-Rush Club exists to remind you that your worth was
              never your productivity — it’s your identity in Christ. Here, the pressures of life
              stop defining you, because your richness is found in God, not the world.
            </p>
            <p className="text-[0.96rem] leading-[1.95] text-inksoft" data-reveal data-reveal-delay="0.08">
              We’re choosing a different pace. Presence over pressure. People over performance. God
              over hustle. So let the coffee go warm in your hands and let the morning run long.
              There’s nothing to prove here — only a seat with your name on it.
            </p>
            <p className="kicker text-sienna" data-reveal data-reveal-delay="0.16">
              Slow down. Look up. Stay awhile →
            </p>
          </div>
        </div>

        <div className="relative" data-reveal>
          <Photo src="/photos/why-main.jpg" alt="Anti-Rush Club — together" position="center 30%" className="vframe aspect-[4/5] w-full" />
          <div className="absolute -bottom-7 -left-7 hidden md:block" data-parallax="80">
            <Photo src="/photos/why-small.jpg" alt="A quiet moment" position="center 62%" className="vframe h-44 w-32" />
          </div>
        </div>
      </div>
    </section>
  )
}
