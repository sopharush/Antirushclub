import { prefersReducedMotion } from '../lib/motion'

export default function Grain() {
  if (prefersReducedMotion()) return null
  return <div className="grain" aria-hidden="true" />
}
