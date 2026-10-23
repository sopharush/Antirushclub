export type PhotoTone = 'morning' | 'bookstore' | 'living' | 'dusk' | 'table' | 'window' | 'film'

// Muted, warm, film-toned placeholders standing in for real photography.
// Swap the gradient for an <img> with object-cover later — the overlay +
// grain + vignette are tuned to keep any photo readable and nostalgic.
const TONES: Record<PhotoTone, string> = {
  morning: 'linear-gradient(135deg,#9a7a4e,#5f4428 58%,#2e1d10)',
  bookstore: 'linear-gradient(150deg,#7a5c38,#44301c 62%,#241607)',
  living: 'linear-gradient(120deg,#a07a4c,#604326 60%,#2c1c0f)',
  dusk: 'linear-gradient(125deg,#8a5f3a,#4a2f1a 60%,#1d110a)',
  table: 'linear-gradient(140deg,#ad8550,#6b4d2c 55%,#332012)',
  window: 'linear-gradient(115deg,#b89560,#7a5a34 50%,#3d2a16)',
  film: 'linear-gradient(130deg,#6e5234,#3a2616 70%,#180e07)',
}

export default function PhotoBG({
  tone = 'film',
  overlay = 0.5,
  kenburns = true,
  className = '',
}: {
  tone?: PhotoTone
  overlay?: number
  kenburns?: boolean
  className?: string
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div
        className={`absolute inset-0 ${kenburns ? 'kenburns' : ''}`}
        style={{ background: TONES[tone], transform: kenburns ? undefined : 'scale(1.04)' }}
      />
      {/* warm sepia mute */}
      <div className="absolute inset-0" style={{ background: 'rgba(40,26,16,1)', opacity: overlay, mixBlendMode: 'multiply' }} />
      {/* legibility gradient + warm glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(40,26,16,0.1) 0%, rgba(40,26,16,0) 35%, rgba(40,26,16,0.55) 100%), radial-gradient(90% 80% at 30% 30%, rgba(192,144,79,0.18), transparent 60%)',
        }}
      />
      {/* local vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(125% 110% at 50% 45%, transparent 52%, rgba(24,14,7,0.5) 100%)' }}
      />
    </div>
  )
}
