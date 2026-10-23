import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

/** `?motion=off` or `?noanim=1` forces the fully static, all-visible state.
 *  Used for review + screenshots. */
export function forceStatic(): boolean {
  if (typeof window === 'undefined') return false
  const q = new URLSearchParams(window.location.search)
  return q.get('motion') === 'off' || q.get('noanim') === '1'
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  if (forceStatic()) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Smooth scroll, synced to GSAP's ticker. Null when motion is reduced. */
export function initLenis(): Lenis | null {
  if (prefersReducedMotion()) return null

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  lenis.on('scroll', ScrollTrigger.update)
  const raf = (time: number) => lenis.raf(time * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)

  ;(lenis as unknown as { _rafCb?: (t: number) => void })._rafCb = raf
  return lenis
}

export function destroyLenis(lenis: Lenis | null): void {
  if (!lenis) return
  const raf = (lenis as unknown as { _rafCb?: (t: number) => void })._rafCb
  if (raf) gsap.ticker.remove(raf)
  lenis.destroy()
}
