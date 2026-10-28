import { useEffect } from 'react'
import type Lenis from 'lenis'
import { initLenis, destroyLenis, ScrollTrigger } from './lib/motion'
import { useReady } from './lib/ReadyContext'
import { useReveal } from './hooks/useReveal'

import Grain from './components/Grain'
import Nav from './components/Nav'
import Preloader from './components/Preloader'
import MailClubModal from './components/MailClubModal'
import HeroCutout from './components/HeroCutout'
import Footer from './components/Footer'

import Why from './sections/Why'
import SeriesScroll from './sections/SeriesScroll'
import Pause from './sections/Pause'
import Values from './sections/Values'
import Experience from './sections/Experience'
import Invitation from './sections/Invitation'

export default function App() {
  const { ready } = useReady()
  useReveal(ready)

  useEffect(() => {
    let lenis: Lenis | null = null
    if (ready) lenis = initLenis()
    return () => destroyLenis(lenis)
  }, [ready])

  // Recalculate triggers once webfonts have settled (metrics shift layout).
  useEffect(() => {
    if (!('fonts' in document)) return
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <>
      <Grain />
      <div className="vignette" aria-hidden="true" />
      <Preloader />
      <Nav />
      <main>
        <HeroCutout />
        <Why />
        <SeriesScroll />
        <Values />
        <Pause />
        <Experience />
        <Invitation />
      </main>
      <Footer />
      <MailClubModal />
    </>
  )
}
