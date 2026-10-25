import { useEffect, useRef } from 'react'

export default function useMagneticHover(strength = 0.3) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let rect = null

    const handleMouseEnter = () => {
      rect = el.getBoundingClientRect()
    }

    const handleMouseMove = (e) => {
      if (!rect) {
        rect = el.getBoundingClientRect()
      }
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      // Use CSS translate property to avoid colliding with Framer Motion or GSAP transform
      el.style.translate = `${deltaX}px ${deltaY}px`
      el.style.transition = 'translate 0.15s ease'
    }

    const handleMouseLeave = () => {
      rect = null
      el.style.translate = '0px 0px'
      el.style.transition = 'translate 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }

    const handleReset = () => {
      rect = null
    }

    el.addEventListener('mouseenter', handleMouseEnter)
    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleReset, { passive: true })
    window.addEventListener('resize', handleReset, { passive: true })

    return () => {
      el.removeEventListener('mouseenter', handleMouseEnter)
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleReset)
      window.removeEventListener('resize', handleReset)
      el.style.translate = ''
      el.style.transition = ''
    }
  }, [strength])

  return ref
}
