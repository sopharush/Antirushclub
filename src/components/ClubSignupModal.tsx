import { useEffect, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { OPEN_CLUB_SIGNUP } from '../lib/clubSignup'

// Opened by every "Pull Up a Chair" button: an email list for gatherings, pop-ups,
// merch and other club news.

const INTERESTS = [
  { id: 'events', label: 'Gatherings & events' },
  { id: 'pop-ups', label: 'Pop-ups' },
  { id: 'merch', label: 'Merch' },
  { id: 'mail-club', label: 'The Mail Club' },
]

const encode = (d: Record<string, string>) =>
  Object.keys(d).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(d[k])).join('&')

const field =
  'w-full rounded-xl border border-cream/25 bg-cream/10 px-4 py-3 text-[0.95rem] text-cream placeholder-cream/45 outline-none transition-colors focus:border-caramel'

export default function ClubSignupModal() {
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const firstRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onOpen = () => {
      // Don't stack the timed Mail Club pop-up on top of this one later in the visit.
      try { sessionStorage.setItem('arc_mailclub_dismissed', '1') } catch { /* storage blocked */ }
      setDone(false)
      setError('')
      setOpen(true)
    }
    window.addEventListener(OPEN_CLUB_SIGNUP, onOpen)
    return () => window.removeEventListener(OPEN_CLUB_SIGNUP, onOpen)
  }, [])

  useEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => setShow(true))
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusT = setTimeout(() => firstRef.current?.focus(), 350)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(focusT)
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = () => {
    setShow(false)
    setTimeout(() => setOpen(false), 260)
  }

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return
    setSending(true)
    setError('')
    const botField = String(new FormData(e.currentTarget).get('bot-field') ?? '')
    const body = encode({ 'form-name': 'club-updates', firstName, email, interests: picked.join(','), 'bot-field': botField })
    const post = (url: string) =>
      fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    try {
      // Postgres feeds the /admin dashboard; Netlify Forms keeps a backup + email notifications.
      const results = await Promise.allSettled([post('/.netlify/functions/club-signup'), post('/__forms.html')])
      if (!results.some((r) => r.status === 'fulfilled' && r.value.ok)) throw new Error('not saved')
      setDone(true)
    } catch {
      setError('Hmm, that didn’t go through. Try again in a moment.')
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center px-5 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      style={{ background: 'rgba(24,14,7,0.72)', backdropFilter: 'blur(3px)' }}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Pull up a chair: hear from the Anti-Rush Club"
    >
      <div
        className={`relative max-h-[92vh] w-full max-w-[440px] overflow-y-auto rounded-[20px] bg-choc shadow-2xl transition-all duration-300 ${show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-[0.97] opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-espresso/45 text-cream/90 transition-colors hover:bg-espresso/80"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div className="relative h-36 w-full overflow-hidden">
          <img src="/photos/hero-5.jpg" alt="" className="h-full w-full object-cover" style={{ objectPosition: 'center 38%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(58,35,24,0) 35%, rgba(58,35,24,1) 100%)' }} />
        </div>

        <div className="px-7 pb-8 pt-1 md:px-8">
          {done ? (
            <div className="py-5 text-center">
              <p className="kicker" style={{ color: '#e6bd84' }}>Your seat is saved ✦</p>
              <h2 className="serif mt-3 text-cream" style={{ fontSize: '1.7rem', lineHeight: 1.12 }}>Welcome to the club.</h2>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-cream/75">
                We’ll write when there’s something worth slowing down for — a gathering, a pop-up, a little something new.
              </p>
              <button onClick={close} className="kicker mt-6 inline-block rounded-full bg-cream px-7 py-3 text-espresso transition-transform hover:-translate-y-0.5">
                Back to the site
              </button>
            </div>
          ) : (
            <>
              <p className="kicker" style={{ color: '#e6bd84' }}>Pull up a chair</p>
              <h2 className="serif mt-3 text-cream" style={{ fontSize: 'clamp(1.6rem, 5vw, 2rem)', lineHeight: 1.08 }}>
                Hear from <span className="italic-serif">the club.</span>
              </h2>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-cream/80">
                Be the first to know about gatherings, pop-ups, merch and new ways to slow down together. A few warm
                notes, never a rush.
              </p>

              <form name="club-updates" method="POST" onSubmit={submit} className="mt-5 space-y-3">
                <input type="hidden" name="form-name" value="club-updates" />
                <p className="hidden"><label>Don’t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
                <input
                  ref={firstRef}
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  className={field}
                />
                <input
                  type="email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className={field}
                />
                <fieldset className="pt-1">
                  <legend className="text-[0.8rem] text-cream/65">I’d love to hear about <span className="text-cream/45">(optional)</span></legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {INTERESTS.map((it) => {
                      const on = picked.includes(it.id)
                      return (
                        <button
                          key={it.id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(it.id)}
                          className={`rounded-full border px-3.5 py-1.5 text-[0.8rem] transition-colors ${
                            on ? 'border-caramel bg-caramel text-espresso' : 'border-cream/25 text-cream/80 hover:border-cream/50'
                          }`}
                        >
                          {it.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
                {error && <p className="text-[0.8rem] text-[#eaa37d]">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="kicker w-full rounded-full bg-cream py-3.5 text-espresso transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {sending ? 'Saving…' : 'Count me in'}
                </button>
              </form>

              <p className="mt-3 text-center text-[0.68rem] tracking-wide text-cream/45">
                Come as you are. Unsubscribe anytime.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
