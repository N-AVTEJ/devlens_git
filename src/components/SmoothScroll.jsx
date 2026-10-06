'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function SmoothScroll() {
  useEffect(() => {
    // Respect user's accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return
    }

    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger)
    }

    // Initialize high-performance Lenis smooth inertia scroll
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration for authentic momentum
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
      infinite: false,
    })

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    // Drive Lenis tick through GSAP's optimized ticker for unified 60/120fps sync
    const updateTicker = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    // Expose lenis instance globally for smooth anchor navigation
    window.__lenis = lenis

    // Intercept in-page hash anchor links so they smoothly glide with Lenis
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]')
      if (!target) return
      const hash = target.getAttribute('href')
      if (hash && hash !== '#') {
        const element = document.querySelector(hash)
        if (element) {
          e.preventDefault()
          lenis.scrollTo(element, {
            offset: -40,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      gsap.ticker.remove(updateTicker)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])

  return null
}
