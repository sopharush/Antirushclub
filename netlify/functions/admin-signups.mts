import { createHash, timingSafeEqual } from 'node:crypto'
import { getStore } from '@netlify/blobs'
import { db } from '../lib/db.mts'

// Returns every Mail Club signup for the /admin dashboard.
// Requires the x-admin-key header to match the ADMIN_PASSWORD env var.
// Served at /.netlify/functions/admin-signups.

type Signup = { firstName: string; email: string; createdAt: string }
type Row = { first_name: string; email: string; created_at: string | Date }

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

  const rows = (await db()`select first_name, email, created_at from mail_club_signups order by created_at desc`) as Row[]
  const items: Signup[] = rows.map((r) => ({
    firstName: r.first_name,
    email: r.email,
    createdAt: new Date(r.created_at).toISOString(),
  }))

  return Response.json({ items }, { headers: NO_STORE })
}
