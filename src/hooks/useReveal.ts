import { useEffect, useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'

/**
 * Global scroll-reveal system. Activated once the preloader is done (`active`).
 *   data-reveal            — fade + rise as it scrolls in
 *   data-reveal-group      — stagger its direct children
 *   .mask-line > .mask-inner — kinetic masked line that rises into view
 *   data-parallax="<n>"    — gentle vertical parallax (px of drift)
 * Under reduced motion everything is simply shown.
 */
export function useReveal(active: boolean) {
  // Hide masked lines before paint (GSAP owns the transform baseline).
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.set('.mask-line .mask-inner', { yPercent: 118 })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!active) return
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      const groups = gsap.utils.toArray<HTMLElement>('[data-reveal-group]')
      const lines = gsap.utils.toArray<HTMLElement>('.mask-line .mask-inner')
      const parallax = gsap.utils.toArray<HTMLElement>('[data-parallax]')

      if (reduced) {
        gsap.set(items, { autoAlpha: 1, y: 0 })
        groups.forEach((g) => gsap.set(g.children, { autoAlpha: 1, y: 0 }))
        gsap.set(lines, { yPercent: 0 })
        ScrollTrigger.refresh()
        return
      }

      items.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay || '0')
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1, y: 0, duration: 1.1, ease: 'power3.out', delay,
            scrollTrigger: { trigger: el, start: 'top 86%' },
          },
        )
      })

      groups.forEach((group) => {
        gsap.fromTo(
          group.children,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1, y: 0, duration: 0.95, ease: 'power3.out', stagger: 0.12,
            scrollTrigger: { trigger: group, start: 'top 84%' },
          },
        )
      })

      lines.forEach((inner) => {
        gsap.fromTo(
          inner,
          { yPercent: 118 },
          {
            yPercent: 0, duration: 1.15, ease: 'power4.out',
            scrollTrigger: { trigger: inner.closest('.mask-line') as Element, start: 'top 90%' },
          },
        )
      })

      parallax.forEach((el) => {
        const drift = parseFloat(el.dataset.parallax || '60')
        gsap.fromTo(
          el,
          { yPercent: -drift / 10 },
          {
            yPercent: drift / 10, ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      ScrollTrigger.refresh()
    })

    return () => ctx.revert()
  }, [active])
}
