// Uploads the Family Almanac PDF to the private Neon "assets" bucket at build time.
// Skips the upload when the stored copy already matches (by SHA-256).
// In a Netlify production build a failure stops the deploy, so the gated download is never
// left without its file; elsewhere (previews, local builds) it warns and moves on.
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { ALMANAC, missingStorageEnv, storageClient } from '../netlify/lib/storage.mjs'

const strict = process.env.NETLIFY === 'true' && process.env.CONTEXT === 'production'

function stop(message) {
  if (strict) {
    console.error(`upload-almanac: ${message}`)
    process.exit(1)
  }
  console.warn(`upload-almanac: ${message} (skipped outside a production build)`)
  process.exit(0)
}

const missing = missingStorageEnv('NEON_S3_UPLOAD')
if (missing.length) stop(`missing ${missing.join(', ')}`)

const body = await readFile(new URL('../assets/almanac/The-Family-Almanac.pdf', import.meta.url))
const sha256 = createHash('sha256').update(body).digest('hex')
const s3 = storageClient('NEON_S3_UPLOAD')
const target = { Bucket: ALMANAC.bucket, Key: ALMANAC.key }

try {
  const head = await s3.send(new HeadObjectCommand(target)).catch((err) => {
    if (err?.$metadata?.httpStatusCode === 404) return null
    throw err
  })
  if (head?.Metadata?.sha256 === sha256) {
    console.log(`upload-almanac: ${ALMANAC.key} is up to date`)
  } else {
    await s3.send(new PutObjectCommand({ ...target, Body: body, ContentType: 'application/pdf', Metadata: { sha256 } }))
    console.log(`upload-almanac: uploaded ${ALMANAC.key} (${body.length} bytes)`)
  }
} catch (err) {
  stop(err instanceof Error ? err.message : String(err))
}
