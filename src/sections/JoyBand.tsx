/** Full-width joy moment — the close-up smiles, a breath of warmth between
 *  the gallery and the values. */
export default function JoyBand() {
  return (
    <section className="relative h-[74vh] min-h-[440px] w-full overflow-hidden bg-espresso">
      <img
        src="/photos/joy.jpg"
        alt="Anti-Rush Club — joy in the little things"
        className="kenburns absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: 'center 42%' }}
        loading="lazy"
        decoding="async"
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(40,26,16,0.12) 0%, rgba(40,26,16,0) 32%, rgba(40,26,16,0.55) 100%)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(130% 120% at 50% 45%, transparent 55%, rgba(24,14,7,0.42) 100%)' }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-14 text-center">
        <p className="kicker text-caramel" data-reveal style={{ color: '#e6bd84' }}>Simplicity</p>
        <h2
          className="serif mt-4 text-paper"
          data-reveal
          data-reveal-delay="0.06"
          style={{ fontSize: 'clamp(1.8rem, 4.6vw, 3.5rem)', lineHeight: 1.05, textShadow: '0 2px 26px rgba(24,14,7,0.55)' }}
        >
          <span className="italic-serif">Joy is found in the little things.</span>
        </h2>
      </div>
    </section>
  )
}
