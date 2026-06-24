'use client'

import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GlobeMesh() {
  const groupRef = useRef()
  const scrollRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    // Set passive scroll listener for optimal scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      // Steady background rotation combined with scroll-induced velocity rotation
      groupRef.current.rotation.y = t * 0.05 + scrollRef.current * 0.0016
      groupRef.current.rotation.x = t * 0.02 + scrollRef.current * 0.0006
      
      // Interpolate position based on scroll to translate the globe vertically
      groupRef.current.position.y = 0.5 - scrollRef.current * 0.0032
      // Slide left slightly as we scroll down to follow the bento layout
      groupRef.current.position.x = 0.8 - scrollRef.current * 0.0006
    }
  })

  // Create geometry once for points and wireframe to save GPU memory
  const sphereGeometry = new THREE.SphereGeometry(2.1, 32, 32)
  const ringGeometry1 = new THREE.TorusGeometry(2.5, 0.006, 8, 64)
  const ringGeometry2 = new THREE.TorusGeometry(2.8, 0.004, 8, 64)

  return (
    <group ref={groupRef} position={[0.8, 0.5, 0]}>
      {/* 1. Point Cloud Layer (Glowing red nodes) */}
      <points geometry={sphereGeometry}>
        <pointsMaterial 
          color="#ef233c" 
          size={0.042} 
          sizeAttenuation={true} 
          transparent 
          opacity={0.42} 
          depthWrite={false}
        />
      </points>

      {/* 2. Grid Wireframe Layer */}
      <mesh geometry={sphereGeometry}>
        <meshBasicMaterial 
          color="#ef233c" 
          wireframe 
          transparent 
          opacity={0.065} 
          depthWrite={false}
        />
      </mesh>

      {/* 3. Orbiting Data Stream Ring 1 */}
      <mesh geometry={ringGeometry1} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <meshBasicMaterial color="#ff3366" transparent opacity={0.15} depthWrite={false} />
      </mesh>

      {/* 4. Orbiting Data Stream Ring 2 */}
      <mesh geometry={ringGeometry2} rotation={[-Math.PI / 3, -Math.PI / 5, t => t * 0.1]}>
        <meshBasicMaterial color="#ef233c" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function BackgroundGlobe3D() {
  return (
    <div className="w-full h-full relative" style={{ contain: 'paint', pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        events={() => ({})}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#ef233c" />
        <GlobeMesh />
      </Canvas>
    </div>
  )
}
