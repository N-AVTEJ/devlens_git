'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function GlowCursor() {
  const [cursorVariant, setCursorVariant] = useState('default') // 'default' | 'hover' | 'click' | 'text'
  const [ripples, setRipples] = useState([])
  const [sparks, setSparks] = useState([])
  const [isMobile, setIsMobile] = useState(true)

  // Cursor coordinates
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  // LAYER 1 (Outer Ring): Stiffness=150, Damping=15 (slow, laggy follow)
  const springX = useSpring(cursorX, { stiffness: 150, damping: 15 })
  const springY = useSpring(cursorY, { stiffness: 150, damping: 15 })

  // LAYER 3 (Ambient Glow Aura): Stiffness=65, Damping=18 (extremely laggy trailing trail!)
  const auraX = useSpring(cursorX, { stiffness: 65, damping: 18 })
  const auraY = useSpring(cursorY, { stiffness: 65, damping: 18 })

  // MAGNETIC GRAVITATIONAL PULL WARP OFFSET
  const cursorPullX = useMotionValue(0)
  const cursorPullY = useMotionValue(0)
  const springPullX = useSpring(cursorPullX, { stiffness: 220, damping: 18 })
  const springPullY = useSpring(cursorPullY, { stiffness: 220, damping: 18 })

  // VELOCITY & ROTATION FOR PHYSICAL LIQUID STRETCHING
  const lastXRef = useRef(0)
  const lastYRef = useRef(0)
  const lastTimeRef = useRef(0)

  const speedValue = useMotionValue(0)
  const speedSpring = useSpring(speedValue, { stiffness: 85, damping: 18 })
  const angleValue = useMotionValue(0)
  const angleSpring = useSpring(angleValue, { stiffness: 120, damping: 20 })

  // Speed maps to stretch scaling along X and Y axes
  const scaleX = useTransform(speedSpring, [0, 6], [1, 2.3])
  const scaleY = useTransform(speedSpring, [0, 6], [1, 0.5])

  useEffect(() => {
    // Hide on mobile / touch devices
    const mobileCheck = window.matchMedia('(hover: none)').matches
    setIsMobile(mobileCheck)
  }, [])

  useEffect(() => {
    if (isMobile) return

    // Track mouse coordinates, velocity, and calculate magnetic vector pulls
    const handleMove = (e) => {
      const currentX = e.clientX
      const currentY = e.clientY
      
      cursorX.set(currentX)
      cursorY.set(currentY)

      const now = performance.now()
      const dt = now - lastTimeRef.current
      
      if (dt > 10) {
        const dx = currentX - lastXRef.current
        const dy = currentY - lastYRef.current
        const speed = Math.min(Math.hypot(dx, dy) / dt, 6) // Cap speed scaling at 6px/ms
        
        if (speed > 0.05) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI)
          
          // Shortest path angle solver (prevents 360 degree spin jump glitch)
          const prevAngle = angleValue.get()
          let diff = angle - prevAngle
          while (diff < -180) diff += 360
          while (diff > 180) diff -= 360
          angleValue.set(prevAngle + diff)
          
          speedValue.set(speed)
        } else {
          speedValue.set(0)
        }
        
        lastXRef.current = currentX
        lastYRef.current = currentY
        lastTimeRef.current = now
      }

      // Cursor-level Magnetic Pull Attraction & Gravitational Warp (within 90px)
      let pullX = 0
      let pullY = 0
      let minDistance = Infinity

      const magneticElements = document.querySelectorAll('[data-magnetic]')
      magneticElements.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        
        const distance = Math.hypot(currentX - centerX, currentY - centerY)
        
        if (distance < 90) {
          const dx = currentX - centerX
          const dy = currentY - centerY
          // Pull target element by 30% of vector offset distance
          el.style.transition = 'transform 0.1s ease-out'
          el.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px)`
          
          if (distance < minDistance) {
            minDistance = distance
            // Set pull displacement vector (pull outer ring towards element center)
            pullX = -dx * 0.35
            pullY = -dy * 0.35
          }
        } else {
          // Smooth spring back to standard coordinates
          el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          el.style.transform = 'translate(0px, 0px)'
        }
      })

      cursorPullX.set(pullX)
      cursorPullY.set(pullY)
    }

    // Dynamic HMR-friendly hover event delegation
    const handleMouseOver = (e) => {
      const hoverTarget = e.target.closest('button, a, [data-magnetic]')
      if (hoverTarget) {
        setCursorVariant('hover')
        return
      }

      const textTarget = e.target.closest('p, h1, h2, h3, span, li, code, pre, input, textarea')
      if (textTarget) {
        setCursorVariant('text')
        return
      }

      setCursorVariant('default')
    }

    const spawnRipple = (e) => {
      const id = Date.now()
      const newRipple1 = { id: `${id}-1`, x: e.clientX, y: e.clientY, scale: 65, duration: 0.5 }
      const newRipple2 = { id: `${id}-2`, x: e.clientX, y: e.clientY, scale: 100, duration: 0.7 }
      setRipples((prev) => [...prev, newRipple1, newRipple2])
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== `${id}-1` && r.id !== `${id}-2`))
      }, 800)
    }

    const handleMouseDown = (e) => {
      setCursorVariant('click')
      spawnRipple(e)

      // Spawn cinematic digital impact sparks
      const count = 10
      const newSparks = Array.from({ length: count }).map((_, i) => {
        const angle = (i * (360 / count) + Math.random() * 25) * (Math.PI / 180)
        const velocity = 3.5 + Math.random() * 5
        return {
          id: `${Date.now()}-${i}-${Math.random()}`,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(angle) * velocity,
          dy: Math.sin(angle) * velocity,
          size: 2.5 + Math.random() * 4
        }
      })
      setSparks((prev) => [...prev, ...newSparks])

      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => !newSparks.find((ns) => ns.id === s.id)))
      }, 700)
    }

    const handleMouseUp = () => {
      setCursorVariant('default')
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseover', handleMouseOver)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseover', handleMouseOver)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isMobile, cursorX, cursorY, cursorPullX, cursorPullY, speedValue, angleValue])

  // Hide completely on mobile screens
  if (isMobile) return null

  // Motion variants configuration
  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      borderWidth: '1px'
    },
    hover: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      borderWidth: '2px',
      transition: { type: 'spring', stiffness: 300, damping: 18 }
    },
    click: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      borderWidth: '1.5px',
      transition: { duration: 0.1 }
    },
    text: {
      width: 14,
      height: 24,
      borderRadius: '2px',
      borderWidth: '1px',
      transition: { type: 'spring', stiffness: 250, damping: 15 }
    }
  }

  const dotVariants = {
    default: { 
      scale: [1, 1.35, 1],
      transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
    },
    hover: { 
      scale: 0, 
      transition: { type: 'spring', stiffness: 350, damping: 20 } 
    },
    click: { 
      scale: 1.8,
      transition: { duration: 0.1 }
    },
    text: { 
      scale: 0,
      transition: { duration: 0.1 }
    }
  }

  const auraVariants = {
    default: {
      width: 56,
      height: 56,
      opacity: 0.22,
      scale: 1
    },
    hover: {
      width: 90,
      height: 90,
      opacity: 0.35,
      scale: 1.3,
      transition: { type: 'spring', stiffness: 250, damping: 20 }
    },
    click: {
      width: 40,
      height: 40,
      opacity: 0.18,
      scale: 0.8,
      transition: { duration: 0.15 }
    },
    text: {
      width: 0,
      height: 0,
      opacity: 0,
      scale: 0,
      transition: { duration: 0.2 }
    }
  }

  return (
    <>
      {/* LAYER 3 — Ambient Glow Aura (trailing, color-shifting, high blur) */}
      <motion.div
        variants={auraVariants}
        animate={cursorVariant}
        className="fixed pointer-events-none z-[9998] rounded-full translate-x-[-50%] translate-y-[-50%] glow-cursor-shift"
        style={{
          x: auraX,
          y: auraY,
          filter: 'blur(20px)'
        }}
      />

      {/* LAYER 1 — Outer ring (lag position spring & local physics warp) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: springX,
          y: springY,
          xPercent: -50,
          yPercent: -50
        }}
      >
        <motion.div
          variants={ringVariants}
          animate={cursorVariant}
          className="glow-ring-shift flex items-center justify-center border rounded-full relative"
          style={{
            x: springPullX,
            y: springPullY,
            scaleX: cursorVariant === 'default' ? scaleX : 1,
            scaleY: cursorVariant === 'default' ? scaleY : 1,
            rotate: cursorVariant === 'default' ? angleSpring : 0,
            mixBlendMode: 'screen',
            transformOrigin: 'center center'
          }}
        >
          {/* High-tech HUD rotating dash markings (default & hover states) */}
          {(cursorVariant === 'default' || cursorVariant === 'hover') && (
            <div 
              className="absolute inset-[-5px] rounded-full border border-dashed opacity-45 animate-spin" 
              style={{ 
                animationDuration: cursorVariant === 'hover' ? '3s' : '8s',
                borderColor: 'inherit'
              }} 
            />
          )}

          {/* Retro terminal text insertion brackets (text state) */}
          {cursorVariant === 'text' && (
            <div className="absolute inset-0 flex flex-col justify-between items-center py-1 opacity-90 text-[#ef233c] font-mono select-none pointer-events-none">
              <span className="text-[7px] leading-none select-none">▼</span>
              <span className="text-[7px] leading-none select-none">▲</span>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* LAYER 2 — Inner dot (follows instantly, pulsating scale, color-shifting) */}
      <motion.div
        variants={dotVariants}
        animate={cursorVariant}
        className="fixed pointer-events-none z-[9999] rounded-full translate-x-[-50%] translate-y-[-50%] glow-cursor-shift"
        style={{
          x: cursorX,
          y: cursorY,
          width: 6,
          height: 6
        }}
      />

      {/* CLICK DOUBLE RIPPLE EFFECT */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: ripple.scale, height: ripple.scale, opacity: 0 }}
          transition={{ duration: ripple.duration, ease: 'easeOut' }}
          className="fixed pointer-events-none z-[9999] rounded-full border border-[#ef233c]/60 translate-x-[-50%] translate-y-[-50%]"
          style={{
            left: ripple.x,
            top: ripple.y
          }}
        />
      ))}

      {/* CLICK IMPACT SPARKS */}
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          initial={{ 
            x: spark.x, 
            y: spark.y, 
            scale: 1, 
            opacity: 1 
          }}
          animate={{ 
            x: spark.x + spark.dx * 16, 
            y: spark.y + spark.dy * 16, 
            scale: 0,
            opacity: 0 
          }}
          transition={{ 
            duration: 0.65, 
            ease: [0.1, 0.8, 0.3, 1] 
          }}
          className="fixed pointer-events-none z-[9999] rounded-full glow-cursor-shift"
          style={{
            width: spark.size,
            height: spark.size,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </>
  )
}
