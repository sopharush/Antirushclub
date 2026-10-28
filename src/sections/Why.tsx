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

        {/* Cut-out couple on a soft clay glow (the complement to their sage and khaki), no frame */}
        <div className="relative mx-auto w-full max-w-[500px]" data-reveal>
          <div className="pointer-events-none absolute inset-0" aria-hidden="true" data-parallax="50">
            <div
              className="absolute left-[-14%] top-[-8%] aspect-square w-[128%] rounded-full"
              style={{
                background:
                  'radial-gradient(closest-side, rgba(194,114,80,0.62) 0%, rgba(205,136,100,0.44) 55%, rgba(239,227,200,0) 100%)',
              }}
            />
          </div>
          <img
            src="/photos/cutouts/why-embrace.webp"
            alt="Sopha and Anthony Rush holding each other close"
            className="relative z-10 w-full"
            style={{
              maskImage: 'linear-gradient(180deg, #000 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(180deg, #000 80%, transparent 100%)',
            }}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
