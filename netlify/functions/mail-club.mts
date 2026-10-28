import { db } from '../lib/db.mts'

// Saves a Mail Club signup to Postgres (mail_club_signups), one row per email,
// so the /admin dashboard can list them. Served at /.netlify/functions/mail-club.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

async function readFields(req: Request): Promise<Record<string, unknown>> {
  const type = req.headers.get('content-type') ?? ''
  if (type.includes('application/json')) return (await req.json()) as Record<string, unknown>
  return Object.fromEntries(new URLSearchParams(await req.text()))
}

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  let fields: Record<string, unknown>
  try {
    fields = await readFields(req)
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  // Honeypot: real people never fill this; quietly accept and drop bots.
  if (String(fields['bot-field'] ?? '').trim()) return Response.json({ ok: true })

  const email = String(fields.email ?? '').trim().toLowerCase()
  const firstName = String(fields.firstName ?? '').trim().slice(0, 80)
  if (email.length > 254 || !EMAIL.test(email)) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  // Keep the original signup date when someone joins twice.
  try {
    await db()`insert into mail_club_signups (email, first_name) values (${email}, ${firstName}) on conflict (email) do nothing`
  } catch (err) {
    console.error('mail-club failed:', err)
    return Response.json({ ok: false, error: 'unavailable' }, { status: 503 })
  }

  return Response.json({ ok: true })
}
