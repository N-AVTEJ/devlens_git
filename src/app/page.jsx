'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import Link from 'next/link'
import useMagneticHover from '../hooks/useMagneticHover'
import ScrollProgressBar from '../components/ScrollProgressBar'
import ScrollTelemetryScanner from '../components/ScrollTelemetryScanner'

// Dynamic lazy imports to prevent blocking initial paint
const HeroCard3D = dynamic(() => import('../components/HeroCard3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center font-mono text-xs text-white/30">
      [CALIBRATING_3D_VIEWPORT]
    </div>
  ),
})

const ParticleField = dynamic(() => import('../components/ParticleField'), {
  ssr: false,
  loading: () => null,
})

// Register GSAP plugins safely on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LandingPage() {
  const heroRef = useRef(null)
  const problemRef = useRef(null)
  const featuresRef = useRef(null)
  const pathsRef = useRef(null)
  const ctaRef = useRef(null)

  const [activeFeatureTab, setActiveFeatureTab] = useState('inspection.log')

  const magneticBtn1 = useMagneticHover(0.25)
  const magneticBtn2 = useMagneticHover(0.25)
  const magneticCta = useMagneticHover(0.2)

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      gsap.set('.hero-headline, .hero-sub, .hero-buttons, .hero-stats, .problem-card, .feature-card, .path-card, .cta-content', {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
      })
      return
    }

    // Hero entrance choreography
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    
    tl.fromTo('.hero-badge', 
      { opacity: 0, y: -20 }, 
      { opacity: 1, y: 0, duration: 0.6 }
    )
    .fromTo('.hero-headline',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
      '-=0.3'
    )
    .fromTo('.hero-sub',
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      '-=0.5'
    )
    .fromTo('.hero-buttons',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo('.hero-stats',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
      '-=0.3'
    )

    // Hero Scroll-Out Parallax (smooth spatial departure into the scanner)
    if (heroRef.current) {
      gsap.to('.hero-text-col', {
        y: -70,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        }
      })

      gsap.to('.hero-card-col', {
        y: -35,
        scale: 0.94,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        }
      })
    }

    // Architectural Line Dividers expansion on scroll
    gsap.utils.toArray('.tech-divider-line').forEach((line) => {
      gsap.fromTo(line, 
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
          }
        }
      )
    })

    // Section title reveals (intentional and quiet, not scattered card bounces)
    gsap.utils.toArray('.section-header-reveal').forEach((header) => {
      gsap.fromTo(header,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 82%',
          }
        }
      )
    })

    // Cleanup triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <main className="relative bg-black text-white min-h-screen selection:bg-[#ef233c] selection:text-white overflow-x-hidden">
      
      {/* Top Fixed Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Background canvas particle system */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ contain: 'paint' }}>
        <ParticleField />
      </div>

      {/* Global Background Layer with Parallax Stars & Crimson Radial Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-[#140404] via-black to-black" />
        <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_50s_linear_infinite]" />
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_80s_linear_infinite]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#ef233c]/[0.04] rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>

      {/* Top Blur Header Mask */}
      <div className="gradient-blur" aria-hidden="true" />

      {/* Fixed Sticky Header/Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 pt-5 px-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between bg-black/70 backdrop-blur-xl border border-white/10 rounded-full px-6 py-2.5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-[#ef233c] rounded-sm rotate-45 shadow-[0_0_10px_#ef233c]" />
            <span className="text-base font-bold font-manrope tracking-tight text-white">DevLens</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 rounded-full">
              ONLINE
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-mono text-xs text-white/60">
            <a href="#diagnostic" className="hover:text-white transition-colors">DIAGNOSTIC</a>
            <a href="#telemetry-pipeline" className="hover:text-[#ef233c] text-white/90 transition-colors flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef233c] animate-pulse" />
              SCANNER
            </a>
            <a href="#features" className="hover:text-white transition-colors">CAPABILITIES</a>
            <a href="#paths" className="hover:text-white transition-colors">PATHWAYS</a>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/analyze" 
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 px-5 py-2 transition-transform active:scale-95 border border-white/10 hover:border-[#ef233c]/60"
            >
              <span className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono text-white">
                Launch Radar 
                <span className="text-[#ef233c] group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* SECTION 1: HERO */}
      <section 
        ref={heroRef} 
        id="hero" 
        className="min-h-screen relative flex items-center justify-center max-w-[1440px] mx-auto px-6 lg:px-12 pt-36 pb-20 z-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Hero text (Col-span 7) */}
          <div className="hero-text-col lg:col-span-7 flex flex-col justify-center will-change-transform">
            
            {/* Top Badge */}
            <div className="hero-badge self-start mb-6">
              <div className="inline-flex items-center gap-2.5 border border-[#ef233c]/30 bg-[#ef233c]/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]" />
                </span>
                <span className="font-mono text-[#ef233c] text-[11px] tracking-widest uppercase font-semibold">
                  DEVELOPER CODE TELEMETRY // GEMINI 1.5 FLASH
                </span>
              </div>
            </div>

            {/* Title block */}
            <div className="overflow-hidden mb-6">
              <h1 className="hero-headline text-[clamp(42px,6.8vw,80px)] font-black font-manrope leading-[0.96] tracking-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                  Measure Code.
                </span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                  Reveal Your
                </span>
                <span className="block text-[#ef233c] relative inline-block mt-1">
                  Trajectory.
                  <svg className="absolute w-full h-2.5 -bottom-2 left-0 text-[#ef233c] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="hero-sub text-white/70 text-lg lg:text-xl font-light tracking-wide max-w-lg mb-10 leading-relaxed font-manrope">
              Deterministic AST parsing. Multi-vector skill projection. Unfiltered recruiter diagnosis. Grounded strictly in your actual commits.
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/analyze?path=github" className="w-full sm:w-auto">
                <button
                  ref={magneticBtn1}
                  data-magnetic
                  className="hero-buttons shiny-cta group w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]"
                >
                  <span className="relative z-10 flex items-center gap-2 text-white font-medium text-sm">
                    Analyze My GitHub
                  </span>
                </button>
              </Link>
              <Link href="/analyze?path=quiz" className="w-full sm:w-auto">
                <button
                  ref={magneticBtn2}
                  data-magnetic
                  className="hero-buttons border border-white/10 text-white/80 font-medium hover:text-white hover:bg-white/5 transition-all rounded-full w-full sm:w-auto bg-black/60 px-7 py-4 flex items-center justify-center gap-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]"
                >
                  Take Diagnostic Quiz
                </button>
              </Link>
            </div>

            {/* Technical Verification Readouts */}
            <div className="hero-stats flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10 font-mono">
              {[
                { label: 'AST ENGINE', value: '14+ Languages' },
                { label: 'VERIFICATION', value: 'Live GitHub Data' },
                { label: 'CURATED ROADMAPS', value: 'Zero 404 Hallucination' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-[10px] text-white/40 tracking-widest uppercase">{item.label}</span>
                  <span className="text-white text-xs font-semibold mt-0.5">{item.value}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Hero 3D Card Stage (Col-span 5) */}
          <div className="hero-card-col lg:col-span-5 h-[560px] relative flex items-center justify-center will-change-transform">
            
            {/* Tech frame corners */}
            <div className="absolute inset-4 border border-white/5 pointer-events-none">
              <span className="tech-corner-tl" />
              <span className="tech-corner-br" />
            </div>

            {/* Ambient Red Glow */}
            <div className="absolute w-[360px] h-[360px] bg-[#ef233c]/10 blur-[100px] rounded-full pointer-events-none" />
            
            <HeroCard3D />

            {/* Real-time telemetry HUD overlay chips */}
            {[
              { text: 'AST_BYTES: 591,694 B', color: 'text-[#ef233c]', pos: 'top-6 right-2' },
              { text: 'READINESS: 86 / 100', color: 'text-[#ff9f1c]', pos: 'bottom-8 left-2' },
              { text: 'LATENCY: 18ms', color: 'text-emerald-400', pos: 'top-1/2 -left-3' }
            ].map((chip, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: idx * 0.9, ease: 'easeInOut' }}
                className={`absolute ${chip.pos} bg-black/90 border border-white/10 font-mono text-[10px] tracking-wider px-3 py-1.5 uppercase shadow-2xl z-20 ${chip.color}`}
              >
                {chip.text}
              </motion.div>
            ))}
          </div>

        </div>

        {/* Scroll Prompt Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">
            SCROLL TO COMMENCE SCAN
          </span>
          <div className="w-4 h-7 border border-white/20 rounded-full flex justify-center p-1">
            <div className="w-1 h-1.5 bg-[#ef233c] rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ARCHITECTURAL STATUS DIVIDER */}
      <div className="w-full border-y border-white/5 py-3.5 bg-black/70 backdrop-blur-md relative z-20 px-6 lg:px-12 max-w-[1440px] mx-auto flex items-center justify-between font-mono text-[10px] text-white/40">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ef233c] animate-pulse" />
          <span className="text-white/60">SYS_STATUS: CALIBRATING AST TELEMETRY</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <span>PARSER: RECURSIVE SYNTAX GRAPH</span>
          <span>COEFFICIENT: DETERMINISTIC</span>
          <span className="text-[#ef233c]">60FPS SCRUB ACTIVE</span>
        </div>
      </div>

      {/* SECTION 2: THE DIAGNOSTIC (Replacing generic Problem section) */}
      <section
        ref={problemRef}
        id="diagnostic"
        className="problem-section py-32 max-w-[1440px] mx-auto px-6 lg:px-12 relative z-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Context Header */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 self-start section-header-reveal">
              <div className="font-mono text-[#ef233c] text-[10px] tracking-[0.22em] uppercase mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#ef233c]" />
                [ENGINEERING_DIAGNOSTIC]
              </div>
              <h2 className="text-4xl lg:text-5xl font-black font-manrope tracking-tight leading-[1.05] text-white mb-6">
                The developer<br />
                <span className="text-white/30">blind spot.</span>
              </h2>
              <p className="text-white/70 text-base font-light leading-relaxed max-w-sm">
                Traditional hiring relies on resume buzzwords and rejection black holes. DevLens introduces deterministic telemetry based on what you actually build.
              </p>
            </div>
          </div>

          {/* Right Column: High-Contrast Diagnostic Matrix */}
          <div className="lg:col-span-7 space-y-6">
            {[
              {
                speculative: 'Keyword Padding on Resumes',
                telemetry: 'Deterministic AST Byte Distribution',
                desc: 'Listing "TypeScript" on a resume gives zero signal. DevLens measures 591,694 bytes of actual AST syntax, concurrency patterns, and architecture discipline.'
              },
              {
                speculative: 'The Rejection Black Hole',
                telemetry: 'Multi-Axis Radar Calibration',
                desc: 'Candidates fail screens without knowing why. DevLens evaluates 6 orthogonal engineering vectors so you know your exact baseline before applying.'
              },
              {
                speculative: 'Generic 10-Hour Tutorial Hell',
                telemetry: 'Curated Verified Roadmaps',
                desc: 'Generic internet roadmaps cause burnout. DevLens matches you directly to verified roadmap.sh learning pathways calibrated to your exact missing skills.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="problem-card tech-panel p-6 lg:p-8 rounded-none border border-white/10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/5 font-mono text-xs">
                  <div className="flex items-center gap-2 text-white/40">
                    <span className="text-red-400/80">✕</span>
                    <span>FLAW: {item.speculative}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span>✓</span>
                    <span>DEVLENS: {item.telemetry}</span>
                  </div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: THE DEVLENS OPTICAL SCANNER (Scroll-driven Pinned Animation) */}
      <ScrollTelemetryScanner />

      {/* SECTION 4: CAPABILITIES (Bento Grid) */}
      <section
        ref={featuresRef}
        id="features"
        className="features-section py-32 border-t border-white/10 max-w-[1440px] mx-auto px-6 lg:px-12 relative z-20"
      >
        <div className="mb-16">
          <div className="font-mono text-[#ef233c] text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ef233c]" />
            CAPABILITY // 003
          </div>
          <h2 className="text-4xl lg:text-5xl font-black font-manrope tracking-tight text-white leading-tight">
            Developer intelligence engine.
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="space-y-6">
          
          {/* Bento Item 1: Interactive Live Code Terminal */}
          <div className="feature-card tech-panel p-8 lg:p-10 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-10 relative z-10">
              <div className="max-w-xl">
                <span className="cyber-badge mb-4 inline-block">CORE ENGINE</span>
                <h3 className="text-3xl lg:text-4xl font-black font-manrope tracking-tight mb-4 text-white">
                  Real-Time GitHub AST Ingestion
                </h3>
                <p className="text-white/70 text-base leading-relaxed font-light mb-6">
                  Every repository, commit frequency, and byte weight is ingested into Gemini 1.5 Flash. We parse the structural DNA of your code to deliver verified role matching.
                </p>
                <div className="flex gap-2 font-mono text-xs text-white/50">
                  <span className="text-[#ef233c]">●</span> Direct API connection
                  <span className="mx-2 text-white/20">|</span>
                  <span className="text-[#ef233c]">●</span> Zero private token required
                </div>
              </div>

              {/* Interactive Terminal Window */}
              <div className="w-full lg:w-[420px] bg-black border border-white/10 shadow-2xl flex-shrink-0">
                {/* Tabs */}
                <div className="flex items-center border-b border-white/10 bg-[#0c0c12] text-xs font-mono">
                  {['inspection.log', 'radar-spec.json', 'roast.md'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveFeatureTab(tab)}
                      className={`px-3.5 py-2 border-r border-white/10 transition-colors ${
                        activeFeatureTab === tab ? 'bg-black text-[#ef233c] font-bold' : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-4 font-mono text-[11px] leading-relaxed select-none min-h-[160px]">
                  {activeFeatureTab === 'inspection.log' && (
                    <div className="space-y-1 text-white/70">
                      <div className="text-white/40">$ devlens scan --target=N-AVTEJ</div>
                      <div className="text-emerald-400">✓ Parsed 14 repositories</div>
                      <div className="text-emerald-400">✓ Language byte weighting synchronized</div>
                      <div className="text-white/80">▶ Trajectory: Full-Stack Systems Engineer (94%)</div>
                      <div className="text-[#ef233c]">● Readiness status: 86/100 (Internship Ready)</div>
                    </div>
                  )}

                  {activeFeatureTab === 'radar-spec.json' && (
                    <div className="space-y-1 text-white/70">
                      <div>{'{'}</div>
                      <div className="pl-4 text-purple-400">"systemArchitecture": <span className="text-[#ef233c]">92</span>,</div>
                      <div className="pl-4 text-purple-400">"frontendPrecision": <span className="text-[#ef233c]">88</span>,</div>
                      <div className="pl-4 text-purple-400">"concurrencyHandling": <span className="text-emerald-400">84</span>,</div>
                      <div className="pl-4 text-purple-400">"stateManagement": <span className="text-[#ff9f1c]">90</span></div>
                      <div>{'}'}</div>
                    </div>
                  )}

                  {activeFeatureTab === 'roast.md' && (
                    <div className="space-y-1 text-white/70">
                      <div className="text-[#ef233c] font-bold"># Brutally Honest AI Diagnosis</div>
                      <p className="text-white/80 text-[10px] leading-normal">
                        "Your frontend craft is sharp, but your backend services lack distributed tracing. Add Redis caching and observability before applying to Staff roles."
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Bento Row 2: Three Distinct Diagnostic Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                tag: 'RADAR ANALYSIS',
                title: '6-Axis Capability Radar',
                desc: 'Multi-dimensional visualization across System Design, Frontend, Algorithmic Rigor, DevOps, and Data Architecture.',
                metric: '6 ORTHOGONAL AXES'
              },
              {
                tag: 'OBJECTIVE CRITIQUE',
                title: 'Unfiltered Roast Mode',
                desc: 'No sugar-coating. Receive candid executive recruiter diagnosis pointing out exact architectural flaws in your portfolio.',
                metric: 'SENIOR RECRUITER CALIBRATED'
              },
              {
                tag: 'VERIFIED PATHS',
                title: 'Curated Roadmap Registry',
                desc: 'Direct integration with verified roadmap.sh learning pathways. Zero hallucinated 404 links.',
                metric: '100% REGISTRY VALIDATED'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="feature-card tech-panel p-8 flex flex-col justify-between min-h-[260px] border border-white/10"
              >
                <div>
                  <span className="font-mono text-[10px] text-[#ef233c] uppercase tracking-widest block mb-3">
                    {item.tag}
                  </span>
                  <h4 className="text-xl font-bold text-white mb-2 font-manrope">{item.title}</h4>
                  <p className="text-white/70 text-sm leading-relaxed font-light">{item.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 font-mono text-[10px] text-white/50 tracking-wider">
                  {item.metric}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: DUAL ENTRY TERMINALS (Choose Your Path) */}
      <section
        ref={pathsRef}
        id="paths"
        className="paths-section py-32 border-t border-white/10 max-w-[1440px] mx-auto px-6 lg:px-12 relative z-20"
      >
        <div className="mb-16">
          <div className="font-mono text-[#ef233c] text-xs tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#ef233c]" />
            VECTOR_SELECT // 004
          </div>
          <h2 className="text-4xl lg:text-5xl font-black font-manrope tracking-tight text-white leading-none">
            Choose your entry terminal.
          </h2>
        </div>

        {/* Dual High-Tech Terminals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Terminal A: GitHub Direct Scanning */}
          <div className="path-card tech-panel p-10 lg:p-12 border border-white/10 hover:border-[#ef233c]/50 transition-all duration-300 relative flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="cyber-badge">PRIMARY TERMINAL</span>
                <span className="font-mono text-xs text-white/40">DEV_INGEST_01</span>
              </div>

              <h3 className="text-3xl font-black font-manrope text-white mb-3">
                GitHub Repository Ingestion
              </h3>
              <p className="text-white/70 text-sm mb-8 font-light leading-relaxed max-w-sm">
                Enter your GitHub handle to initiate instantaneous AST analysis, language weight distribution, and readiness scoring.
              </p>

              <div className="space-y-3 mb-8 font-mono text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <span className="text-[#ef233c]">→</span>
                  <span>Instant scan of all public repositories</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ef233c]">→</span>
                  <span>Multi-vector skill radar breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ef233c]">→</span>
                  <span>Verified roadmap.sh career match</span>
                </div>
              </div>
            </div>

            <Link href="/analyze?path=github" className="w-full">
              <button
                type="button"
                className="w-full py-4 bg-[#ef233c] hover:bg-red-700 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-none transition-colors duration-200 shadow-[0_0_20px_rgba(239,35,60,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]"
              >
                Launch GitHub Scanner →
              </button>
            </Link>
          </div>

          {/* Terminal B: Diagnostic Assessment Survey */}
          <div className="path-card tech-panel p-10 lg:p-12 border border-white/10 hover:border-[#ff3366]/50 transition-all duration-300 relative flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-[11px] tracking-widest uppercase px-3 py-1 border border-white/20 bg-white/5 text-white/80">
                  DIAGNOSTIC TERMINAL
                </span>
                <span className="font-mono text-xs text-white/40">SURVEY_02</span>
              </div>

              <h3 className="text-3xl font-black font-manrope text-white mb-3">
                Technical Heuristics Survey
              </h3>
              <p className="text-white/70 text-sm mb-8 font-light leading-relaxed max-w-sm">
                Building your first repositories? Complete our 8-vector technical inquiry to calibrate personality and engineering alignment.
              </p>

              <div className="space-y-3 mb-8 font-mono text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <span className="text-[#ff3366]">→</span>
                  <span>8-question career aptitude model</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff3366]">→</span>
                  <span>Psychometric tech role correlation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#ff3366]">→</span>
                  <span>Beginner-friendly curriculum whitelist</span>
                </div>
              </div>
            </div>

            <Link href="/analyze?path=quiz" className="w-full">
              <button
                type="button"
                className="w-full py-4 border border-[#ff3366]/40 bg-[#ff3366]/10 hover:bg-[#ff3366]/20 text-white font-mono text-xs font-bold uppercase tracking-widest rounded-none transition-colors duration-200 shadow-[0_0_20px_rgba(255,51,102,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3366]"
              >
                Begin Heuristics Quiz →
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 6: FINAL CTA */}
      <section ref={ctaRef} className="cta-section py-36 text-center relative overflow-hidden border-t border-white/10 z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ef233c]/[0.05] blur-[140px] w-[500px] h-[500px] rounded-full pointer-events-none" />

        <div className="cta-content relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-[clamp(36px,5.5vw,72px)] font-black font-manrope tracking-tight leading-[0.98] mb-6 text-white">
            Calibrate your<br />
            <span className="text-[#ef233c]">career trajectory.</span>
          </h2>
          <p className="text-white/70 text-base lg:text-lg mb-10 max-w-md mx-auto font-light leading-relaxed font-manrope">
            Direct GitHub code scanning or technical heuristics. Zero credentials required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/analyze?path=github">
              <button
                type="button"
                ref={magneticCta}
                data-magnetic
                className="shiny-cta group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c]"
              >
                <span className="relative z-10 flex items-center gap-2 text-white font-medium text-sm">
                  Commence Analysis <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                </span>
              </button>
            </Link>
          </div>

          <div className="mt-8 flex justify-center gap-4 text-white/50 text-xs font-mono tracking-wider uppercase">
            <span>Deterministic</span>
            <span>•</span>
            <span>Zero Hallucination</span>
            <span>•</span>
            <span>Gemini 1.5 Flash</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-20 pb-12 max-w-[1440px] mx-auto px-6 lg:px-12 relative z-20 border-t border-white/5">
        
        {/* Massive stroked architectural footer text */}
        <div className="flex justify-center items-center py-6 opacity-10 pointer-events-none select-none" aria-hidden="true">
          <span className="text-[14vw] leading-none font-bold font-manrope tracking-tighter text-stroke select-none">
            DEVLENS
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 mt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-white tracking-wider font-manrope">DevLens AI</span>
            <span className="text-white/40 text-xs font-mono">v1.2 // PROD</span>
          </div>
          
          <div className="text-white/50 text-xs font-mono tracking-wider">
            POWERED BY GEMINI 1.5 FLASH + GITHUB REST API + ROADMAP REGISTRY
          </div>
        </div>
      </footer>

    </main>
  )
}
