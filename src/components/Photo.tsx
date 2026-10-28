/** Foreground photographic print. Pair with `vframe` for the vintage bordered
 *  look. Warm grade is baked into the file. */
export default function Photo({
  src,
  alt = 'Anti-Rush Club',
  position = 'center',
  className = '',
}: {
  src: string
  alt?: string
  position?: string
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{ objectPosition: position }}
        loading="lazy"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(120% 95% at 85% 92%, rgba(24,14,7,.26), transparent 60%)',
          mixBlendMode: 'multiply',
        }}
      />
    </div>
  )
}
