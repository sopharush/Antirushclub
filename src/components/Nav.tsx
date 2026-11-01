import { useEffect, useState } from 'react'
import { openClubSignup } from '../lib/clubSignup'
import Wordmark from './Wordmark'

const LINKS = [
  { label: 'Our Why', href: '#why' },
  { label: 'The Series', href: '#series' },
  { label: 'The Experience', href: '#experience' },
]

export default function Nav() {
  // Hidden while the hero (which already carries the wordmark) fills the screen.
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('top')
      const limit = hero ? hero.offsetHeight - 90 : 40
      setShown(window.scrollY > limit)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const textCls = 'text-ink'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-cocoa/10 bg-cream/90 backdrop-blur-md transition-all duration-500 ${
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0'
      }`}
      aria-hidden={!shown}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-6 py-3 md:px-10">
        <a href="#top" aria-label="Anti-Rush Club, back to top" className="text-brand transition-opacity hover:opacity-80">
          <Wordmark className="block h-10 w-auto md:h-11" />
        </a>
        <nav className="flex items-center gap-7">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={`kicker hidden transition-colors duration-500 hover:opacity-70 md:inline ${textCls}`}>
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={openClubSignup}
            tabIndex={shown ? 0 : -1}
            className="kicker rounded-full border border-sienna/50 px-5 py-2 text-sienna transition-colors duration-300 hover:bg-sienna hover:text-cream"
          >
            Pull Up a Chair
          </button>
        </nav>
      </div>
    </header>
  )
}
