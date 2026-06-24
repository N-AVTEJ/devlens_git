'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import CareerQuiz from '../../components/CareerQuiz'
import GitHubFlow from '../../components/GitHubFlow'
import Dashboard from '../../components/Dashboard'
import SkeletonDashboard from '../../components/SkeletonDashboard'
import useGitHubAnalysis from '../../hooks/useGitHubAnalysis'
import useQuizAnalysis from '../../hooks/useQuizAnalysis'

function AnalyzeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const githubAnalysis = useGitHubAnalysis()
  const quizAnalysis = useQuizAnalysis()

  const [path, setPath] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [result, setResult] = useState(null)

  // Automatically read query path parameter on mount
  useEffect(() => {
    const urlPath = searchParams.get('path')
    if (urlPath === 'github' || urlPath === 'quiz') {
      setPath(urlPath)
      setSelectedCard(urlPath)
    }
  }, [searchParams])

  const selectPath = (selectedPath) => {
    setPath(selectedPath)
    setSelectedCard(selectedPath)
    // Synchronize query parameters for better navigation support
    router.push(`/analyze?path=${selectedPath}`)
  }

  const goBack = () => {
    setPath(null)
    setSelectedCard(null)
    setResult(null)
    router.push('/analyze')
  }

  // Determine active loading phase
  const activeAnalysis = path === 'github' ? githubAnalysis : quizAnalysis
  const loadingPhase = activeAnalysis ? activeAnalysis.loadingPhase : 'done'

  return (
    <div className="min-h-screen text-white flex items-center justify-center py-20 px-6 relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 bg-[#ef233c]/5 blur-[150px] w-[600px] h-[600px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 bg-[#ff3366]/5 blur-[150px] w-[600px] h-[600px] rounded-full pointer-events-none" />

      <AnimatePresence mode="wait">
        {loadingPhase === 'ai' ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            style={{ willChange: 'transform' }}
            className="w-full"
          >
            <SkeletonDashboard />
          </motion.div>
        ) : result ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            style={{ willChange: 'transform' }}
            className="w-full"
          >
            <Dashboard data={result} />
          </motion.div>
        ) : path === null ? (
          <motion.div
            key="path-selection"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            style={{ willChange: 'transform' }}
            className="w-full max-w-6xl flex flex-col items-center relative z-10"
          >
            <div className="text-center mb-8">
              <span className="font-mono text-[#ef233c] text-xs uppercase tracking-[0.25em] mb-4 block">
                Select Your Path
              </span>
              <h1 className="text-5xl md:text-6xl font-black font-manrope tracking-tight text-white leading-none">
                How do you want to start?
              </h1>
            </div>

            {/* Asymmetric 50/50 Panel Split touching with border */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10 w-full mt-16 overflow-hidden rounded-none">
              
              {/* GitHub Path Card */}
              <motion.div
                layoutId="github-card"
                onClick={() => { setSelectedCard('github'); selectPath('github') }}
                data-magnetic
                className="path-select-card cursor-pointer p-12 md:p-16 bg-black hover:bg-[#ef233c]/[0.03] transition-colors duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[50vh]"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                style={{ willChange: 'transform' }}
              >
                {/* Massive Decorative Background Identifier */}
                <div className="absolute bottom-4 right-4 text-[180px] md:text-[230px] font-black text-[#ef233c]/[0.03] leading-none select-none font-mono">
                  01
                </div>

                <div className="relative z-10">
                  <span className="font-mono text-[#ef233c] text-xs uppercase tracking-widest mb-6 block">
                    GitHub Analysis
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black font-manrope text-white mb-6 leading-none">
                    Analyse My<br />GitHub
                  </h3>
                  <div className="space-y-3 mb-8">
                    {[
                      'Analyse all public repositories',
                      'Detect languages and skill levels',
                      'Get internship readiness score',
                      'AI recruiter feedback on your profile'
                    ].map((bullet, index) => (
                      <div key={index} className="flex items-center gap-2.5 text-sm text-white/40 font-mono">
                        <span className="text-[#ef233c] font-bold">→</span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-4 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#ef233c] relative">
                    Start Analysis →
                    <span className="absolute left-0 bottom-[-4px] w-0 h-px bg-[#ef233c] group-hover:w-full transition-all duration-300" />
                  </span>
                </div>
              </motion.div>

              {/* Career Quiz Path Card */}
              <motion.div
                layoutId="quiz-card"
                onClick={() => { setSelectedCard('quiz'); selectPath('quiz') }}
                data-magnetic
                className="path-select-card cursor-pointer p-12 md:p-16 bg-black hover:bg-[#ff3366]/[0.03] transition-colors duration-300 relative overflow-hidden group flex flex-col justify-between min-h-[50vh]"
                whileHover={{ x: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                style={{ willChange: 'transform' }}
              >
                {/* Massive Decorative Background Identifier */}
                <div className="absolute bottom-4 right-4 text-[180px] md:text-[230px] font-black text-[#ff3366]/[0.03] leading-none select-none font-mono">
                  02
                </div>

                <div className="relative z-10">
                  <span className="font-mono text-[#ff3366] text-xs uppercase tracking-widest mb-6 block">
                    Beginner Path
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black font-manrope text-white mb-6 leading-none">
                    I'm New<br />to Tech
                  </h3>
                  <div className="space-y-3 mb-8">
                    {[
                      '8-question career interest quiz',
                      'Personality-based role matching',
                      'Beginner-friendly roadmap',
                      'First steps you can take today'
                    ].map((bullet, index) => (
                      <div key={index} className="flex items-center gap-2.5 text-sm text-white/40 font-mono">
                        <span className="text-[#ff3366] font-bold">→</span>
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 pt-4 flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-widest text-[#ff3366] relative">
                    Take the Quiz →
                    <span className="absolute left-0 bottom-[-4px] w-0 h-px bg-[#ff3366] group-hover:w-full transition-all duration-300" />
                  </span>
                </div>
              </motion.div>

            </div>
          </motion.div>
        ) : path === 'github' ? (
          <motion.div
            key="github-flow"
            layoutId="github-card"
            className="w-full"
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            style={{ willChange: 'transform' }}
          >
            <GitHubFlow analysis={githubAnalysis} onComplete={setResult} onBack={goBack} />
          </motion.div>
        ) : (
          <motion.div
            key="quiz-flow"
            layoutId="quiz-card"
            className="w-full"
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            style={{ willChange: 'transform' }}
          >
            <CareerQuiz analysis={quizAnalysis} onComplete={setResult} onBack={goBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center font-mono text-[#ef233c]">
        <div className="animate-pulse tracking-widest">LOADING DEVLENS SYSTEMCORE...</div>
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  )
}
