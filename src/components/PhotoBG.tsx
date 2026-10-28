/** Full-bleed photographic background: warm-graded image + film overlays +
 *  Ken-Burns drift. Overlays keep overlaid type legible. */
export default function PhotoBG({
  src,
  overlay = 0.4,
  kenburns = true,
  position = 'center',
  className = '',
}: {
  src: string
  overlay?: number
  kenburns?: boolean
  position?: string
  className?: string
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <img
        src={src}
        alt=""
        className={`absolute inset-0 h-full w-full object-cover ${kenburns ? 'kenburns' : ''}`}
        style={{ objectPosition: position }}
        loading="lazy"
        decoding="async"
      />
      {/* warm sepia mute */}
      <div className="absolute inset-0" style={{ background: '#281a10', opacity: overlay, mixBlendMode: 'multiply' }} />
      {/* legibility gradient + faint warm glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(40,26,16,0) 28%, rgba(40,26,16,0.55) 100%), radial-gradient(90% 80% at 30% 28%, rgba(192,144,79,0.14), transparent 60%)',
        }}
      />
      {/* local vignette */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(125% 110% at 50% 45%, transparent 55%, rgba(24,14,7,0.45) 100%)' }}
      />
    </div>
  )
}
