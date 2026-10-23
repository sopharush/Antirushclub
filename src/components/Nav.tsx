import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Our Why', href: '#why' },
  { label: 'The Series', href: '#series' },
  { label: 'The Experience', href: '#experience' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const textCls = 'text-ink'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-cocoa/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className={`serif text-[1.15rem] font-semibold tracking-[0.08em] transition-colors duration-500 ${textCls}`}>
          Anti-Rush Club
        </a>
        <nav className="flex items-center gap-7">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`kicker hidden transition-colors duration-500 hover:opacity-70 md:inline ${textCls}`}>
              {l.label}
            </a>
          ))}
          <a
            href="#invitation"
            className="kicker rounded-full border border-sienna/50 px-5 py-2 text-sienna transition-colors duration-300 hover:bg-sienna hover:text-cream"
          >
            Pull Up a Chair
          </a>
        </nav>
      </div>
    </header>
  )
}
