'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll <= 0) {
        setProgress(0)
        return
      }
      const currentScroll = window.scrollY
      setProgress((currentScroll / totalScroll) * 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none bg-transparent"
      aria-hidden="true"
    >
      <div 
        className="h-full bg-gradient-to-r from-[#ef233c] via-[#ff3366] to-[#ef233c] shadow-[0_0_10px_#ef233c] transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
