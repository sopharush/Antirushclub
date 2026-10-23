import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'The Club', href: '#why' },
  { label: 'Values', href: '#values' },
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-paper/85 backdrop-blur-md border-b border-choc/10' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-5 md:px-10">
        <a href="#top" className="serif text-choc text-[1.15rem] font-semibold tracking-[0.08em]">
          Anti-Rush Club
        </a>
        <nav className="flex items-center gap-7">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="kicker hidden text-ink/75 transition-opacity hover:opacity-100 md:inline"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#invitation"
            className="kicker rounded-full border border-choc/40 px-5 py-2 text-choc transition-colors hover:bg-choc hover:text-paper"
          >
            Pull Up a Chair
          </a>
        </nav>
      </div>
    </header>
  )
}
