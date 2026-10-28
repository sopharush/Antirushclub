import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Check, Copy, Download, LogOut, RefreshCw, Search } from 'lucide-react'

type Signup = { firstName: string; email: string; createdAt: string; interests?: string[] }
type List = 'club' | 'mail'
type Counts = Record<List, number>

const LISTS: { id: List; label: string }[] = [
  { id: 'club', label: 'Pull Up a Chair' },
  { id: 'mail', label: 'Mail Club' },
]
const INTEREST_LABELS: Record<string, string> = {
  events: 'Events',
  'pop-ups': 'Pop-ups',
  merch: 'Merch',
  'mail-club': 'Mail Club',
}

const KEY_STORAGE = 'arc_admin_key'
const DAY = 864e5

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const shortDay = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
const fullDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

// Guard spreadsheet apps against formula injection from typed-in names.
const csvCell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`

const saveKey = (k: string) => { try { sessionStorage.setItem(KEY_STORAGE, k) } catch { /* storage blocked */ } }
const clearKey = () => { try { sessionStorage.removeItem(KEY_STORAGE) } catch { /* storage blocked */ } }
const readKey = () => { try { return sessionStorage.getItem(KEY_STORAGE) ?? '' } catch { return '' } }

const btn =
  'kicker inline-flex items-center gap-2 rounded-full border border-espresso/20 px-4 py-2.5 text-[0.62rem] text-espresso transition-colors hover:bg-espresso hover:text-cream disabled:opacity-50'

export default function Admin() {
  const [key, setKey] = useState(readKey)
  const [code, setCode] = useState('')
  const [items, setItems] = useState<Signup[] | null>(null)
  const [list, setList] = useState<List>('club')
  const [counts, setCounts] = useState<Counts | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Admin · Anti-Rush Club'
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => { meta.remove() }
  }, [])

  const load = useCallback(async (k: string, l: List) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/.netlify/functions/admin-signups?list=${l}`, { headers: { 'x-admin-key': k }, cache: 'no-store' })
      if (res.status === 401) {
        clearKey()
        setKey('')
        setItems(null)
        setError('That passcode didn’t match.')
        return
      }
      if (res.status === 503) {
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        setError(
          body.error === 'not_configured'
            ? 'The admin passcode isn’t set up on Netlify yet (ADMIN_PASSWORD).'
            : 'Couldn’t reach the signup database. Check DATABASE_URL on Netlify.',
        )
        return
      }
      if (!res.ok) throw new Error(String(res.status))
      const data = (await res.json()) as { items: Signup[]; counts: Counts }
      setItems(data.items)
      setCounts(data.counts)
      setList(l)
      setQuery('')
      setKey(k)
      saveKey(k)
    } catch {
      setError('Couldn’t reach the server. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Re-open a session that's still in this tab.
  useEffect(() => {
    if (key) load(key, 'club')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stats = useMemo(() => {
    if (!items) return null
    const now = Date.now()
    const counts = new Map<string, number>()
    for (const s of items) {
      const k = dayKey(new Date(s.createdAt))
      counts.set(k, (counts.get(k) ?? 0) + 1)
    }
    const within = (days: number) => items.filter((s) => now - Date.parse(s.createdAt) < days * DAY).length
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now - (29 - i) * DAY)
      return { k: dayKey(d), d, n: counts.get(dayKey(d)) ?? 0 }
    })
    return {
      total: items.length,
      today: counts.get(dayKey(new Date(now))) ?? 0,
      week: within(7),
      month: within(30),
      days,
      max: Math.max(1, ...days.map((x) => x.n)),
    }
  }, [items])

  const filtered = useMemo(() => {
    if (!items) return []
    const q = query.trim().toLowerCase()
    return q ? items.filter((s) => s.email.includes(q) || s.firstName.toLowerCase().includes(q)) : items
  }, [items, query])

  const logout = () => {
    clearKey()
    setKey('')
    setItems(null)
    setCode('')
  }

  const exportCsv = () => {
    if (!items) return
    const club = list === 'club'
    const rows = [
      ['First name', 'Email', 'Signed up', ...(club ? ['Interests'] : [])],
      ...items.map((s) => [s.firstName, s.email, s.createdAt, ...(club ? [(s.interests ?? []).join('; ')] : [])]),
    ]
    const csv = rows.map((r) => r.map(csvCell).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${club ? 'pull-up-a-chair' : 'mail-club'}-signups-${dayKey(new Date())}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyEmails = async () => {
    if (!items) return
    try {
      await navigator.clipboard.writeText(items.map((s) => s.email).join(', '))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch { /* clipboard blocked */ }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (code.trim()) load(code.trim(), 'club')
  }

  if (!items || !stats) {
    const reopening = Boolean(key) && loading
    return (
      <main className="grid min-h-screen place-items-center bg-cream px-5">
        <form onSubmit={submit} className="w-full max-w-[380px] rounded-[20px] bg-choc px-8 py-10 text-center shadow-2xl">
          <p className="kicker" style={{ color: '#e6bd84' }}>Anti-Rush Club · Admin</p>
          <h1 className="serif mt-3 text-cream" style={{ fontSize: '1.8rem', lineHeight: 1.1 }}>Club signups</h1>
          {reopening ? (
            <p className="mt-6 text-[0.9rem] text-cream/70">Opening your dashboard…</p>
          ) : (
            <>
              <p className="mt-3 text-[0.88rem] text-cream/70">Enter the passcode to see who’s joined.</p>
              <input
                type="password"
                inputMode="numeric"
                autoComplete="current-password"
                autoFocus
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Passcode"
                aria-label="Passcode"
                className="mt-6 w-full rounded-xl border border-cream/25 bg-cream/10 px-4 py-3 text-center text-[1.05rem] tracking-[0.3em] text-cream placeholder-cream/40 outline-none transition-colors focus:border-caramel"
              />
              {error && <p className="mt-3 text-[0.82rem] text-[#eaa37d]">{error}</p>}
              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="kicker mt-5 w-full rounded-full bg-cream py-3.5 text-espresso transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? 'Checking…' : 'Enter'}
              </button>
            </>
          )}
        </form>
      </main>
    )
  }

  const tiles = [
    { label: 'Total signups', value: stats.total },
    { label: 'Today', value: stats.today },
    { label: 'Last 7 days', value: stats.week },
    { label: 'Last 30 days', value: stats.month },
  ]

  return (
    <main className="min-h-screen bg-cream px-5 py-10 text-ink md:px-10">
      <div className="mx-auto max-w-[1100px]">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kicker text-sienna">Anti-Rush Club · Admin</p>
            <h1 className="serif mt-2 text-espresso" style={{ fontSize: 'clamp(2rem, 4vw, 2.6rem)', lineHeight: 1 }}>
              Club signups
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className={btn} onClick={() => load(key, list)} disabled={loading}>
              <RefreshCw size={13} strokeWidth={1.8} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button className={btn} onClick={exportCsv} disabled={!items.length}>
              <Download size={13} strokeWidth={1.8} /> Export CSV
            </button>
            <button className={btn} onClick={copyEmails} disabled={!items.length}>
              {copied ? <Check size={13} strokeWidth={1.8} /> : <Copy size={13} strokeWidth={1.8} />}
              {copied ? 'Copied' : 'Copy emails'}
            </button>
            <button className={btn} onClick={logout}>
              <LogOut size={13} strokeWidth={1.8} /> Log out
            </button>
          </div>
        </header>

        <nav className="mt-7 flex gap-2" aria-label="Signup lists">
          {LISTS.map((l) => (
            <button
              key={l.id}
              onClick={() => l.id !== list && load(key, l.id)}
              aria-current={l.id === list}
              disabled={loading}
              className={`kicker rounded-full px-4 py-2.5 text-[0.62rem] transition-colors ${
                l.id === list ? 'bg-espresso text-cream' : 'border border-espresso/20 text-espresso hover:bg-espresso/10'
              }`}
            >
              {l.label}
              {counts && <span className={l.id === list ? 'ml-2 text-cream/60' : 'ml-2 text-inksoft'}>{counts[l.id]}</span>}
            </button>
          ))}
        </nav>

        {error && <p className="mt-4 text-[0.85rem] text-sienna">{error}</p>}

        <section className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-2xl border border-espresso/10 bg-paper/70 px-5 py-5">
              <p className="kicker text-[0.6rem] text-inksoft">{t.label}</p>
              <p className="serif mt-2 text-espresso" style={{ fontSize: '2.4rem', lineHeight: 1 }}>{t.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-2xl border border-espresso/10 bg-paper/70 px-5 py-6 md:px-7">
          <p className="kicker text-[0.6rem] text-inksoft">Signups per day · last 30 days</p>
          <div className="mt-5 flex h-36 items-end gap-[3px]" role="img" aria-label={`Signups per day for the last 30 days, peak ${stats.max} in a day`}>
            {stats.days.map((x) => (
              <div
                key={x.k}
                title={`${shortDay(x.d)}: ${x.n}`}
                className="flex-1 rounded-t-[3px] bg-caramel"
                style={{ height: x.n ? `${Math.max(4, (x.n / stats.max) * 100)}%` : '2px', opacity: x.n ? 1 : 0.25 }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[0.72rem] text-inksoft">
            <span>{shortDay(stats.days[0].d)}</span>
            <span>Peak: {stats.max} in a day</span>
            <span>Today</span>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-espresso/10 bg-paper/70 px-5 py-6 md:px-7">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="kicker text-[0.6rem] text-inksoft">
              Showing {filtered.length} of {items.length}
            </p>
            <label className="flex items-center gap-2 rounded-full border border-espresso/15 bg-cream px-4 py-2 md:w-72">
              <Search size={14} strokeWidth={1.8} className="text-inksoft" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or email"
                aria-label="Search signups"
                className="w-full bg-transparent text-[0.9rem] outline-none placeholder:text-inksoft/70"
              />
            </label>
          </div>

          {items.length === 0 ? (
            <p className="py-12 text-center text-[0.95rem] text-inksoft">
              No signups on this list yet. They’ll show up here the moment someone joins.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-[0.92rem]">
                <thead>
                  <tr className="border-b border-espresso/15 text-inksoft">
                    <th className="kicker py-3 pr-4 text-[0.6rem] font-medium">#</th>
                    <th className="kicker py-3 pr-4 text-[0.6rem] font-medium">First name</th>
                    <th className="kicker py-3 pr-4 text-[0.6rem] font-medium">Email</th>
                    <th className="kicker py-3 pr-4 text-[0.6rem] font-medium">Signed up</th>
                    {list === 'club' && <th className="kicker py-3 text-[0.6rem] font-medium">Interests</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.email} className="border-b border-espresso/[0.07]">
                      <td className="py-3 pr-4 text-inksoft">{items.length - items.indexOf(s)}</td>
                      <td className="py-3 pr-4 text-espresso">{s.firstName || <span className="text-inksoft">—</span>}</td>
                      <td className="py-3 pr-4">
                        <a href={`mailto:${s.email}`} className="text-espresso underline decoration-espresso/20 underline-offset-4 hover:decoration-sienna">
                          {s.email}
                        </a>
                      </td>
                      <td className="whitespace-nowrap py-3 pr-4 text-inksoft">{fullDate(s.createdAt)}</td>
                      {list === 'club' && (
                        <td className="py-3 text-inksoft">
                          {s.interests?.length ? s.interests.map((i) => INTEREST_LABELS[i] ?? i).join(', ') : <span>—</span>}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
