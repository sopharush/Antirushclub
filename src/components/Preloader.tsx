import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { useReady } from '../lib/ReadyContext'

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const { setReady } = useReady()

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReady(true)
      if (root.current) root.current.style.display = 'none'
      return
    }
    const tl = gsap.timeline({ onComplete: () => setReady(true) })
    tl.to(bar.current, { scaleX: 1, duration: 1.0, ease: 'power2.inOut' }, 0.15)
      .to(root.current, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, '+=0.15')
      .set(root.current, { display: 'none' })
    return () => { tl.kill() }
  }, [setReady])

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-paper"
    >
      <div className="serif text-choc text-2xl md:text-3xl tracking-[0.04em]">Anti-Rush Club</div>
      <div className="mt-6 h-px w-40 overflow-hidden bg-choc/15">
        <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-choc" />
      </div>
      <div className="kicker mt-5 text-choc2/70">Slow down</div>
    </div>
  )
}
