import { createHash, timingSafeEqual } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { db } from '../lib/db.mts'

// Returns one signup list for the /admin dashboard: ?list=club ("Pull Up a Chair",
// the default) or ?list=mail (Mail Club), plus the size of each list.
// Requires the x-admin-key header to match the ADMIN_PASSWORD env var.
// Served at /.netlify/functions/admin-signups.

type Signup = { firstName: string; email: string; createdAt: string; interests?: string[] }
type Row = { first_name: string; email: string; created_at: string | Date; interests?: string[] }

const NO_STORE = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex' }

const matches = (given: string, expected: string) =>
  timingSafeEqual(createHash('sha256').update(given).digest(), createHash('sha256').update(expected).digest())

// One-time carry-over of signups saved to Netlify Blobs before the move to Neon.
// Each entry is removed only after it is safely in Postgres. Safe to delete once Blobs is empty.
async function importBlobSignups() {
  const store = getStore({ name: 'mail-club', consistency: 'strong' })
  const { blobs } = await store.list()
  for (const b of blobs) {
    const s = (await store.get(b.key, { type: 'json' })) as Signup | null
    if (s) {
      await db()`insert into mail_club_signups (email, first_name, created_at)
                 values (${s.email.toLowerCase()}, ${s.firstName ?? ''}, ${s.createdAt})
                 on conflict (email) do nothing`
    }
    await store.delete(b.key)
  }
}

export default async (req: Request) => {
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405 })

  const expected = Netlify.env.get('ADMIN_PASSWORD')
  if (!expected) return Response.json({ error: 'not_configured' }, { status: 503, headers: NO_STORE })

  if (!matches(req.headers.get('x-admin-key') ?? '', expected)) {
    await new Promise((r) => setTimeout(r, 900)) // slow down guessing
    return Response.json({ error: 'unauthorized' }, { status: 401, headers: NO_STORE })
  }

  try {
    await importBlobSignups()
  } catch (err) {
    console.error('Blobs carry-over skipped:', err)
  }

  const list = new URL(req.url).searchParams.get('list') === 'mail' ? 'mail' : 'club'
  let rows: Row[]
  let counts: { club: number; mail: number }
  try {
    rows = (
      list === 'mail'
        ? await db()`select first_name, email, created_at from mail_club_signups order by created_at desc`
        : await db()`select first_name, email, created_at, interests from club_signups order by created_at desc`
    ) as Row[]
    ;[counts] = (await db()`select (select count(*) from club_signups)::int as club,
                                   (select count(*) from mail_club_signups)::int as mail`) as { club: number; mail: number }[]
  } catch (err) {
    console.error('admin-signups failed:', err)
    return Response.json({ error: 'unavailable' }, { status: 503, headers: NO_STORE })
  }

  const items: Signup[] = rows.map((r) => ({
    firstName: r.first_name,
    email: r.email,
    createdAt: new Date(r.created_at).toISOString(),
    ...(r.interests ? { interests: r.interests } : {}),
  }))

  return Response.json({ list, items, counts }, { headers: NO_STORE })
}
