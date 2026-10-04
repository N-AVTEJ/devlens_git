'use client'

import React from 'react'

export default function BackButton({ onClick, label = 'BACK', className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className={`fixed top-6 left-6 z-50 group flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/10 hover:border-[#ef233c]/40 text-white/70 hover:text-white font-mono text-xs uppercase tracking-widest transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef233c] cursor-pointer shadow-lg active:scale-95 ${className}`}
    >
      <span className="transition-transform duration-300 group-hover:-translate-x-1 text-[#ef233c] font-bold" aria-hidden="true">
        ←
      </span>
      <span>{label}</span>
    </button>
  )
}
