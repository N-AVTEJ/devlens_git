'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { quizQuestions } from '../data/quizQuestions'
import ScanSequence from './ScanSequence'

export default function CareerQuiz({ analysis, onComplete, onBack }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selected, setSelected] = useState(null)

  const { loading, error, result, scanStep, scanMessages, loadingPhase, submit } = analysis

  // Proactively complete flow when result becomes available
  useEffect(() => {
    if (result) {
      onComplete(result)
    }
  }, [result, onComplete])

  const handleNext = () => {
    if (!selected) return

    const currentQuestion = quizQuestions[current]
    const newAnswers = [
      ...answers,
      {
        question: currentQuestion.question,
        selectedOption: selected.text,
        careers: selected.careers
      }
    ]

    setAnswers(newAnswers)

    if (current < quizQuestions.length - 1) {
      setCurrent(current + 1)
      setSelected(null)
    } else {
      submit(newAnswers)
    }
  }

  const progressPercentage = (current / quizQuestions.length) * 100
  const activeQuestion = quizQuestions[current]

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-12 px-4 relative">
      {/* Background radial neon pink-red glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ff3366]/5 blur-[120px] w-[500px] h-[500px] rounded-full pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 text-white/55 hover:text-white flex items-center gap-2 font-mono text-sm transition-all"
      >
        <span>←</span> BACK TO PATHS
      </button>

      {/* Scan screen overlay when loading - Active only during the github scanning phase */}
      <ScanSequence scanMessages={scanMessages} scanStep={scanStep} isLoading={loading && loadingPhase === 'github'} />

      <AnimatePresence mode="wait">
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{ willChange: 'transform' }}
            className="w-full max-w-2xl bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Top progress bar */}
            <div>
              <div className="bg-white/10 rounded-full h-1.5 w-full overflow-hidden">
                <motion.div
                  className="bg-[#ef233c] h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                />
              </div>
              <div className="text-white/40 text-xs text-right mt-2 font-mono">
                Question {current + 1} of {quizQuestions.length}
              </div>
            </div>

            {/* Question Card Content */}
            <div className="mt-8">
              {/* Question Count Badge */}
              <div className="text-[#ef233c] font-mono text-sm mb-4">
                0{current + 1} / 0{quizQuestions.length}
              </div>

              {/* Question Text */}
              <AnimatePresence mode="wait">
                <motion.h3
                  key={current}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  style={{ willChange: 'transform' }}
                  className="text-2xl font-semibold font-manrope text-white mb-8 leading-snug"
                >
                  {activeQuestion.question}
                </motion.h3>
              </AnimatePresence>

              {/* Selection Options */}
              <div className="space-y-3.5">
                {activeQuestion.options.map((option, idx) => {
                  const isSelected = selected === option
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelected(option)}
                      className={`w-full text-left px-6 py-4 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-[#ef233c] bg-[#ef233c]/10 text-white'
                          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      {option.text}
                    </motion.button>
                  )
                })}
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button
                  onClick={handleNext}
                  disabled={!selected}
                  className={`w-full py-4 rounded-full font-semibold transition-all active:scale-[0.98] shadow-lg ${
                    selected
                      ? 'bg-[#ef233c] hover:bg-red-700 text-white shadow-red-500/10 hover:shadow-red-500/20'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {current === quizQuestions.length - 1 ? 'Get My Career Matches →' : 'Next Question →'}
                </button>
              </div>

              {/* Error banner if exists */}
              {error && (
                <div className="text-red-400 text-sm mt-4 text-center font-mono">
                  {error}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
