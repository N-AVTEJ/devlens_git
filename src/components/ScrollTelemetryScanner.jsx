'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

export default function ScrollTelemetryScanner() {
  const containerRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const laserRef = useRef(null)
  const progressNumberRef = useRef(null)
  
  const stage1Ref = useRef(null)
  const stage2Ref = useRef(null)
  const stage3Ref = useRef(null)

  const tab1BtnRef = useRef(null)
  const tab2BtnRef = useRef(null)
  const tab3BtnRef = useRef(null)

  const radarPolygonRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const container = containerRef.current
    const pinWrapper = pinWrapperRef.current
    const laser = laserRef.current

    if (!container || !pinWrapper) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      // Create master scrub timeline for the pinned sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=260%',
          pin: pinWrapper,
          scrub: 0.9,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress
            if (progressNumberRef.current) {
              progressNumberRef.current.textContent = `${Math.round(p * 100)}%`
            }

            // Update top stage tabs visually via classList to avoid React re-render churn
            const activeIdx = p < 0.33 ? 0 : p < 0.67 ? 1 : 2
            const tabs = [tab1BtnRef.current, tab2BtnRef.current, tab3BtnRef.current]
            tabs.forEach((tab, idx) => {
              if (!tab) return
              if (idx === activeIdx) {
                tab.classList.add('bg-[#ef233c]', 'text-white', 'border-[#ef233c]', 'shadow-[0_0_12px_rgba(239,35,60,0.5)]')
                tab.classList.remove('text-white/40', 'border-white/10')
              } else {
                tab.classList.remove('bg-[#ef233c]', 'text-white', 'border-[#ef233c]', 'shadow-[0_0_12px_rgba(239,35,60,0.5)]')
                tab.classList.add('text-white/40', 'border-white/10')
              }
            })
          }
        }
      })

      // 1. Physical Laser Scan down the AST code window
      if (laser) {
        tl.fromTo(laser, 
          { y: 0, opacity: 0.9 }, 
          { y: 390, ease: 'none', duration: 3.0 },
          0
        )
      }

      // 2. Syntax Token illumination tied to the laser sweep
      tl.to('.code-token-ast', { 
        backgroundColor: 'rgba(239, 35, 60, 0.22)', 
        color: '#ffffff', 
        borderColor: 'rgba(239,35,60,0.4)',
        duration: 0.4,
        ease: 'power1.out'
      }, 0.2)
      .to('.code-token-ast', { 
        backgroundColor: 'rgba(239, 35, 60, 0.08)', 
        duration: 0.5 
      }, 0.8)

      tl.to('.code-token-radar', { 
        backgroundColor: 'rgba(239, 35, 60, 0.22)', 
        color: '#ffffff', 
        borderColor: 'rgba(239,35,60,0.4)',
        duration: 0.4,
        ease: 'power1.out'
      }, 1.1)
      .to('.code-token-radar', { 
        backgroundColor: 'rgba(239, 35, 60, 0.08)', 
        duration: 0.5 
      }, 1.8)

      tl.to('.code-token-dossier', { 
        backgroundColor: 'rgba(239, 35, 60, 0.22)', 
        color: '#ffffff', 
        borderColor: 'rgba(239,35,60,0.4)',
        duration: 0.4,
        ease: 'power1.out'
      }, 2.0)

      // 3. Stage 1 -> Stage 2 Cross-fade & Spatial Morphing
      // Stage 1 is visible at start (0 - 0.9s)
      tl.to(stage1Ref.current, { 
        opacity: 0, 
        y: -24, 
        scale: 0.97,
        duration: 0.35, 
        ease: 'power2.inOut',
        pointerEvents: 'none'
      }, 0.85)

      // Stage 2 enters (0.9s - 1.9s)
      tl.fromTo(stage2Ref.current, 
        { opacity: 0, y: 24, scale: 0.97 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out', pointerEvents: 'auto' }, 
        0.95
      )

      // Animate SVG Radar polygon expansion in Stage 2
      if (radarPolygonRef.current) {
        tl.fromTo(radarPolygonRef.current,
          { attr: { points: '120,120 120,120 120,120 120,120 120,120 120,120' }, opacity: 0 },
          { attr: { points: '120,28 198,72 188,168 120,205 48,162 42,76' }, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' },
          1.1
        )
      }

      // Stage 2 exits (1.9s)
      tl.to(stage2Ref.current, { 
        opacity: 0, 
        y: -24, 
        scale: 0.97,
        duration: 0.35, 
        ease: 'power2.inOut',
        pointerEvents: 'none'
      }, 1.9)

      // Stage 3 enters (2.0s - 3.0s)
      tl.fromTo(stage3Ref.current, 
        { opacity: 0, y: 24, scale: 0.97 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out', pointerEvents: 'auto' }, 
        2.0
      )

      return () => {
        tl.kill()
      }
    })

    return () => {
      mm.revert()
    }
  }, [])

  // Smooth scroll directly to a specific scrub phase when tab button is clicked
  const handleScrollToPhase = (phaseIndex) => {
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const containerTop = window.scrollY + rect.top
    const totalDistance = window.innerHeight * 2.6
    const targetScroll = containerTop + (phaseIndex / 3) * totalDistance

    if (window.__lenis) {
      window.__lenis.scrollTo(targetScroll, { duration: 1.1 })
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' })
    }
  }

  return (
    <section 
      ref={containerRef} 
      id="telemetry-pipeline" 
      className="relative z-20 w-full border-t border-white/10 bg-[#040407]"
      aria-label="Interactive Code Telemetry Pipeline"
    >
      <div 
        ref={pinWrapperRef} 
        className="w-full min-h-screen lg:h-screen flex flex-col justify-center py-16 lg:py-0 px-6 lg:px-12 max-w-[1440px] mx-auto overflow-hidden"
      >
        
        {/* Top HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-6 h-6 border border-[#ef233c]/40 bg-[#ef233c]/10 text-[#ef233c] font-mono text-xs">
              ✦
            </span>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ef233c] block">
                [AST_OPTICAL_SCANNER]
              </span>
              <h2 className="text-xl lg:text-2xl font-bold font-manrope text-white tracking-tight">
                Live Source Code Telemetry Pipeline
              </h2>
            </div>
          </div>

          {/* Interactive Phase Markers & Live Coordinate */}
          <div className="flex items-center gap-4 font-mono text-xs">
            <div className="hidden sm:flex items-center gap-2 text-white/50 bg-black/60 px-3 py-1.5 border border-white/5">
              <span className="text-[10px] tracking-wider text-white/40">CALIBRATION:</span>
              <span ref={progressNumberRef} className="text-[#ef233c] font-bold">0%</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/80 border border-white/10 p-1">
              {[
                { label: 'AST_INGEST', num: '01' },
                { label: 'NEURAL_RADAR', num: '02' },
                { label: 'CAREER_SYNTHESIS', num: '03' }
              ].map((s, idx) => (
                <button
                  key={idx}
                  ref={idx === 0 ? tab1BtnRef : idx === 1 ? tab2BtnRef : tab3BtnRef}
                  type="button"
                  onClick={() => handleScrollToPhase(idx)}
                  className={`px-3 py-1 text-[11px] font-mono tracking-wider transition-colors duration-200 border ${
                    idx === 0 
                      ? 'bg-[#ef233c] text-white border-[#ef233c] shadow-[0_0_12px_rgba(239,35,60,0.5)]' 
                      : 'text-white/40 border-white/10 hover:text-white/80'
                  }`}
                >
                  <span className="opacity-50 mr-1.5">{s.num}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Scanner Stage: Grid of Code Inspector + Telemetry Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Code AST Terminal with Laser Sweep (Col-span 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 bg-black border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)]">
              
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#0a0a0f] border-b border-white/10 font-mono text-xs select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef233c]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff9f1c]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-white/50 text-[11px]">devlens://ast-stream/inspection.ts</span>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-[10px]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ef233c] animate-ping" />
                  <span className="tracking-wider">PARSER ACTIVE</span>
                </div>
              </div>

              {/* Code Area with Scanning Reticle */}
              <div className="relative p-6 font-mono text-xs leading-relaxed overflow-hidden bg-black/95 min-h-[380px]">
                
                {/* Horizontal Laser Line with optical crimson glow */}
                <div
                  ref={laserRef}
                  className="hidden lg:block absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ef233c] to-transparent shadow-[0_0_16px_#ef233c,0_0_30px_rgba(239,35,60,0.6)] pointer-events-none z-30"
                  style={{ top: '24px' }}
                >
                  <div className="absolute left-4 -top-2.5 text-[8px] font-mono text-[#ef233c] uppercase tracking-widest bg-black/90 px-1.5 py-0.5 border border-[#ef233c]/40 shadow-[0_0_8px_#ef233c]">
                    OPTIC_SWEEP // 60Hz
                  </div>
                  <div className="absolute right-4 -top-1 w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
                </div>

                {/* Real TypeScript Scanner Source Snippet */}
                <div className="space-y-1.5 text-white/70 select-none text-[11px]">
                  <div className="text-white/35">// DevLens AST Topology & Skill Vector Extraction Pipeline</div>
                  <div>
                    <span className="text-purple-400">import</span> {'{ parseCommitTree, computeSkillVectors }'}{' '}
                    <span className="text-purple-400">from</span> <span className="text-emerald-400">"@devlens/engine"</span>;
                  </div>
                  <div className="h-1.5" />

                  <div>
                    <span className="text-blue-400">export async function</span>{' '}
                    <span className="text-yellow-400 font-bold">scanRepositoryTopology</span>(username:{' '}
                    <span className="text-blue-300">string</span>) {'{'}
                  </div>

                  <div className="pl-4 text-white/35">
                    // Phase 1: AST Ingestion & Language Byte Weighting
                  </div>
                  <div className="pl-4 code-token-ast p-1 -mx-1 rounded border border-transparent transition-colors duration-150">
                    <span className="text-blue-400">const</span> rawAST ={' '}
                    <span className="text-purple-400">await</span> parseCommitTree(username, {'{'}
                  </div>
                  <div className="pl-8 text-white/60">
                    targetBranches: <span className="text-emerald-300">"all"</span>,
                  </div>
                  <div className="pl-8 text-white/60">
                    byteWeightThreshold: <span className="text-orange-400">10000</span>,
                  </div>
                  <div className="pl-8 text-white/60">
                    deepASTDetection: <span className="text-orange-400">true</span>
                  </div>
                  <div className="pl-4">{'}'});</div>

                  <div className="h-1.5" />
                  <div className="pl-4 text-white/35">
                    // Phase 2: 6-Dimensional Skill Vector Extraction
                  </div>
                  <div className="pl-4 code-token-radar p-1 -mx-1 rounded border border-transparent transition-colors duration-150">
                    <span className="text-blue-400">const</span> vectors = computeSkillVectors(rawAST.distributions);
                  </div>
                  <div className="pl-4 text-white/60">
                    <span className="text-purple-400">const</span> readinessIndex = calculateReadiness(vectors);
                  </div>

                  <div className="h-1.5" />
                  <div className="pl-4 text-white/35">
                    // Phase 3: Career Match & Whitelisted Roadmap Dossier
                  </div>
                  <div className="pl-4 code-token-dossier p-1 -mx-1 rounded border border-transparent transition-colors duration-150">
                    <span className="text-blue-400">return</span> synthesizeDossier(vectors, {'{'}
                  </div>
                  <div className="pl-8 text-white/60">
                    benchmark: <span className="text-emerald-300">"Staff / Senior Engineer"</span>,
                  </div>
                  <div className="pl-8 text-white/60">
                    roadmapValidation: <span className="text-orange-400">true</span>
                  </div>
                  <div className="pl-4">{'}'});</div>
                  <div>{'}'}</div>
                </div>

                {/* Live AST Annotation Badges Overlay */}
                <div className="mt-5 pt-3 border-t border-white/5 flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
                    TS_BYTES: <strong className="text-white">591,694</strong>
                  </span>
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
                    PARSED_REPOS: <strong className="text-[#ef233c]">14</strong>
                  </span>
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-emerald-400">
                    PARSER STATUS: OK
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* RIGHT: Dynamic Telemetry Stages (Col-span 5) */}
          <div className="lg:col-span-5 relative min-h-[460px] flex flex-col justify-center">
            
            {/* STAGE 1: Deterministic Byte Analysis */}
            <div 
              ref={stage1Ref}
              className="w-full bg-[#08080d] border border-white/10 p-7 shadow-2xl lg:absolute lg:inset-0 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#ef233c] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#ef233c] rounded-full" />
                    PHASE 01 // RAW INGESTION
                  </span>
                  <span className="text-[11px] font-mono text-white/40">14 REPOSITORIES</span>
                </div>

                <h3 className="text-2xl font-bold font-manrope text-white mb-2">
                  Deterministic Byte Analysis
                </h3>
                <p className="text-white/70 text-xs font-light mb-6 leading-relaxed">
                  Instead of speculative resume keywords, DevLens parses every byte of source syntax, module hierarchies, and commit velocity.
                </p>

                {/* Language Weight Distribution Bars */}
                <div className="space-y-4">
                  {[
                    { lang: 'TypeScript', bytes: '591,694 B', pct: 64, color: 'bg-[#ef233c]' },
                    { lang: 'JavaScript', bytes: '349,578 B', pct: 24, color: 'bg-[#ff9f1c]' },
                    { lang: 'HTML / CSS / GLSL', bytes: '128,400 B', pct: 12, color: 'bg-emerald-500' }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between text-white/80 text-[11px]">
                        <span>{item.lang}</span>
                        <span className="text-white/50">{item.bytes} ({item.pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 overflow-hidden">
                        <div 
                          className={`h-full ${item.color}`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-white/50">
                <span>AST DEPTH: FULL RECURSION</span>
                <span className="text-[#ef233c] flex items-center gap-1">
                  <span className="w-1 h-1 bg-[#ef233c] rounded-full animate-ping" />
                  STREAMING AST
                </span>
              </div>
            </div>

            {/* STAGE 2: Neural Capability Radar with SVG polygon */}
            <div 
              ref={stage2Ref}
              className="w-full bg-[#08080d] border border-white/10 p-7 shadow-2xl lg:absolute lg:inset-0 flex flex-col justify-between opacity-0 pointer-events-none"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#ef233c] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#ef233c] rounded-full" />
                    PHASE 02 // MULTI-VECTOR RADAR
                  </span>
                  <span className="text-[11px] font-mono text-white/40">6 AXES</span>
                </div>

                <h3 className="text-2xl font-bold font-manrope text-white mb-1">
                  6-Axis Capability Radar
                </h3>
                <p className="text-white/70 text-xs font-light mb-4 leading-relaxed">
                  AST topology converts into 6 orthogonal engineering vectors to measure architectural discipline and scale readiness.
                </p>

                {/* SVG Radar Graphic + Axis Metrics */}
                <div className="grid grid-cols-12 gap-3 items-center">
                  {/* SVG Web */}
                  <div className="col-span-5 flex justify-center">
                    <svg viewBox="0 0 240 240" className="w-36 h-36">
                      {/* Grid concentric rings */}
                      <circle cx="120" cy="120" r="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 2" />
                      <circle cx="120" cy="120" r="60" fill="none" stroke="rgba(255,255,255,0.08)" />
                      <circle cx="120" cy="120" r="30" fill="none" stroke="rgba(255,255,255,0.08)" />
                      {/* Axis lines */}
                      <line x1="120" y1="30" x2="120" y2="210" stroke="rgba(255,255,255,0.1)" />
                      <line x1="42" y1="75" x2="198" y2="165" stroke="rgba(255,255,255,0.1)" />
                      <line x1="42" y1="165" x2="198" y2="75" stroke="rgba(255,255,255,0.1)" />
                      {/* Dynamic Radar Polygon */}
                      <polygon 
                        ref={radarPolygonRef}
                        points="120,28 198,72 188,168 120,205 48,162 42,76"
                        fill="rgba(239, 35, 60, 0.25)"
                        stroke="#ef233c"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>

                  {/* Metric Readouts */}
                  <div className="col-span-7 space-y-2 font-mono text-[11px]">
                    {[
                      { domain: 'System Arch', score: 92 },
                      { domain: 'Frontend Craft', score: 88 },
                      { domain: 'Algorithmic Rigor', score: 74 },
                      { domain: 'State Orchestration', score: 90 },
                    ].map((item, idx) => (
                      <div key={idx} className="p-1.5 bg-white/[0.02] border border-white/5 flex items-center justify-between">
                        <span className="text-white/80">{item.domain}</span>
                        <span className="text-[#ef233c] font-bold">{item.score}<span className="text-white/30 text-[9px]">/100</span></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-white/50">
                <span>VECTOR SYNTHESIS: COMPLETE</span>
                <span className="text-emerald-400">COEFFICIENT: 0.94</span>
              </div>
            </div>

            {/* STAGE 3: Verified Career Intelligence Dossier */}
            <div 
              ref={stage3Ref}
              className="w-full bg-[#08080d] border border-[#ef233c]/40 p-7 shadow-[0_0_40px_rgba(239,35,60,0.15)] lg:absolute lg:inset-0 flex flex-col justify-between opacity-0 pointer-events-none"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#ef233c] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#ef233c] rounded-full" />
                    PHASE 03 // CAREER DOSSIER
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    MATCH CONFIRMED
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider block">Recommended Trajectory</span>
                  <h3 className="text-2xl font-black font-manrope text-white tracking-tight">
                    Full-Stack Systems Engineer
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-white/[0.02] border border-white/10">
                    <div className="text-[9px] font-mono text-white/50 uppercase">Match Coefficient</div>
                    <div className="text-2xl font-bold font-mono text-[#ef233c]">94%</div>
                  </div>
                  <div className="p-3 bg-white/[0.02] border border-white/10">
                    <div className="text-[9px] font-mono text-white/50 uppercase">Readiness Score</div>
                    <div className="text-2xl font-bold font-mono text-white">86<span className="text-xs text-white/40 font-normal">/100</span></div>
                  </div>
                </div>

                <p className="text-white/70 text-xs font-light leading-relaxed mb-4 border-l-2 border-[#ef233c]/50 pl-3">
                  Recruiter Verdict: "Exceptional architecture discipline and state orchestration. Clear readiness for high-scale product engineering."
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link href="/analyze?path=github" className="flex-1">
                  <button 
                    type="button" 
                    className="w-full py-2.5 px-4 bg-[#ef233c] hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Scan Your GitHub
                  </button>
                </Link>
                <Link href="/analyze?path=quiz" className="flex-1 sm:flex-none">
                  <button 
                    type="button" 
                    className="w-full sm:w-auto py-2.5 px-4 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                  >
                    Take Quiz
                  </button>
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
