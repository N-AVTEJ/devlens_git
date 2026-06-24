'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import HeroCard3D from '../components/HeroCard3D'
import Link from 'next/link'
import useMagneticHover from '../hooks/useMagneticHover'
import ParticleField from '../components/ParticleField'


// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function LandingPage() {
  const heroRef = useRef(null)
  const problemRef = useRef(null)
  const howRef = useRef(null)
  const featuresRef = useRef(null)
  const pathsRef = useRef(null)
  const ctaRef = useRef(null)

  const magneticBtn1 = useMagneticHover(0.25)
  const magneticBtn2 = useMagneticHover(0.25)
  const magneticCta = useMagneticHover(0.2)

  useEffect(() => {
    // Hero entrance — fires immediately on load
    gsap.fromTo('.hero-headline',
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.15 }
    )
    gsap.fromTo('.hero-sub',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.4, ease: 'power2.out' }
    )
    gsap.fromTo('.hero-buttons',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 0.7, ease: 'power2.out' }
    )
    gsap.fromTo('.hero-stats',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, delay: 1, ease: 'power2.out', stagger: 0.1 }
    )

    // Problem cards stagger on scroll
    gsap.fromTo('.problem-card',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.problem-section',
          start: 'top 75%',
        }
      }
    )

    // How it works steps
    gsap.fromTo('.step-item',
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: '.how-section',
          start: 'top 70%',
        }
      }
    )

    // Feature cards cascade
    gsap.fromTo('.feature-card',
      { y: 50, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.features-section',
          start: 'top 75%',
        }
      }
    )

    // Path cards
    gsap.fromTo('.path-card',
      { x: (i) => i === 0 ? -60 : 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.paths-section',
          start: 'top 70%',
        }
      }
    )

    // CTA section
    gsap.fromTo('.cta-content',
      { y: 40, opacity: 0, scale: 0.98 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 75%',
        }
      }
    )

    // SVG path tracing
    gsap.to('#connect-path', {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.how-section',
        start: 'top 60%',
        end: 'center center',
        scrub: 1.5,
      }
    })

    gsap.fromTo('#path-dot',
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: '.how-section',
          start: 'top 60%',
        }
      }
    )

    // Cleanup triggers on unmount to avoid memory leaks
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <main className="relative bg-black text-white min-h-screen selection:bg-[#ef233c] selection:text-white overflow-x-hidden">
      
      {/* Background canvas particle system */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ contain: 'paint' }}>
        <ParticleField />
      </div>



      {/* Global Background Layer with Parallax Stars & Red Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-black"></div>
        <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_50s_linear_infinite]"></div>
        <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_80s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)]"></div>
      </div>

      {/* Top Blur Header Mask */}
      <div className="gradient-blur"></div>

      {/* Fixed Sticky Header/Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 pt-6 px-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-[#ef233c] rounded-sm rotate-45"></div>
            <span className="text-lg font-bold font-manrope tracking-tight">DevLens AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-manrope">
            <a href="#problem" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Problem</a>
            <a href="#how-it-works" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">How It Works</a>
            <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#paths" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Paths</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/analyze" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 px-6 py-2.5 transition-transform active:scale-95">
              <span className="absolute inset-0 border border-white/10 rounded-full"></span>
              <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ef233c_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute inset-[1px] rounded-full bg-black"></span>
              <span className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider font-mono">
                Get Access <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* SECTION 1: HERO */}
      <section ref={heroRef} id="hero" className="min-h-screen relative flex items-center justify-center max-w-[1440px] mx-auto px-8 lg:px-12 pt-36 pb-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20 w-full">
          
          {/* Hero text (Col-span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top Badge */}
            <div className="self-start">
              <div className="inline-flex items-center gap-2 border border-[#ef233c]/20 bg-[#ef233c]/5 px-4 py-1.5 mb-8 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]"></span>
                </span>
                <span className="font-mono text-[#ef233c] text-xs tracking-widest uppercase">
                  Career Intelligence Platform
                </span>
              </div>
            </div>

            {/* Title block */}
            <div className="overflow-hidden">
              <h1 className="hero-headline text-[clamp(44px,7.5vw,80px)] font-bold font-manrope leading-[0.95] tracking-[-0.04em] mb-8">
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">Turn Your</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">Skills Into</span>
                <span className="block text-[#ef233c] relative inline-block">
                  Career Intel.
                  <svg className="absolute w-full h-2.5 -bottom-2 left-0 text-[#ef233c] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="2.5" fill="none" />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Subtext */}
            <p className="hero-sub text-white/40 text-xl font-light tracking-wide max-w-md mb-10 leading-relaxed font-manrope">
              Real GitHub analysis. AI career matching. Honest recruiter feedback. No fluff.
            </p>

            {/* Action buttons - rounded shiny borders */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/analyze" className="w-full sm:w-auto">
                <button
                  ref={magneticBtn1}
                  data-magnetic
                  className="hero-buttons shiny-cta group w-full sm:w-auto"
                >
                  <span className="relative z-10 flex items-center gap-2 text-white font-medium">
                    Analyse My GitHub <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                  </span>
                </button>
              </Link>
              <Link href="/analyze" className="w-full sm:w-auto">
                <button
                  ref={magneticBtn2}
                  data-magnetic
                  className="hero-buttons border border-zinc-800 text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 transition-all rounded-full w-full sm:w-auto bg-zinc-900/60 px-8 py-4 flex items-center justify-center gap-2"
                >
                  I'm New to Tech
                </button>
              </Link>
            </div>

            {/* Verified readouts below buttons - terminal style */}
            <div className="hero-stats flex gap-8 mt-12 pt-8 border-t border-white/5">
              {['14+ Languages', 'Real GitHub Data', 'AI-Powered'].map((stat, idx) => (
                <div key={idx}>
                  <div className="font-mono text-[#ef233c] text-xs uppercase tracking-wider">{stat}</div>
                  <div className="text-white/20 text-[10px] font-mono mt-0.5 uppercase tracking-widest">verified</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero 3D Card (Col-span 5) */}
          <div className="lg:col-span-5 h-[600px] relative flex items-center justify-center">
            {/* Background neon red glow behind card */}
            <div className="absolute w-[400px] h-[400px] bg-[#ef233c]/5 blur-[120px] rounded-full pointer-events-none" />
            
            <HeroCard3D />

            {/* Floating decorative metadata chips around the 3D card */}
            {[
              { text: 'TypeScript: 591k bytes', color: 'text-[#ef233c]', pos: 'top-8 right-0' },
              { text: 'Readiness: 78/100', color: 'text-[#ff9f1c]', pos: 'bottom-16 left-0' },
              { text: '14 repos', color: 'text-white/60', pos: 'top-1/2 left-0' }
            ].map((chip, idx) => (
              <motion.div
                key={idx}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: idx * 0.8, ease: 'easeInOut' }}
                className={`absolute ${chip.pos} bg-black border border-white/10 font-mono text-[10px] tracking-wider px-3.5 py-2 uppercase shadow-2xl z-20 rounded-none ${chip.color}`}
              >
                {chip.text}
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* TICKER / MARQUEE TRANSITION BANNER */}
      <div className="w-full overflow-hidden border-y border-white/5 py-4 bg-[#080202]">
        <div className="marquee-inner flex select-none">
          {Array.from({ length: 3 }).map((_, repeatIdx) => (
            <span key={repeatIdx} className="font-mono text-xs text-white/20 tracking-[0.25em] uppercase mr-4 whitespace-nowrap">
              GITHUB ANALYSIS  ◆  CAREER MATCHING  ◆  SKILL DETECTION  ◆  READINESS SCORE  ◆  AI RECRUITER FEEDBACK  ◆  ROADMAP GENERATION  ◆  
            </span>
          ))}
        </div>
      </div>

      {/* SECTION 2: THE PROBLEM */}
      <section
        ref={problemRef}
        id="problem"
        className="problem-section py-32 max-w-[1440px] mx-auto px-8 lg:px-12 relative z-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Side: Sticky Section Label */}
          <div className="md:col-span-5 mb-8 md:mb-0">
            <div className="sticky top-32 self-start">
              <div className="font-mono text-[#ef233c] text-xs tracking-[0.2em] uppercase mb-4">
                01 — Problem
              </div>
              <h2 className="text-5xl font-black font-manrope tracking-tight leading-[1.05] text-white">
                Students are<br />
                <span className="text-white/25">flying blind</span><br />
                in tech.
              </h2>
              <hr className="glow-line mt-8 w-24" />
            </div>
          </div>

          {/* Right Side: Stacked problem blocks */}
          <div className="md:col-span-7 divide-y divide-white/5">
            {[
              {
                title: 'No career direction',
                desc: 'Thousands of roles exist. Zero clarity on which one fits your actual skills and activity patterns.'
              },
              {
                title: 'No industry benchmark',
                desc: "Without real, objective feedback, you do not know what is missing until you start failing technical interviews."
              },
              {
                title: 'Generic learning paths',
                desc: 'The internet has infinite tutorials, but absolutely nothing is tailored dynamically to your specific code.'
              }
            ].map((prob, idx) => (
              <div
                key={idx}
                className="problem-card py-8 flex gap-6 group hover:bg-white/[0.015] px-4 -mx-4 transition-colors duration-300 rounded-none border-t border-transparent"
              >
                <div className="font-mono text-white/20 text-sm w-8 flex-shrink-0 mt-1 group-hover:text-[#ef233c] transition-colors">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{prob.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light">{prob.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section
        ref={howRef}
        id="how-it-works"
        className="how-section py-32 border-t border-white/5 max-w-[1440px] mx-auto px-8 lg:px-12 relative z-20"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Side: Sticky Section Label */}
          <div className="md:col-span-5 mb-8 md:mb-0">
            <div className="sticky top-32 self-start">
              <div className="font-mono text-[#ef233c] text-xs tracking-[0.2em] uppercase mb-4">
                02 — How It Works
              </div>
              <h2 className="text-5xl font-black font-manrope tracking-tight leading-[1.05] text-white">
                Intelligence<br />
                in 3 steps.
              </h2>
              <hr className="glow-line mt-8 w-24" />
            </div>
          </div>

          {/* Right Side: Step Items stacked */}
          <div className="md:col-span-7 relative">
            
            {/* SVG Connecting Tracing Line (Desktop Only) */}
            <div className="absolute left-[38px] top-12 bottom-12 w-0.5 pointer-events-none hidden md:block z-0">
              <svg 
                className="absolute inset-0 w-4 h-full pointer-events-none"
                style={{ overflow: 'visible' }}
              >
                <path
                  id="connect-path"
                  d="M 2 10 L 2 600"
                  fill="none"
                  stroke="#ef233c"
                  strokeWidth="1"
                  strokeDasharray="600"
                  strokeDashoffset="600"
                  opacity="0.3"
                />
                <circle id="path-dot" cx="2" cy="10" r="3" fill="#ef233c" opacity="0.6" />
              </svg>
            </div>

            {[
              {
                title: 'Choose Your Path',
                desc: 'Enter your GitHub username for real-time code scanning, or take our quick interests career quiz.'
              },
              {
                title: 'AI Scans Your Profile',
                desc: 'Our platform parses language data bytes, repos, and commit metrics in the background.'
              },
              {
                title: 'Get Career Intelligence',
                desc: 'Receive role matching coefficients, industry ready indicators, and a direct learning roadmap.'
              }
            ].map((step, idx) => (
              <div
                key={idx}
                className="step-item flex gap-8 mb-16 last:mb-0 group relative z-10"
              >
                <div className="font-mono text-[clamp(64px,10vw,96px)] font-black text-white/5 leading-none select-none flex-shrink-0 w-24 md:w-32 group-hover:text-[#ef233c]/10 transition-colors duration-300">
                  0{idx + 1}
                </div>
                <div className="pt-4 border-l border-white/10 pl-8 flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES */}
      <section
        ref={featuresRef}
        id="features"
        className="features-section py-32 border-t border-white/5 max-w-[1440px] mx-auto px-8 lg:px-12 relative z-20"
      >
        <div className="mb-16">
          <span className="font-mono text-[#ef233c] text-xs tracking-[0.2em] uppercase mb-4 block">
            03 — Features
          </span>
          <h2 className="text-5xl font-black font-manrope tracking-tight text-white leading-none">
            Everything you need to find your path
          </h2>
        </div>

        {/* Asymmetric Features Grid Layout */}
        <div className="space-y-6">
          
          {/* Row 1: Full Width Wide Feature Hero */}
          <div className="feature-card card-glow p-10 mb-4 relative overflow-hidden rounded-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef233c]/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 relative z-10">
              <div className="max-w-xl">
                <div className="font-mono text-[#ef233c] text-xs uppercase tracking-widest mb-4">Primary Feature</div>
                <h3 className="text-4xl font-black font-manrope tracking-tight mb-4 text-white">
                  GitHub Analysis
                </h3>
                <p className="text-white/40 text-lg leading-relaxed font-light">
                  Every repository. Every language. Every commit pattern. We scan it all and translate it directly into real-time career intelligence.
                </p>
              </div>
              
              {/* Mini Terminal Preview Widget */}
              <div className="terminal p-5 w-full lg:w-80 flex-shrink-0 bg-black border border-[#ef233c]/20 shadow-[0_0_30px_rgba(239,35,60,0.04)]">
                <div className="flex gap-1.5 mb-4 select-none">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff3366]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff9f1c]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef233c]/60" />
                </div>
                <div className="font-mono text-[11px] space-y-1.5">
                  <div className="text-white/30">$ devlens analyze N-AVTEJ</div>
                  <div className="text-[#ef233c]">✓ Found 14 repositories</div>
                  <div className="text-[#ef233c]">✓ TypeScript: 591,694 bytes</div>
                  <div className="text-[#ef233c]">✓ JavaScript: 349,578 bytes</div>
                  <div className="text-white/30">▶ Detecting role...</div>
                  <div className="text-[#ff9f1c]">→ Frontend Developer: 87%</div>
                  <div className="flex items-center gap-1 text-white/30">
                    <span>Generating roadmap</span>
                    <span className="animate-[blink_1s_infinite] text-[#ef233c]">_</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Three Columns Asymmetric small cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Career Matches',
                desc: 'AI-ranked career roles based on your actual code profiles and activity data.',
                stat: '5 career paths detected'
              },
              {
                icon: '📡',
                title: 'Skill Radar',
                desc: 'A visual chart scanning capabilities across 6 distinct engineering domains.',
                stat: '6 dimensional scan'
              },
              {
                icon: '🔥',
                title: 'Roast Mode',
                desc: 'Brutally honest, objective AI critique for developers who want the truth.',
                stat: 'Roast Mode enabled'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                style={{ willChange: 'transform' }}
                className="feature-card card-glow p-8 flex flex-col justify-between min-h-[240px] rounded-none"
              >
                <div>
                  <div className="text-3xl mb-4 select-none">{item.icon}</div>
                  <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-white/40 text-sm leading-relaxed font-light">{item.desc}</p>
                </div>
                <div className="mt-6 font-mono text-xs text-[#ef233c] uppercase tracking-widest">{item.stat}</div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: TWO PATHS PANEL */}
      <section
        ref={pathsRef}
        id="paths"
        className="paths-section py-32 border-t border-white/5 max-w-[1440px] mx-auto px-8 lg:px-12 relative z-20"
      >
        <div className="mb-16">
          <span className="font-mono text-[#ef233c] text-xs tracking-[0.2em] uppercase mb-4 block">
            04 — Choose Your Path
          </span>
          <h2 className="text-5xl font-black font-manrope tracking-tight text-white leading-none">
            Two paths. One destination.
          </h2>
        </div>

        {/* 50/50 touching panel grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 w-full overflow-hidden rounded-none">
          
          {/* Left panel: GitHub Path */}
          <div className="path-card bg-black p-12 md:p-16 hover:bg-[#ef233c]/[0.02] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[48vh]">
            {/* Background numeric marker */}
            <div className="absolute bottom-4 right-4 text-[200px] font-black text-[#ef233c]/[0.02] leading-none select-none font-mono">
              01
            </div>

            <div className="relative z-10">
              <div className="text-4xl mb-6 select-none">⚡</div>
              <h3 className="text-4xl font-black font-manrope text-white mb-4">I Have GitHub</h3>
              <p className="text-white/40 text-sm mb-8 max-w-xs font-light">
                Analyse all your public repositories, languages, and commit parameters in real time.
              </p>
              
              <div className="space-y-3.5 mb-8">
                {['Analyse all public repositories', 'Detect languages and skill levels', 'Get internship readiness score', 'AI recruiter feedback on your profile'].map((bullet, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-xs text-white/50 font-mono">
                    <span className="text-[#ef233c]">→</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <Link href="/analyze?path=github" className="w-full relative z-10">
              <button className="w-full bg-[#ef233c] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors duration-300">
                Start Analysis →
              </button>
            </Link>
          </div>

          {/* Right panel: Quiz Path */}
          <div className="path-card bg-black p-12 md:p-16 hover:bg-[#ff3366]/[0.02] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[48vh]">
            {/* Background numeric marker */}
            <div className="absolute bottom-4 right-4 text-[200px] font-black text-[#ff3366]/[0.02] leading-none select-none font-mono">
              02
            </div>

            <div className="relative z-10">
              <div className="text-4xl mb-6 select-none">🌱</div>
              <h3 className="text-4xl font-black font-manrope text-white mb-4">I'm New to Tech</h3>
              <p className="text-white/40 text-sm mb-8 max-w-xs font-light">
                No repositories? Complete an 8-question interests survey to unlock personality role matching.
              </p>

              <div className="space-y-3.5 mb-8">
                {['8-question career interest quiz', 'Personality-based role matching', 'Beginner-friendly roadmap', 'First steps you can take today'].map((bullet, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-xs text-white/50 font-mono">
                    <span className="text-[#ff3366]">→</span>
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/analyze?path=quiz" className="w-full relative z-10">
              <button className="w-full border border-[#ff3366]/30 bg-[#ff3366]/5 hover:bg-[#ff3366]/20 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors duration-300 shadow-[0_0_15px_rgba(255,51,102,0.1)]">
                Take the Quiz →
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* SOCIAL PROOF / STATS BAR */}
      <div className="w-full border-y border-white/5 py-16 bg-[#080202] relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center px-4">
          {[
            { val: '8 ★', label: 'GitHub Stars' },
            { val: '14+', label: 'Repos Scanned' },
            { val: '5', label: 'Career Paths' },
            { val: '100%', label: 'Real GitHub Data' }
          ].map((item, idx) => (
            <div key={idx}>
              <div className="font-mono text-4xl font-black text-[#ef233c]">{item.val}</div>
              <div className="text-white/30 text-[10px] mt-1.5 uppercase tracking-widest font-mono">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 6: FINAL CTA */}
      <section ref={ctaRef} className="py-40 text-center relative overflow-hidden border-b border-white/5 z-20">
        {/* Subtle radial neon red backdrop glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ef233c]/[0.03] blur-[150px] w-[500px] h-[500px] rounded-full pointer-events-none" />

        <div className="cta-content relative z-10 max-w-4xl mx-auto px-8">
          <h2 className="text-[clamp(40px,6vw,80px)] font-black font-manrope tracking-tight leading-[0.95] mb-4 text-white">
            Ready to find your<br />
            <span className="text-electric">career path?</span>
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-md mx-auto font-light leading-relaxed font-manrope">
            Scan your repositories or evaluate interests. No signup required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/analyze">
              <button
                ref={magneticCta}
                data-magnetic
                className="shiny-cta group"
              >
                <span className="relative z-10 flex items-center gap-2 text-white font-medium">
                  Start Free Analysis <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </span>
              </button>
            </Link>
          </div>

          <div className="mt-6 flex justify-center gap-2 text-white/20 text-xs font-mono tracking-wider uppercase">
            <span>Free to use</span>
            <span>•</span>
            <span>No Signup</span>
            <span>•</span>
            <span>Real GitHub Data</span>
          </div>
        </div>
      </section>

      {/* SECTION 7: FOOTER */}
      <footer className="pt-24 pb-8 max-w-[1440px] mx-auto px-8 lg:px-12 relative z-20">
        
        {/* Huge stroked background footer text */}
        <div className="flex justify-center items-center py-10 opacity-10 pointer-events-none select-none">
          <h1 className="text-[15vw] leading-none font-bold font-manrope tracking-tighter text-stroke select-none">DEVLENS</h1>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-zinc-900 pt-8 mt-8">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-black text-white tracking-wider font-manrope">DevLens AI</span>
            <span className="text-white/20 text-xs font-mono tracking-widest">v1.0</span>
          </div>
          
          <div className="flex gap-6 text-white/40 text-xs font-mono">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>

          <div className="text-white/20 text-xs font-mono tracking-wider">
            BUILT WITH GEMINI 1.5 FLASH API + GITHUB API
          </div>
        </div>
      </footer>

    </main>
  )
}
