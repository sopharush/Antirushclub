import { db } from '../lib/db.mts'

// Saves a "Pull Up a Chair" signup to Postgres (club_signups), one row per email.
// Joining again merges any newly picked interests. Served at /.netlify/functions/club-signup.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const INTERESTS = new Set(['events', 'pop-ups', 'merch', 'mail-club'])

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  let fields: Record<string, string>
  try {
    fields = Object.fromEntries(new URLSearchParams(await req.text()))
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  // Honeypot: real people never fill this; quietly accept and drop bots.
  if ((fields['bot-field'] ?? '').trim()) return Response.json({ ok: true })

  const email = (fields.email ?? '').trim().toLowerCase()
  const firstName = (fields.firstName ?? '').trim().slice(0, 80)
  if (email.length > 254 || !EMAIL.test(email)) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  // Only known ids reach the array literal, so it needs no escaping.
  const picked = [...new Set((fields.interests ?? '').split(',').filter((i) => INTERESTS.has(i)))]
  const interests = `{${picked.join(',')}}`

  try {
    await db()`insert into club_signups (email, first_name, interests)
             values (${email}, ${firstName}, ${interests}::text[])
             on conflict (email) do update set
               interests  = array(select distinct unnest(club_signups.interests || excluded.interests) order by 1),
               first_name = case when club_signups.first_name = '' then excluded.first_name else club_signups.first_name end`
  } catch (err) {
    console.error('club-signup failed:', err)
    return Response.json({ ok: false, error: 'unavailable' }, { status: 503 })
  }

  return Response.json({ ok: true })
}
