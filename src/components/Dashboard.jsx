'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer
} from 'recharts'
import html2canvas from 'html2canvas'

// Morphing Icons definition
const flameIcon = "M12 2C8 6 6 9 8 12c1-2 3-3 4-2-2 3-1 6 2 7-4 0-7-3-7-7 0-5 5-10 5-10z"
const briefcaseIcon = "M20 7h-4V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm-8-2h4v2h-4V5z"

// Animated number counter component with Mono tabular format
function AnimatedNumber({ value, delay = 0 }) {
  const [display, setDisplay] = useState(0)
  
  useEffect(() => {
    let start = 0
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        start += 2
        setDisplay(Math.min(start, value))
        if (start >= value) clearInterval(interval)
      }, 20)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return <span className="score-display font-mono">{display}</span>
}

export default function Dashboard({ data }) {
  const {
    detectedRole = 'Software Engineer',
    careerMatches = [],
    detectedSkills = [],
    missingSkills = [],
    radarScores = {
      Frontend: 50,
      Backend: 50,
      DevOps: 50,
      DataML: 50,
      SystemDesign: 50,
      SoftSkills: 50
    },
    benchmarks = [],
    readinessScore = 50,
    readinessBreakdown = {
      consistency: 50,
      projectQuality: 50,
      skillDiversity: 50,
      documentation: 50
    },
    recruiterFeedback = {
      professional: 'Your profile shows strong capabilities.',
      roast: 'Nothing to roast here.'
    },
    roadmap = {
      targetRole: 'Full Stack Developer',
      roadmapUrl: 'https://roadmap.sh',
      months: []
    },
    marketInsight = 'No insights available.',
    firstSteps = [],
    scanMessages = []
  } = data

  const [roastMode, setRoastMode] = useState(false)
  const shareCardRef = useRef(null)

  // Staggered card entrance reveal
  const cardTransition = (index) => ({
    initial: { opacity: 0, y: 30, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { 
      type: 'spring', 
      stiffness: 260, 
      damping: 22,
      delay: index * 0.07
    },
    style: { willChange: 'transform' }
  });

  const radarData = [
    { axis: 'Frontend', score: radarScores.Frontend || 0 },
    { axis: 'Backend', score: radarScores.Backend || 0 },
    { axis: 'DevOps', score: radarScores.DevOps || 0 },
    { axis: 'Data/ML', score: radarScores.DataML || 0 },
    { axis: 'System Design', score: radarScores.SystemDesign || 0 },
    { axis: 'Soft Skills', score: radarScores.SoftSkills || 0 },
  ]

  // Generate shareable card image
  const handleShare = async () => {
    if (!shareCardRef.current) return
    try {
      const element = shareCardRef.current
      element.style.position = 'static'
      element.style.left = 'auto'
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#000000',
        scale: 2,
        useCORS: true
      })

      element.style.position = 'fixed'
      element.style.left = '-9999px'

      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'devlens-career-card.png'
        a.click()
        URL.revokeObjectURL(url)
      })
    } catch (err) {
      console.error('Sharing failed:', err)
    }
  }

  return (
    <div className="min-h-screen text-white pt-24 pb-16 font-sans">
      
      {/* STICKY TOP SCORE HEADER WITH GPU ACCELERATION */}
      <header 
        className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/5 z-50 px-8 py-4 select-none mb-12"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-[#ef233c] animate-[pulse-glow_2s_infinite]" />
            <span className="font-mono text-[#ef233c] text-xs uppercase tracking-[0.2em] font-bold">
              Career Intelligence Report
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Readiness Score</div>
              <div className="font-mono text-3xl font-black text-[#ef233c] score-display animate-[flicker_0.5s_ease-out]">
                <AnimatedNumber value={readinessScore} delay={150} />/100
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-right">
              <div className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-0.5">Detected Role</div>
              <div className="font-bold text-white text-base font-sans">{detectedRole}</div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN ASYMMETRIC BENTO GRID */}
      <main className="max-w-[1440px] mx-auto px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN - MAIN FINDINGS (Col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Row 1 nested: Career Matches & Radar Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Career Matches */}
            <motion.div
              {...cardTransition(0)}
              className="card-glow p-6 rounded-none flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="font-mono text-xs text-white/30 uppercase tracking-widest">
                    Career Matches
                  </span>
                  <span className="font-mono text-[10px] text-[#ef233c] uppercase tracking-wider">
                    {careerMatches.length} roles detected
                  </span>
                </div>
                
                <div className="space-y-6">
                  {careerMatches.slice(0, 4).map((match, idx) => {
                    const colors = ['#ef233c', '#ff3366', '#ff9f1c', 'rgba(255,255,255,0.4)']
                    const barColor = colors[idx] || '#ffffff'

                    return (
                      <div key={idx} className="group">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="font-semibold text-sm text-white group-hover:text-[#ef233c] transition-colors duration-300">
                            {match.role}
                          </span>
                          <span className="font-mono text-xl font-black text-white/20 group-hover:text-[#ef233c] transition-colors duration-300 score-display">
                            <AnimatedNumber value={match.match} delay={idx * 150} />%
                          </span>
                        </div>
                        {/* Sub-pixel Progress Lines */}
                        <div className="h-px bg-white/5 w-full overflow-hidden mb-1.5">
                          <motion.div
                            className="h-px"
                            style={{ 
                              background: barColor,
                              boxShadow: idx === 0 ? '0 0 8px rgba(239,35,60,0.8)' : 'none'
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${match.match}%` }}
                            transition={{ duration: 1.4, delay: idx * 0.15, ease: [0.33, 1, 0.68, 1] }}
                          />
                        </div>
                        <p className="text-[10px] text-white/20 font-mono leading-relaxed group-hover:text-white/40 transition-colors duration-300">
                          {match.reason}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              {...cardTransition(1)}
              className="card-glow p-6 rounded-none"
            >
              <span className="font-mono text-xs text-white/30 uppercase tracking-widest block mb-4">
                Capabilities Radar
              </span>
              <div className="w-full h-[240px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                    <PolarAngleAxis
                      dataKey="axis"
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
                    />
                    <Radar
                      name="Skills"
                      dataKey="score"
                      stroke="#ef233c"
                      fill="#ef233c"
                      fillOpacity={0.1}
                      strokeWidth={1}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Row 2 nested: Recruiter Feedback (Terminal) & Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Hacking Recruiter Terminal */}
            <motion.div
              {...cardTransition(4)}
              className="terminal rounded-none flex flex-col justify-between overflow-hidden shadow-[0_0_30px_rgba(239,35,60,0.02)]"
            >
              {/* Terminal Window Header */}
              <div className="bg-[#050505] border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
                <div className="flex gap-1.5 select-none">
                  <span className="w-2 h-2 rounded-full bg-[#ff3366]/60" />
                  <span className="w-2 h-2 rounded-full bg-[#ff9f1c]/60" />
                  <span className="w-2 h-2 rounded-full bg-[#ef233c]/60" />
                </div>
                <span className="text-white/30 text-[10px] font-mono tracking-wider">
                  recruiter-critique.log
                </span>
                
                {/* Micro Toggle triggers */}
                <button
                  onClick={() => setRoastMode(!roastMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 border font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                    roastMode 
                      ? 'border-[#ff9f1c]/30 bg-[#ff9f1c]/10 text-[#ff9f1c] hover:bg-[#ff9f1c]/20 shadow-[0_0_10px_rgba(255,159,28,0.15)]' 
                      : 'border-[#ef233c]/30 bg-[#ef233c]/10 text-[#ef233c] hover:bg-[#ef233c]/20 shadow-[0_0_10px_rgba(239,35,60,0.15)]'
                  }`}
                >
                  <motion.svg width="12" height="12" viewBox="0 0 24 24" className="shrink-0">
                    <motion.path
                      d={roastMode ? flameIcon : briefcaseIcon}
                      fill={roastMode ? '#ff9f1c' : '#ef233c'}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.svg>
                  <span>
                    {roastMode ? 'Roast Mode: ON' : 'Activate Roast Mode'}
                  </span>
                </button>
              </div>

              {/* Terminal Window Body */}
              <div className="bg-black p-5 font-mono text-xs leading-relaxed min-h-[160px] flex flex-col justify-between">
                <div>
                  <span className="text-[#ef233c] mr-2 select-none">&gt;_</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={roastMode ? 'roast' : 'pro'}
                      initial={{ opacity: 0, y: 2 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className={roastMode ? 'text-[#ff9f1c]' : 'text-white/70'}
                    >
                      {roastMode ? recruiterFeedback.roast : recruiterFeedback.professional}
                    </motion.span>
                  </AnimatePresence>
                  <span className="animate-[blink_1s_infinite] text-[#ef233c] ml-0.5">_</span>
                </div>
                <div className="text-white/15 text-[9px] tracking-widest uppercase mt-4">
                  critical recruiter review logic locked
                </div>
              </div>
            </motion.div>

            {/* Skills Card with sharp dividing line */}
            <motion.div
              {...cardTransition(2)}
              className="card-glow p-6 rounded-none flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs text-white/30 uppercase tracking-widest block mb-6">
                  Skills Matrix
                </span>
                
                <div className="grid grid-cols-2 gap-4 divide-x divide-white/5">
                  {/* Detected Column */}
                  <div className="pr-2">
                    <span className="text-[#ef233c] font-mono text-[10px] uppercase tracking-wider block mb-4">
                      ✓ Detected
                    </span>
                    <div className="space-y-2">
                      {detectedSkills.length > 0 ? (
                        detectedSkills.slice(0, 5).map((skill, idx) => (
                          <div key={idx} className="font-mono text-[11px] text-white/60 truncate">
                            → {skill}
                          </div>
                        ))
                      ) : (
                        <div className="text-white/20 text-xs italic font-mono">none</div>
                      )}
                    </div>
                  </div>

                  {/* Missing Column */}
                  <div className="pl-6">
                    <span className="text-[#ff3366] font-mono text-[10px] uppercase tracking-wider block mb-4">
                      ✗ Missing
                    </span>
                    <div className="space-y-2">
                      {missingSkills.length > 0 ? (
                        missingSkills.slice(0, 5).map((skill, idx) => (
                          <div key={idx} className="font-mono text-[11px] text-white/35 truncate">
                            ✗ {skill}
                          </div>
                        ))
                      ) : (
                        <div className="text-white/20 text-xs italic font-mono">none</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Row 3 nested: Benchmarks & Readiness Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Industry Benchmarks */}
            {benchmarks && benchmarks.length > 0 ? (
              <motion.div
                {...cardTransition(3)}
                className="card-glow p-6 rounded-none"
              >
                <span className="font-mono text-xs text-white/30 uppercase tracking-widest block mb-4">
                  Industry Benchmarks
                </span>
                <div className="space-y-4">
                  {benchmarks.slice(0, 3).map((bench, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                        <span className="text-white/80">{bench.skill}</span>
                        <span className="text-white/30">{bench.label}</span>
                      </div>
                      <div className="w-full bg-white/5 h-0.5 overflow-hidden">
                        <motion.div
                          className="h-full bg-[#ef233c]"
                          initial={{ width: 0 }}
                          animate={{ width: `${bench.percentile}%` }}
                          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="hidden" />
            )}

            {/* Readiness Breakdown */}
            <motion.div
              {...cardTransition(5)}
              className="card-glow p-6 rounded-none"
            >
              <span className="font-mono text-xs text-white/30 uppercase tracking-widest block mb-6">
                Readiness Breakdown
              </span>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Consistency', val: readinessBreakdown.consistency },
                  { name: 'Project Quality', val: readinessBreakdown.projectQuality },
                  { name: 'Skill Diversity', val: readinessBreakdown.skillDiversity || 50 },
                  { name: 'Documentation', val: readinessBreakdown.documentation || 50 }
                ].map((item, idx) => (
                  <div key={idx} className="bg-[#080808] border border-white/5 p-4 rounded-none flex flex-col justify-between">
                    <span className="text-white/30 text-[9px] font-mono uppercase tracking-wider block mb-1">
                      {item.name}
                    </span>
                    <div>
                      <span className="text-2xl font-black text-white score-display font-mono">
                        <AnimatedNumber value={item.val} delay={idx * 100} />%
                      </span>
                      {/* Metric bar */}
                      <div className="w-full bg-white/5 h-0.5 mt-2 overflow-hidden">
                        <div className="bg-[#ef233c] h-full" style={{ width: `${item.val}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Row 4 nested: Market Insight Banner (Full width) */}
          <motion.div
            {...cardTransition(7)}
            className="bg-[#080808] border-y border-[#ef233c]/10 px-8 py-6 flex gap-4 items-start select-none rounded-none"
          >
            <div className="font-mono text-xs border border-[#ef233c]/20 p-2 text-[#ef233c] shrink-0 bg-black">
              💡
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#ef233c] uppercase tracking-widest block mb-1">
                Market Intelligence Insight
              </span>
              <p className="text-white/45 text-xs italic font-light leading-relaxed">
                "{marketInsight}"
              </p>
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN - PERSONALIZED ROADMAP (Sticky, Col-span 1) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Roadmap Card */}
          <motion.div
            {...cardTransition(6)}
            className="card-glow p-6 sticky top-24 shadow-2xl flex flex-col justify-between rounded-none z-10"
          >
            <div>
              <span className="font-mono text-xs text-white/30 uppercase tracking-widest block mb-1">
                Personalized Roadmap
              </span>
              <div className="text-lg font-bold text-[#ef233c] mb-6 font-mono tracking-tight">
                Target: {roadmap.targetRole}
              </div>

              {/* Vertical timeline */}
              <div className="relative pl-6 border-l border-white/15 space-y-8 ml-2.5 py-1">
                {roadmap.months.map((monthData, idx) => {
                  const isFirst = idx === 0
                  return (
                    <div key={idx} className="relative mb-2 last:mb-0">
                      {/* Circle Dot pin with pulsing glow */}
                      <div className={`absolute -left-[32px] top-1.5 w-3.5 h-3.5 rounded-full flex items-center justify-center font-mono text-[9px] ${
                        isFirst 
                          ? 'bg-[#ef233c] border border-[#ef233c] text-white font-bold animate-[pulse-glow_2s_infinite]' 
                          : 'bg-[#080808] border border-white/20 text-white/40'
                      }`}>
                        {idx + 1}
                      </div>

                      <div>
                        <span className="font-mono text-[9px] text-white/20 uppercase block tracking-wider mb-0.5">
                          Month {idx + 1} — {monthData.month || 'Target'}
                        </span>
                        <h4 className="text-sm font-semibold text-white leading-snug font-manrope">
                          {monthData.goal}
                        </h4>
                        <p className="text-[10px] text-[#ef233c]/50 font-mono mt-0.5">
                          Src: {monthData.resource}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* View Full Roadmap CTA - rounded glowing button */}
            <button
              onClick={() => window.open(roadmap.roadmapUrl, '_blank')}
              data-magnetic
              className="w-full mt-8 bg-[#ef233c] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest py-4 rounded-full hover:shadow-[0_0_30px_rgba(239,35,60,0.4)] transition-all duration-300"
            >
              View Full Roadmap →
            </button>
          </motion.div>

          {/* First Steps (Quiz Only) */}
          {firstSteps && firstSteps.length > 0 && (
            <motion.div
              {...cardTransition(8)}
              className="card-glow p-5 rounded-none"
            >
              <span className="font-mono text-xs text-white/30 uppercase tracking-widest block mb-4">
                👣 Your First Steps
              </span>
              <div className="space-y-4">
                {firstSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <span className="font-mono text-[10px] bg-[#ef233c]/10 border border-[#ef233c]/20 text-[#ef233c] w-5 h-5 rounded-none flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-white/70 text-xs leading-relaxed font-light">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share Results Card */}
          <motion.div
            {...cardTransition(9)}
            className="card-glow p-5 rounded-none"
          >
            <span className="font-mono text-xs text-white/30 uppercase tracking-widest block mb-3">
              Metadata Distribution
            </span>
            <button
              onClick={handleShare}
              className="w-full border border-white/10 text-white font-mono text-xs uppercase tracking-wider py-3 rounded-full hover:bg-white hover:text-black transition-colors duration-300"
            >
              📤 Export Career Card
            </button>

            {/* Hidden Offscreen Card for Image Rendering (Pure Black styling) */}
            <div
              ref={shareCardRef}
              className="w-[600px] h-[320px] bg-black rounded-none p-8 flex flex-col justify-between absolute pointer-events-none shadow-2xl border border-[#ef233c]/30 font-sans"
              style={{ position: 'fixed', left: '-9999px', top: 0 }}
            >
              <div className="flex justify-between items-start w-full">
                <div>
                  <div className="text-[#ef233c] font-mono text-[10px] tracking-[0.2em] mb-4 uppercase">
                    DEVLENS AI REPORT
                  </div>
                  <h3 className="text-2xl font-bold text-white font-sans tracking-tight">
                    {detectedRole}
                  </h3>
                  <div className="flex gap-2.5 mt-3">
                    {detectedSkills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#ef233c]/10 border border-[#ef233c]/20 text-[#ef233c] text-[9px] px-2.5 py-1 rounded-none font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/30 text-[9px] uppercase tracking-wider font-mono">
                    Career Readiness
                  </div>
                  <div className="text-5xl font-black text-[#ef233c] leading-none mt-1 font-mono">
                    {readinessScore}%
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-white/10 pt-6">
                <div>
                  <p className="text-[10px] text-white/40 max-w-sm leading-relaxed italic font-mono truncate">
                    "{marketInsight}"
                  </p>
                </div>
                <div className="text-[10px] font-mono text-white/20 tracking-wider">
                  devlens.ai
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

    </div>
  )
}
