import type { CSSProperties, ReactNode } from 'react'

/**
 * "Taped to the wall" — a scrapbook strip of prints held up with masking,
 * clear and gaffer tape, in the spirit of a pinned-up mood board. Every tape
 * piece is pure CSS (see `.tape*` in index.css), so there are no extra assets.
 */

type TapeKind = 'masking' | 'clear' | 'gaffer' | 'blush'

function Tape({
  kind,
  style,
  children,
  className = '',
}: {
  kind: TapeKind
  style?: CSSProperties
  children?: ReactNode
  className?: string
}) {
  return (
    <span aria-hidden="true" className={`tape tape--${kind} ${className}`} style={style}>
      {children}
    </span>
  )
}

function Print({
  src,
  alt,
  position = 'center',
  className = '',
  children,
}: {
  src: string
  alt: string
  position?: string
  className?: string
  children?: ReactNode
}) {
  return (
    <figure className={`print relative m-0 ${className}`}>
      <div className="print__paper">
        <img src={src} alt={alt} loading="lazy" decoding="async" style={{ objectPosition: position }} />
        <span className="print__folds" aria-hidden="true" />
      </div>
      {children}
    </figure>
  )
}

export default function Scrapbook() {
  return (
    <section id="moments" className="scrapbook relative overflow-hidden bg-espresso py-20 text-paper md:py-28">
      {/* soft window light falling across the wall */}
      <div className="scrapbook__light" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-[1240px] items-start justify-between px-6 md:px-10">
        <div>
          <p className="kicker" style={{ color: '#e6bd84' }} data-reveal>Pinned Up · Field Notes</p>
          <h2 className="serif mt-4 text-paper" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)', lineHeight: 1.08 }}>
            <span className="mask-line"><span className="mask-inner">Proof we stopped</span></span>
            <span className="mask-line"><span className="mask-inner italic-serif text-sand">long enough to laugh.</span></span>
          </h2>
        </div>
        <p className="kicker hidden pt-1 text-paper/60 md:block" data-reveal>Vol. 01</p>
      </div>

      {/* the strip */}
      <div className="relative z-10 mt-14 md:mt-16" data-reveal>
        <div className="scrapbook__strip">
          <Print src="/photos/gal-4.jpg" alt="Anti-Rush Club — leaning in close" position="center 28%" className="scrapbook__p1">
            <Tape kind="clear" style={{ top: '-5%', left: '6%', width: '58%', transform: 'rotate(-2deg)' }} />
            <Tape kind="masking" style={{ top: '72%', left: '-8%', width: '72%', transform: 'rotate(-3deg)' }} />
            <Tape kind="masking" style={{ top: '81%', left: '6%', width: '56%', transform: 'rotate(-5deg)' }} />
          </Print>

          <Print src="/photos/hero-1.jpg" alt="Anti-Rush Club — the two of us, mid-laugh" position="58% 30%" className="scrapbook__p2">
            <Tape kind="clear" className="tape--corner" style={{ top: '-3%', left: '-5%', width: '24%', transform: 'rotate(-38deg)' }} />
            <Tape kind="clear" className="tape--corner" style={{ top: '-2%', right: '-5%', width: '24%', transform: 'rotate(40deg)' }} />
            <Tape kind="clear" className="tape--corner" style={{ bottom: '-2%', left: '-4%', width: '22%', transform: 'rotate(42deg)' }} />
            <Tape kind="gaffer" style={{ bottom: '9%', right: '7%', width: '38%', transform: 'rotate(-4deg)' }}>
              <span className="tape__label">no rush, just us</span>
            </Tape>
          </Print>

          <Print src="/photos/gal-2.jpg" alt="Anti-Rush Club — laughing together" position="center 22%" className="scrapbook__p3">
            <Tape kind="clear" style={{ top: '-6%', left: '18%', width: '56%', transform: 'rotate(1.5deg)' }} />
            <Tape kind="blush" style={{ top: '84%', right: '-12%', width: '50%', transform: 'rotate(-30deg)' }} />
            <Tape kind="blush" style={{ top: '90%', right: '-4%', width: '38%', transform: 'rotate(14deg)' }} />
          </Print>

          <Print src="/photos/pause.jpg" alt="Anti-Rush Club — a quiet moment" position="center 30%" className="scrapbook__p4">
            <Tape kind="gaffer" style={{ top: '-3%', left: '24%', width: '46%', transform: 'rotate(-1deg)' }} />
          </Print>

          {/* masking-tape arrow pointing at the close-up */}
          <div className="scrapbook__arrow" aria-hidden="true">
            <Tape kind="masking" className="arrow__shaft" />
            <Tape kind="masking" className="arrow__head arrow__head--up" />
            <Tape kind="masking" className="arrow__head arrow__head--down" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-14 flex max-w-[1240px] items-end justify-between gap-6 px-6 md:mt-16 md:px-10">
        <p className="max-w-[26rem] text-[0.92rem] leading-[1.85] text-paper/75" data-reveal>
          Real moments, taped to the wall where we can see them — a reminder that the good stuff
          happens when nobody’s in a hurry.
        </p>
        <p className="kicker hidden text-paper/60 md:block" data-reveal>Anti-Rush Club</p>
      </div>
    </section>
  )
}
