'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScanSequence from './ScanSequence'

export default function GitHubFlow({ analysis, onComplete, onBack }) {
  const [username, setUsername] = useState('')
  const { loading, error, result, scanStep, scanMessages, loadingPhase, analyze } = analysis

  // Proactively complete flow when result becomes available
  useEffect(() => {
    if (result) {
      onComplete(result)
    }
  }, [result, onComplete])

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (username.trim()) {
      analyze(username.trim())
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* Background radial red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ef233c]/5 blur-[120px] w-[500px] h-[500px] rounded-full pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-white/55 hover:text-white flex items-center gap-2 font-mono text-sm transition-all"
      >
        <span>←</span> BACK TO PATHS
      </button>

      {/* Terminal Loading Screen - Active only during the github scanning phase */}
      <ScanSequence scanMessages={scanMessages} scanStep={scanStep} isLoading={loading && loadingPhase === 'github'} />

      {/* Flow Main Content */}
      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ willChange: 'transform' }}
            className="w-full max-w-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-10 relative shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-mono uppercase tracking-[0.2em] px-3 py-1 border border-[#ef233c]/30 rounded-full text-[#ef233c] bg-[#ef233c]/5 mb-6">
                ⚡ GitHub Analysis
              </span>
              <h2 className="text-3xl font-bold font-manrope text-white mb-3">
                Enter your GitHub username
              </h2>
              <p className="text-white/60 text-sm mb-8 max-w-sm font-light">
                We'll scan every public repository, analyze your languages, activity, and commit history to compile your career report.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ef233c] font-mono text-lg">
                  @
                </span>
                <input
                  type="text"
                  placeholder="e.g. N-AVTEJ"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-xl py-4 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:border-[#ef233c] font-mono text-base transition-all"
                  autoFocus
                />
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="border-l-2 border-red-500 bg-red-500/10 p-4 rounded-r-xl"
                  >
                    <p className="text-red-400 text-xs font-mono leading-relaxed">
                      {error === 'USER_NOT_FOUND' 
                        ? '✗ Error: GitHub user not found. Check the spelling and try again.'
                        : error === 'NO_REPOS'
                        ? '✗ Error: This user has no public repositories to analyze.'
                        : `✗ Error: ${error}`}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={!username.trim()}
                className="w-full bg-[#ef233c] hover:bg-red-700 disabled:bg-white/5 disabled:text-white/20 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-full shadow-lg hover:shadow-red-500/20 active:scale-[0.98] transition-all"
              >
                Analyse My GitHub →
              </button>
            </form>

            {/* Clickable Quick Chips */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <span className="text-[11px] font-mono text-white/30 block mb-3 text-center uppercase tracking-wider">
                Select an example profile to test:
              </span>
              <div className="flex flex-wrap justify-center gap-2.5">
                {['torvalds', 'gaearon', 'N-AVTEJ'].map((user) => (
                  <button
                    key={user}
                    onClick={() => setUsername(user)}
                    className="bg-white/5 hover:bg-[#ef233c]/10 border border-white/10 hover:border-[#ef233c]/30 text-white/50 hover:text-[#ef233c] text-xs px-3 py-1 rounded-full font-mono transition-all"
                  >
                    Try: {user}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
