'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ScrollProgressBar() {
  const barRef = useRef(null)
  const counterRef = useRef(null)
  const badgeRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const bar = barRef.current
    const counter = counterRef.current
    const badge = badgeRef.current

    if (!bar) return

    // ScrollTrigger instance for zero-re-render progress updates
    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        // Hardware accelerated scaleX
        bar.style.transform = `scaleX(${p})`
        
        if (counter) {
          const pct = Math.round(p * 100)
          counter.textContent = `${pct.toString().padStart(2, '0')}%`
        }

        if (badge) {
          // Dynamic section indicator based on scroll depth
          if (p < 0.2) {
            badge.textContent = 'HERO_VIEWPORT'
          } else if (p < 0.42) {
            badge.textContent = 'DIAGNOSTIC_ANALYSIS'
          } else if (p < 0.72) {
            badge.textContent = 'OPTICAL_AST_SCAN'
          } else if (p < 0.88) {
            badge.textContent = 'RADAR_CAPABILITIES'
          } else {
            badge.textContent = 'ENTRY_TERMINAL'
          }
        }
      }
    })

    return () => {
      st.kill()
    }
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[60] pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Precision Track Background */}
      <div className="w-full h-[2px] bg-white/[0.04]">
        {/* Progress Fill with Glow */}
        <div 
          ref={barRef}
          className="h-full w-full bg-gradient-to-r from-[#ef233c] via-[#ff3366] to-[#ef233c] shadow-[0_0_12px_#ef233c] will-change-transform origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Subtle Floating Right Coordinate Tag (Desktop only) */}
      <div className="hidden xl:flex fixed top-2.5 right-6 items-center gap-2 font-mono text-[9px] tracking-widest text-white/40 uppercase bg-black/60 border border-white/5 px-2.5 py-1 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ef233c] animate-pulse" />
        <span ref={badgeRef} className="text-white/60">HERO_VIEWPORT</span>
        <span className="text-white/20">|</span>
        <span ref={counterRef} className="text-[#ef233c] font-bold">00%</span>
      </div>
    </div>
  )
}
