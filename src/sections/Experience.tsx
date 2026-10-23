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
    <section id="experience" className="bg-cream2 py-28 md:py-40">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-16 px-6 md:grid-cols-[0.9fr_1.1fr] md:px-10">
        <div className="relative order-2 md:order-1">
          <Photo src="/photos/exp-main.jpg" alt="Resting together" position="center 35%" className="vframe aspect-[4/5] w-full" />
          <div className="absolute -right-7 -top-9 hidden lg:block" data-parallax="90">
            <Photo src="/photos/exp-small.jpg" alt="Side by side" position="center 40%" className="vframe h-48 w-36" />
          </div>
        </div>

        <div className="order-1 md:order-2">
          <p className="kicker text-sienna" data-reveal>The Experience</p>
          <h2 className="serif mt-6 text-ink" style={{ fontSize: 'clamp(1.95rem, 4.2vw, 3.3rem)', lineHeight: 1.06 }}>
            <span className="mask-line"><span className="mask-inner">It should feel like</span></span>
            <span className="mask-line"><span className="mask-inner italic-serif text-sienna">coming home.</span></span>
          </h2>

          <ul className="mt-10 divide-y divide-cocoa/15 border-y border-cocoa/15" data-reveal-group>
            {FEELS.map((f) => (
              <li key={f} className="serif flex items-baseline gap-4 py-4 text-ink" style={{ fontSize: 'clamp(1.2rem,2.4vw,1.8rem)' }}>
                <span className="kicker text-[0.6rem] text-sienna/70">✦</span>
                {f}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-[32rem] text-[0.96rem] leading-[1.9] text-inksoft" data-reveal>
            People don’t come because everything is perfect. They come because they belong. There’s
            always room at the table — and a cup waiting with your name on it.
          </p>
        </div>
      </div>
    </section>
  )
}
