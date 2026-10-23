import Photo from '../components/Photo'

const FEELS = [
  'Sunday morning coffee',
  'A cozy bookstore',
  'A friend’s living room',
  'A warm blanket on a rainy day',
  'Deep conversations after church',
  'A place where you instantly feel safe',
]

export default function Experience() {
  return (
    <section id="experience" className="bg-paper2 py-28 md:py-40">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-[0.9fr_1.1fr] md:px-10">
        <div className="relative order-2 md:order-1">
          <Photo tone="e" label="around the table" className="aspect-[4/5] w-full rounded-sm" />
          <div className="absolute -right-6 -top-8 hidden lg:block" data-parallax="90">
            <Photo tone="c" label="what’s in your cup?" className="h-40 w-32 rounded-sm shadow-xl ring-8 ring-paper2" />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="kicker text-choc2" data-reveal>The experience</p>
          <h2 className="serif mt-6 text-choc" style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.2rem)', lineHeight: 1.06 }}>
            <span className="mask-line"><span className="mask-inner">It should feel like</span></span>
            <span className="mask-line"><span className="mask-inner italic-serif text-choc2">coming home.</span></span>
          </h2>

          <ul className="mt-10 divide-y divide-choc/10 border-y border-choc/10" data-reveal-group>
            {FEELS.map((f) => (
              <li key={f} className="serif flex items-baseline gap-4 py-4 text-choc" style={{ fontSize: 'clamp(1.2rem,2.4vw,1.75rem)' }}>
                <span className="kicker text-[0.6rem] text-choc2/60">✦</span>
                {f}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[32rem] text-[0.95rem] leading-[1.9] text-inksoft" data-reveal>
            People don’t come because everything is perfect. They come because they belong. There’s
            always room at the table — and a cup waiting with your name on it.
          </p>
        </div>
      </div>
    </section>
  )
}
