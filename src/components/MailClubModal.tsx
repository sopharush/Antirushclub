import { useEffect, useRef, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { useReady } from '../lib/ReadyContext'

const encode = (d: Record<string, string>) =>
  Object.keys(d).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(d[k])).join('&')

export default function MailClubModal() {
  const { ready } = useReady()
  const [open, setOpen] = useState(false)
  const [show, setShow] = useState(false)
  const [done, setDone] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const firstRef = useRef<HTMLInputElement>(null)

  // pop up ~2s after the site is revealed, unless already submitted / dismissed this visit
  useEffect(() => {
    if (!ready) return
    let submitted = false
    let dismissed = false
    try { submitted = localStorage.getItem('arc_mailclub') === 'submitted' } catch { /* storage blocked */ }
    try { dismissed = sessionStorage.getItem('arc_mailclub_dismissed') === '1' } catch { /* storage blocked */ }
    if (submitted || dismissed) return
    const t = setTimeout(() => setOpen(true), 700)
    return () => clearTimeout(t)
  }, [ready])

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
    try { sessionStorage.setItem('arc_mailclub_dismissed', '1') } catch { /* storage blocked */ }
    setTimeout(() => setOpen(false), 260)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSending(true)
    setError('')
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': 'mail-club', firstName, email, 'bot-field': '' }),
      })
      try { localStorage.setItem('arc_mailclub', 'submitted') } catch { /* storage blocked */ }
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
      aria-label="Join the Anti-Rush Club Mail Club"
    >
      <div
        className={`relative w-full max-w-[428px] overflow-hidden rounded-[20px] bg-choc shadow-2xl transition-all duration-300 ${show ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-[0.97] opacity-0'}`}
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
          <img src="/photos/hero-7.jpg" alt="" className="h-full w-full object-cover" style={{ objectPosition: 'center 60%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(58,35,24,0) 35%, rgba(58,35,24,1) 100%)' }} />
        </div>

        <div className="px-7 pb-8 pt-1 md:px-8">
          {done ? (
            <div className="py-5 text-center">
              <p className="kicker" style={{ color: '#e6bd84' }}>You’re on the list ✦</p>
              <h2 className="serif mt-3 text-cream" style={{ fontSize: '1.7rem', lineHeight: 1.12 }}>Keep an eye on your mailbox.</h2>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-cream/75">
                Something slow and lovely is on its way. We’ll be in touch the moment the Mail Club opens.
              </p>
              <button onClick={close} className="kicker mt-6 inline-block rounded-full bg-cream px-7 py-3 text-espresso transition-transform hover:-translate-y-0.5">
                Back to the site
              </button>
            </div>
          ) : (
            <>
              <p className="kicker" style={{ color: '#e6bd84' }}>The Mail Club · coming soon</p>
              <h2 className="serif mt-3 text-cream" style={{ fontSize: 'clamp(1.6rem, 5vw, 2rem)', lineHeight: 1.08 }}>
                Join the <span className="italic-serif">Mail Club.</span>
              </h2>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-cream/80">
                We’re opening something slow and sacred — real mail, sent to your actual door. Leave your name and
                you’ll be first in line when the mailbox opens.
              </p>

              <form name="mail-club" method="POST" onSubmit={submit} className="mt-5 space-y-3">
                <input type="hidden" name="form-name" value="mail-club" />
                <p className="hidden"><label>Don’t fill this out: <input name="bot-field" /></label></p>
                <input
                  ref={firstRef}
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  autoComplete="given-name"
                  className="w-full rounded-xl border border-cream/25 bg-cream/10 px-4 py-3 text-[0.95rem] text-cream placeholder-cream/45 outline-none transition-colors focus:border-caramel"
                />
                <input
                  type="email"
                  required
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                  className="w-full rounded-xl border border-cream/25 bg-cream/10 px-4 py-3 text-[0.95rem] text-cream placeholder-cream/45 outline-none transition-colors focus:border-caramel"
                />
                {error && <p className="text-[0.8rem] text-[#eaa37d]">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="kicker w-full rounded-full bg-cream py-3.5 text-espresso transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {sending ? 'Saving…' : 'Save my seat'}
                </button>
              </form>

              <p className="mt-3 text-center text-[0.68rem] tracking-wide text-cream/45">
                Come as you are. We’ll never rush your inbox.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
