'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function ScrollTelemetryScanner() {
  const containerRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const laserRef = useRef(null)
  const progressTextRef = useRef(null)
  
  const stage1Ref = useRef(null)
  const stage2Ref = useRef(null)
  const stage3Ref = useRef(null)

  const [activeStage, setActiveStage] = useState(0) // 0, 1, 2
  const [scrollProgress, setScrollProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReducedMotion)

    if (prefersReducedMotion) {
      return
    }

    const container = containerRef.current
    const pinWrapper = pinWrapperRef.current
    const laser = laserRef.current

    if (!container || !pinWrapper) return

    // Desktop Pinned ScrollTrigger
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=200%',
          pin: pinWrapper,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress
            setScrollProgress(Math.round(p * 100))
            if (p < 0.33) {
              setActiveStage(0)
            } else if (p < 0.68) {
              setActiveStage(1)
            } else {
              setActiveStage(2)
            }
          }
        }
      })

      // Laser moves down code window
      if (laser) {
        tl.fromTo(laser, 
          { y: 0, opacity: 1 }, 
          { y: 380, ease: 'none', duration: 1 },
          0
        )
      }

      // Stage Transitions: Morphing between Stage 1, Stage 2, Stage 3 in right telemetry column
      // Stage 1 -> Stage 2
      tl.to(stage1Ref.current, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.inOut' }, 0.28)
      tl.fromTo(stage2Ref.current, 
        { opacity: 0, y: 30, scale: 0.96 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }, 
        0.33
      )

      // Stage 2 -> Stage 3
      tl.to(stage2Ref.current, { opacity: 0, y: -20, duration: 0.35, ease: 'power2.inOut' }, 0.64)
      tl.fromTo(stage3Ref.current, 
        { opacity: 0, y: 30, scale: 0.96 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }, 
        0.69
      )

      // Highlighting tokens in code window on scroll
      tl.to('.code-token-1', { color: '#ffffff', backgroundColor: 'rgba(239,35,60,0.18)', duration: 0.2 }, 0.08)
      tl.to('.code-token-2', { color: '#ffffff', backgroundColor: 'rgba(239,35,60,0.18)', duration: 0.2 }, 0.38)
      tl.to('.code-token-3', { color: '#ffffff', backgroundColor: 'rgba(239,35,60,0.18)', duration: 0.2 }, 0.72)

      return () => {
        tl.kill()
      }
    })

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <section 
      ref={containerRef} 
      id="telemetry-pipeline" 
      className="relative z-20 w-full border-t border-white/10 bg-[#040406]"
      aria-label="Interactive Code Telemetry Pipeline"
    >
      <div ref={pinWrapperRef} className="w-full min-h-screen lg:h-screen flex flex-col justify-center py-16 lg:py-0 px-6 lg:px-12 max-w-[1440px] mx-auto">
        
        {/* Top HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-6 h-6 border border-[#ef233c]/40 bg-[#ef233c]/10 text-[#ef233c] font-mono text-xs">
              ✦
            </span>
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#ef233c]">
                PIPELINE // 002
              </span>
              <h2 className="text-xl lg:text-2xl font-bold font-manrope text-white tracking-tight">
                The DevLens Optical Scanner
              </h2>
            </div>
          </div>

          {/* Precision Coordinates & Stage Indicators */}
          <div className="flex items-center gap-6 font-mono text-xs">
            <div className="hidden sm:flex items-center gap-2 text-white/50">
              <span>SCAN_DEPTH:</span>
              <span className="text-[#ef233c] font-bold score-display">{scrollProgress}%</span>
            </div>

            <div className="flex items-center gap-1.5 border border-white/10 bg-black/60 px-3 py-1.5">
              {[
                { label: 'AST_INGEST', num: '01' },
                { label: 'NEURAL_RADAR', num: '02' },
                { label: 'CAREER_SYNTHESIS', num: '03' }
              ].map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStage(idx)}
                  className={`px-2 py-0.5 text-[11px] transition-all ${
                    activeStage === idx 
                      ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.5)]' 
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  <span className="opacity-60 mr-1">{s.num}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Scanner Stage: Grid of Code Inspector + Telemetry Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Code AST Terminal with Laser Sweep (Col-span 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative flex-1 bg-black border border-white/10 rounded-sm overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.8)]">
              
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0f] border-b border-white/10 font-mono text-xs select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef233c]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff9f1c]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-white/50">devlens://ast-stream/inspection.ts</span>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-[10px]">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ef233c] animate-ping" />
                  <span>PARSER LIVE</span>
                </div>
              </div>

              {/* Code Area with Scanning Reticle */}
              <div className="relative p-6 font-mono text-xs leading-relaxed overflow-hidden bg-black/90">
                
                {/* Horizontal Laser Line with subtle red bloom */}
                {!reducedMotion && (
                  <div
                    ref={laserRef}
                    className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#ef233c] to-transparent shadow-[0_0_15px_#ef233c] pointer-events-none z-30"
                    style={{ top: '24px' }}
                  >
                    <div className="absolute left-4 -top-2 text-[9px] font-mono text-[#ef233c] uppercase tracking-widest bg-black/80 px-1 border border-[#ef233c]/40">
                      SCAN_BEAM // 60Hz
                    </div>
                    <div className="absolute right-4 -top-1 w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
                  </div>
                )}

                {/* Real TypeScript Scanner Source Snippet */}
                <div className="space-y-2 text-white/70 select-none">
                  <div className="text-white/40">// DevLens AST & Telemetry Pipeline</div>
                  <div>
                    <span className="text-purple-400">import</span> {'{ parseCommitTree, computeSkillVectors }'}{' '}
                    <span className="text-purple-400">from</span> <span className="text-emerald-400">"@devlens/engine"</span>;
                  </div>
                  <div className="h-2" />

                  <div className="code-token-1 p-1 -mx-1 rounded transition-colors duration-200">
                    <span className="text-blue-400">export async function</span>{' '}
                    <span className="text-yellow-400 font-bold">scanRepositoryTopology</span>(username:{' '}
                    <span className="text-blue-300">string</span>) {'{'}
                  </div>

                  <div className="pl-4">
                    <span className="text-white/40">// Step 1: Deep repository inspection</span>
                  </div>
                  <div className="pl-4 code-token-1 p-1 -mx-1 rounded transition-colors duration-200">
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

                  <div className="h-2" />
                  <div className="pl-4">
                    <span className="text-white/40">// Step 2: 6-Dimensional Skill Vector Extraction</span>
                  </div>
                  <div className="pl-4 code-token-2 p-1 -mx-1 rounded transition-colors duration-200">
                    <span className="text-blue-400">const</span> vectors = computeSkillVectors(rawAST.distributions);
                  </div>
                  <div className="pl-4 text-white/60">
                    <span className="text-purple-400">const</span> readinessIndex = calculateReadiness(vectors);
                  </div>

                  <div className="h-2" />
                  <div className="pl-4">
                    <span className="text-white/40">// Step 3: Verified Career Matching & Whitelist Roadmap</span>
                  </div>
                  <div className="pl-4 code-token-3 p-1 -mx-1 rounded transition-colors duration-200">
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
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
                    TS_BYTES: <strong className="text-white">591,694</strong>
                  </span>
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
                    PARSED_REPOS: <strong className="text-[#ef233c]">14</strong>
                  </span>
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
                    FRAMEWORKS: <strong className="text-white">Next.js 15, React 19, Three.js</strong>
                  </span>
                  <span className="border border-white/10 bg-white/5 px-2.5 py-1 text-emerald-400">
                    AST_VERIFIED: 100%
                  </span>
                </div>

              </div>

            </div>
          </div>

          {/* RIGHT: Dynamic Telemetry Stages (Col-span 5) */}
          <div className="lg:col-span-5 relative min-h-[460px] flex flex-col justify-center">
            
            {/* STAGE 1: AST Ingestion Metrics */}
            <div 
              ref={stage1Ref}
              className={`w-full bg-black/80 border border-white/10 p-8 shadow-2xl transition-all duration-300 ${
                reducedMotion || activeStage === 0 ? 'block' : 'hidden lg:block lg:absolute lg:inset-0'
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ef233c]">
                  PHASE 01 // RAW INGESTION
                </span>
                <span className="text-xs font-mono text-white/40">14 REPOSITORIES</span>
              </div>

              <h3 className="text-2xl font-bold font-manrope text-white mb-2">
                Deterministic Byte Analysis
              </h3>
              <p className="text-white/70 text-sm font-light mb-6 leading-relaxed">
                Rather than relying on resume keywords, DevLens parses every byte of source code, commit cadence, and architectural patterns.
              </p>

              {/* Language Weight Distribution Bars */}
              <div className="space-y-4">
                {[
                  { lang: 'TypeScript', bytes: '591,694 B', pct: 64, color: 'bg-[#ef233c]' },
                  { lang: 'JavaScript', bytes: '349,578 B', pct: 24, color: 'bg-[#ff9f1c]' },
                  { lang: 'HTML / CSS / GLSL', bytes: '128,400 B', pct: 12, color: 'bg-emerald-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-white/80">
                      <span>{item.lang}</span>
                      <span className="text-white/50">{item.bytes} ({item.pct}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-none overflow-hidden">
                      <div 
                        className={`h-full ${item.color}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[11px] text-white/50">
                <span>AST DEPTH: FULL RECURSION</span>
                <span className="text-[#ef233c]">ACTIVE SCAN</span>
              </div>
            </div>

            {/* STAGE 2: Neural Capability Radar */}
            <div 
              ref={stage2Ref}
              className={`w-full bg-black/80 border border-white/10 p-8 shadow-2xl transition-all duration-300 ${
                reducedMotion ? 'block mt-6' : activeStage === 1 ? 'block' : 'hidden lg:block lg:absolute lg:inset-0 lg:pointer-events-none'
              }`}
              style={{ opacity: reducedMotion ? 1 : activeStage === 1 ? 1 : 0 }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ef233c]">
                  PHASE 02 // MULTI-VECTOR RADAR
                </span>
                <span className="text-xs font-mono text-white/40">6 AXES</span>
              </div>

              <h3 className="text-2xl font-bold font-manrope text-white mb-2">
                Multi-Vector Skill Deconstruction
              </h3>
              <p className="text-white/70 text-sm font-light mb-6 leading-relaxed">
                Code topology converts into 6 orthogonal engineering vectors to measure architectural maturity and production readiness.
              </p>

              {/* Radar Metric Bars */}
              <div className="space-y-3 font-mono text-xs">
                {[
                  { domain: 'System Architecture', score: 92, tag: 'HIGH DISCIPLINE' },
                  { domain: 'Frontend Engineering', score: 88, tag: '60FPS DOM READY' },
                  { domain: 'Algorithmic Rigor', score: 74, tag: 'CACHE & GRAPHS' },
                  { domain: 'State Orchestration', score: 90, tag: 'ZERO RE-RENDER' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white/[0.02] border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{item.domain}</div>
                      <div className="text-[10px] text-white/40">{item.tag}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[#ef233c] font-bold text-sm score-display">{item.score}</span>
                      <span className="text-white/40 text-[10px]">/100</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[11px] text-white/50">
                <span>VECTOR SYNTHESIS: COMPLETE</span>
                <span className="text-emerald-400">COEFFICIENT: 0.94</span>
              </div>
            </div>

            {/* STAGE 3: Verified Career Intelligence Dossier */}
            <div 
              ref={stage3Ref}
              className={`w-full bg-black/80 border border-[#ef233c]/30 p-8 shadow-[0_0_40px_rgba(239,35,60,0.1)] transition-all duration-300 ${
                reducedMotion ? 'block mt-6' : activeStage === 2 ? 'block' : 'hidden lg:block lg:absolute lg:inset-0 lg:pointer-events-none'
              }`}
              style={{ opacity: reducedMotion ? 1 : activeStage === 2 ? 1 : 0 }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[#ef233c]">
                  PHASE 03 // CAREER DOSSIER
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  MATCH LOCKED
                </span>
              </div>

              <div className="mb-4">
                <span className="text-xs font-mono text-white/50 uppercase tracking-wider block">Recommended Trajectory</span>
                <h3 className="text-3xl font-black font-manrope text-white tracking-tight">
                  Full-Stack Systems Engineer
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-white/[0.02] border border-white/10">
                  <div className="text-[10px] font-mono text-white/50 uppercase">Match Coefficient</div>
                  <div className="text-2xl font-bold font-mono text-[#ef233c]">94%</div>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/10">
                  <div className="text-[10px] font-mono text-white/50 uppercase">Readiness Score</div>
                  <div className="text-2xl font-bold font-mono text-white">86<span className="text-xs text-white/40 font-normal">/100</span></div>
                </div>
              </div>

              <p className="text-white/70 text-xs font-light leading-relaxed mb-6">
                Recruiter Verdict: "Exceptional architecture discipline and state orchestration. Clear readiness for high-scale product engineering."
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/analyze?path=github" className="flex-1">
                  <button 
                    type="button" 
                    className="w-full py-3 px-4 bg-[#ef233c] hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Scan Your GitHub Now →
                  </button>
                </Link>
                <Link href="/analyze?path=quiz" className="flex-1 sm:flex-none">
                  <button 
                    type="button" 
                    className="w-full sm:w-auto py-3 px-4 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors"
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
