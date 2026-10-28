import { neon, type NeonQueryFunction } from '@neondatabase/serverless'
import { parseEnv } from '@neon/env'
import config from '../../neon'

// Neon's HTTP driver suits Netlify Functions: one-shot queries, no pool to keep alive.
// DATABASE_URL is the pooled connection string.
let client: NeonQueryFunction<false, false> | undefined

export function db() {
  client ??= neon(parseEnv(config, ['DATABASE_URL']).postgres.databaseUrl)
  return client
}
