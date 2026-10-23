type Tone = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

const TONES: Record<Tone, string> = {
  a: 'linear-gradient(150deg,#a5804f,#654a2c 60%,#352213)',
  b: 'linear-gradient(160deg,#9a7646,#4f3920)',
  c: 'linear-gradient(120deg,#6f5333,#3a2616 70%,#1d110a)',
  d: 'linear-gradient(140deg,#b08a52,#6d4f2e 58%,#3a2718)',
  e: 'linear-gradient(120deg,#bd9760,#7d5f38 48%,#44301a)',
  f: 'linear-gradient(160deg,#8a6a40,#4a3620)',
}

/** Foreground photographic print placeholder. Pair with `vframe` for the
 *  vintage bordered look. Swap for an <img> later. */
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
            'radial-gradient(120% 90% at 25% 18%, rgba(240,229,206,.18), transparent 55%), radial-gradient(120% 95% at 85% 92%, rgba(24,14,7,.5), transparent 60%)',
          mixBlendMode: 'multiply',
        }}
      />
      {label && (
        <span className="kicker absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.6rem] text-paper/75">
          {label}
        </span>
      )}
    </div>
  )
}
