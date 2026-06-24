'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ScanSequence({ scanMessages, scanStep, isLoading }) {
  const [time, setTime] = useState('')

  // Live hacker system clock
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit', 
          hour12: false 
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  if (!isLoading) return null

  const total = scanMessages.length
  const progressPercent = Math.min(100, Math.round((scanStep / total) * 100))

  return (
    <div className="fixed inset-0 bg-black z-[999] flex flex-col justify-between font-mono">
      
      {/* Top Ticker Status Bar */}
      <div className="w-full border-b border-[#ef233c]/20 bg-black px-8 py-4 flex justify-between items-center select-none">
        <span className="text-[#ef233c] text-xs font-bold tracking-[0.25em] uppercase">
          DEVLENS AI
        </span>
        <div className="flex items-center gap-2 text-white/50 text-xs">
          <span className="text-[#ef233c] animate-pulse">●</span>
          <span>ANALYZING PROFILE</span>
          <span className="animate-[blink_1s_infinite]">_</span>
        </div>
        <span className="text-white/20 text-xs font-mono tracking-wider">
          SYS_TIME: {time}
        </span>
      </div>

      {/* Main Terminal Window */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ willChange: 'transform' }}
          className="bg-[#050505] border border-[#ef233c]/20 w-full max-w-2xl shadow-[0_0_60px_rgba(239,35,60,0.06)] rounded-none"
        >
          {/* Terminal Window Header */}
          <div className="bg-[#0a0a0a] border-b border-[#ef233c]/10 px-6 py-3.5 flex items-center justify-between">
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff3366]/60 border border-[#ff3366]/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff9f1c]/60 border border-[#ff9f1c]/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef233c]/60 border border-[#ef233c]/20" />
            </div>
            <span className="text-white/30 text-xs tracking-wide">
              devlens — career-analysis.log
            </span>
            <div className="w-8" />
          </div>

          {/* Terminal Window Body */}
          <div className="px-6 py-8 min-h-[220px] flex flex-col justify-start">
            <AnimatePresence>
              {scanMessages.map((message, index) => {
                const isCompleted = index < scanStep
                const isActive = index === scanStep
                
                if (isCompleted) {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 mb-3.5 opacity-60 text-xs text-white/50"
                    >
                      <span className="text-[#ef233c] font-bold">✓</span>
                      <span>{message}</span>
                      <span className="ml-auto text-white/20 uppercase tracking-widest text-[9px] border border-white/5 px-1.5 py-0.5 bg-white/[0.01]">
                        done
                      </span>
                    </motion.div>
                  )
                }
                
                if (isActive) {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 mb-3.5 text-xs text-white"
                    >
                      <span className="text-[#ff9f1c] animate-[blink_0.8s_infinite] font-bold">▶</span>
                      <span className="font-semibold">{message}</span>
                      <span className="ml-auto text-[#ff9f1c] animate-pulse uppercase tracking-wider text-[9px]">
                        processing...
                      </span>
                    </motion.div>
                  )
                }
                
                return (
                  <div key={index} className="flex items-center gap-3 mb-3.5 opacity-15 text-xs text-white/25">
                    <span>○</span>
                    <span>{message}</span>
                  </div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* Sub-pixel Glowing Progress Section */}
          <div className="border-t border-[#ef233c]/10 px-6 py-6 bg-black/40">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/30 uppercase tracking-widest text-[10px]">Analysis Progress</span>
              <span className="text-[#ef233c] font-bold">{progressPercent}%</span>
            </div>
            <div className="h-px bg-white/5 w-full relative overflow-hidden">
              <div 
                className="h-px bg-[#ef233c] transition-all duration-1000 ease-out"
                style={{ 
                  width: `${progressPercent}%`,
                  boxShadow: '0 0 10px rgba(239,35,60,0.8)'
                }} 
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Metadata Bar */}
      <div className="w-full border-t border-white/5 bg-black px-8 py-4 flex justify-between items-center select-none text-[10px] text-white/20 tracking-wider">
        <span>POWERED BY GEMINI 1.5 FLASH API</span>
        <span>DEVLENS AI CORE V1.0</span>
      </div>

    </div>
  )
}
