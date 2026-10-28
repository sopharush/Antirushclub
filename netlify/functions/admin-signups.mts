import { createHash, timingSafeEqual } from 'node:crypto'
import { getStore } from '@netlify/blobs'

// Returns every Mail Club signup for the /admin dashboard.
// Requires the x-admin-key header to match the ADMIN_PASSWORD env var.
// Served at /.netlify/functions/admin-signups.

type Signup = { firstName: string; email: string; createdAt: string }

const NO_STORE = { 'cache-control': 'no-store', 'x-robots-tag': 'noindex' }

const matches = (given: string, expected: string) =>
  timingSafeEqual(createHash('sha256').update(given).digest(), createHash('sha256').update(expected).digest())

export default async (req: Request) => {
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405 })

  const expected = Netlify.env.get('ADMIN_PASSWORD')
  if (!expected) return Response.json({ error: 'not_configured' }, { status: 503, headers: NO_STORE })

  if (!matches(req.headers.get('x-admin-key') ?? '', expected)) {
    await new Promise((r) => setTimeout(r, 900)) // slow down guessing
    return Response.json({ error: 'unauthorized' }, { status: 401, headers: NO_STORE })
  }

  const store = getStore({ name: 'mail-club', consistency: 'strong' })
  const { blobs } = await store.list()

  const items: Signup[] = []
  for (let i = 0; i < blobs.length; i += 50) {
    const batch = await Promise.all(
      blobs.slice(i, i + 50).map((b) => store.get(b.key, { type: 'json' }) as Promise<Signup | null>),
    )
    for (const s of batch) if (s) items.push(s)
  }
  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return Response.json({ items }, { headers: NO_STORE })
}
