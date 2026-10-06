'use client'

import dynamic from 'next/dynamic'
import SmoothScroll from './SmoothScroll'

// Lazy-load Three.js 3D Globe and custom GlowCursor so they hydrate after critical content
const BackgroundGlobe3D = dynamic(() => import('./BackgroundGlobe3D'), {
  ssr: false,
  loading: () => null,
})

const GlowCursor = dynamic(() => import('./GlowCursor'), {
  ssr: false,
  loading: () => null,
})

export default function ClientVisuals() {
  return (
    <>
      <SmoothScroll />
      {/* Global 3D Globe — fixed behind all pages, moves on scroll */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-40" aria-hidden="true" role="presentation">
        <BackgroundGlobe3D />
      </div>
      <GlowCursor />
    </>
  )
}
