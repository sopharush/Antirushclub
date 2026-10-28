import { S3Client } from '@aws-sdk/client-s3'

// Neon Object Storage speaks the S3 API. Credentials use their own variable names
// because AWS Lambda, which runs Netlify Functions, reserves the standard AWS_* ones.
// NEON_S3_*        read-only credential, used by functions to sign download links
// NEON_S3_UPLOAD_* read-write credential, used at build time to upload files

export const ALMANAC = {
  bucket: 'assets',
  key: 'almanac/The-Family-Almanac.pdf',
  filename: 'The-Family-Almanac.pdf',
}

const names = (prefix) => [`${prefix}_ACCESS_KEY_ID`, `${prefix}_SECRET_ACCESS_KEY`, 'NEON_S3_ENDPOINT', 'NEON_S3_REGION']

/** @param {'NEON_S3' | 'NEON_S3_UPLOAD'} prefix */
export function missingStorageEnv(prefix = 'NEON_S3') {
  return names(prefix).filter((n) => !process.env[n])
}

/** @param {'NEON_S3' | 'NEON_S3_UPLOAD'} prefix */
export function storageClient(prefix = 'NEON_S3') {
  const missing = missingStorageEnv(prefix)
  if (missing.length) throw new Error(`Missing storage env: ${missing.join(', ')}`)
  return new S3Client({
    endpoint: process.env.NEON_S3_ENDPOINT,
    region: process.env.NEON_S3_REGION,
    credentials: {
      accessKeyId: /** @type {string} */ (process.env[`${prefix}_ACCESS_KEY_ID`]),
      secretAccessKey: /** @type {string} */ (process.env[`${prefix}_SECRET_ACCESS_KEY`]),
    },
    forcePathStyle: true, // required: Neon uses path-style addressing
  })
}
