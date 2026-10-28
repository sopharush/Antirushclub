import { GetObjectCommand, type S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { db } from '../lib/db.mts'
import { ALMANAC, storageClient } from '../lib/storage.mjs'

// Records an Almanac signup in Postgres and returns a short-lived link to the PDF,
// which lives in the private "assets" bucket. Served at /.netlify/functions/almanac-download.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LINK_TTL_SECONDS = 600
const NO_STORE = { 'cache-control': 'no-store' }

let s3: S3Client | undefined

export default async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  let fields: Record<string, string>
  try {
    fields = Object.fromEntries(new URLSearchParams(await req.text()))
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400, headers: NO_STORE })
  }

  // Honeypot: real people never fill this.
  if ((fields['bot-field'] ?? '').trim()) {
    return Response.json({ ok: false, error: 'rejected' }, { status: 400, headers: NO_STORE })
  }

  const email = (fields.email ?? '').trim().toLowerCase()
  if (email.length > 254 || !EMAIL.test(email)) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400, headers: NO_STORE })
  }

  await db()`insert into almanac_signups (email) values (${email})
             on conflict (email) do update set last_requested_at = now()`

  s3 ??= storageClient()
  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: ALMANAC.bucket,
      Key: ALMANAC.key,
      ResponseContentType: 'application/pdf',
      ResponseContentDisposition: `attachment; filename="${ALMANAC.filename}"`,
    }),
    { expiresIn: LINK_TTL_SECONDS },
  )

  return Response.json({ ok: true, url }, { headers: NO_STORE })
}
