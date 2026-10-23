type Tone = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g'

const TONES: Record<Tone, string> = {
  a: 'linear-gradient(150deg,#8a6d52,#5a4433 60%,#33261c)',
  b: 'linear-gradient(160deg,#7a604a,#453325)',
  c: 'linear-gradient(120deg,#5a4636,#33261a 70%,#1c130c)',
  d: 'linear-gradient(140deg,#9c7a58,#654c38 60%,#3a2b1f)',
  e: 'linear-gradient(120deg,#b08c64,#7d6046 45%,#453322)',
  f: 'linear-gradient(160deg,#856848,#4a3924)',
  g: 'linear-gradient(130deg,#5c4835,#33271a 70%,#1a120b)',
}

/** Placeholder for real photography. Swap the gradient for an <img> later. */
export default function Photo({
  tone = 'd',
  label,
  className = '',
}: {
  tone?: Tone
  label?: string
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: TONES[tone] }}
      role="img"
      aria-label={label ? `Photograph: ${label}` : 'Photograph'}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 22% 15%, rgba(255,250,244,.16), transparent 55%), radial-gradient(120% 90% at 85% 92%, rgba(0,0,0,.4), transparent 60%)',
          mixBlendMode: 'overlay',
        }}
      />
      {label && (
        <span className="kicker absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.6rem] text-cream/70">
          {label}
        </span>
      )}
    </div>
  )
}
