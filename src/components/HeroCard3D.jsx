'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Text, Float, Environment } from '@react-three/drei'
import { useRef } from 'react'

function DeveloperCard() {
  const cardRef = useRef()
  const shimmerRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (cardRef.current) {
      cardRef.current.rotation.y = state.mouse.x * 0.28
      cardRef.current.rotation.x = -state.mouse.y * 0.14
    }
    if (shimmerRef.current) {
      // Rotating slightly slower for a beautiful parallax shimmer effect
      shimmerRef.current.rotation.y = state.mouse.x * 0.18 + Math.sin(t * 0.5) * 0.03
      shimmerRef.current.rotation.x = -state.mouse.y * 0.10 + Math.cos(t * 0.5) * 0.03
      
      if (shimmerRef.current.material) {
        // Smoothly cycle through red noir shades: red -> pink-red -> deep crimson
        const cycle = (t * 0.4) % 3
        if (cycle < 1) {
          shimmerRef.current.material.color.setHex(0xef233c) // Primary Red
        } else if (cycle < 2) {
          shimmerRef.current.material.color.setHex(0xff3366) // Neon Pink-Red
        } else {
          shimmerRef.current.material.color.setHex(0x7a0010) // Deep Crimson
        }
      }
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group>
        {/* Holographic Shimmer Pass Card (Slightly larger, slow-rotation outline shell) */}
        <RoundedBox ref={shimmerRef} args={[3.56, 2.26, 0.062]} radius={0.065} position={[0, 0, 0]}>
          <meshBasicMaterial color="#ef233c" transparent opacity={0.06} depthWrite={false} />
        </RoundedBox>

        {/* Card Main Body */}
        <RoundedBox ref={cardRef} args={[3.5, 2.2, 0.06]} radius={0.06} position={[0, 0, 0]}>
          <meshPhysicalMaterial 
            color="#080202" 
            roughness={0.05} 
            metalness={0.9} 
            reflectivity={0.8}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />

          {/* Top Strip (Glow Strip at top edge) */}
          <RoundedBox position={[0, 1.07, 0.032]} args={[3.5, 0.03, 0.005]} radius={0.001}>
            <meshBasicMaterial color="#ef233c" />
          </RoundedBox>

          {/* Header Row left: DEVLENS AI */}
          <Text
            position={[-1.4, 0.85, 0.032]}
            fontSize={0.095}
            color="#ef233c"
            fontWeight="bold"
            anchorX="left"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2oWgoq2xFkgK0T9F5UXoDy7szCdz.woff"
          >
            DEVLENS AI
          </Text>

          {/* Header Row right: DEV ID */}
          <Text
            position={[1.4, 0.85, 0.032]}
            fontSize={0.095}
            color="rgba(255,255,255,0.2)"
            anchorX="right"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2oWgoq2xFkgK0T9F5UXoDy7szCdz.woff"
          >
            DEV ID
          </Text>

          {/* Thin Divider Line */}
          <RoundedBox position={[0, 0.7, 0.032]} args={[3.1, 0.01, 0.001]} radius={0.001}>
            <meshBasicMaterial color="rgba(255,255,255,0.08)" />
          </RoundedBox>

          {/* Center: Large Role Text */}
          <Text
            position={[0, 0.22, 0.032]}
            fontSize={0.21}
            color="#ffffff"
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/spacegrotesk/v15/V8mQoQDjQSkFtoMM3T6r8E79F218tCoQ.woff"
          >
            Frontend Developer
          </Text>

          {/* Match Rate Text */}
          <Text
            position={[0, -0.06, 0.032]}
            fontSize={0.145}
            color="#ef233c"
            fontWeight="bold"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2oWgoq2xFkgK0T9F5UXoDy7szCdz.woff"
          >
            87% MATCH RATE
          </Text>

          {/* Progress Bar Track */}
          <RoundedBox position={[0, -0.28, 0.032]} args={[2.8, 0.035, 0.002]} radius={0.001}>
            <meshBasicMaterial color="rgba(255,255,255,0.06)" />
          </RoundedBox>

          {/* Progress Bar Fill (87%) */}
          <RoundedBox position={[-0.18, -0.28, 0.034]} args={[2.44, 0.035, 0.002]} radius={0.001}>
            <meshBasicMaterial color="#ef233c" />
          </RoundedBox>

          {/* Footer left: USER ID */}
          <Text
            position={[-1.4, -0.72, 0.032]}
            fontSize={0.085}
            color="rgba(255,255,255,0.4)"
            anchorX="left"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2oWgoq2xFkgK0T9F5UXoDy7szCdz.woff"
          >
            MEMBER: N-AVTEJ
          </Text>

          {/* Footer right: READINESS SCORE */}
          <Text
            position={[1.4, -0.72, 0.032]}
            fontSize={0.085}
            color="rgba(255,255,255,0.4)"
            anchorX="right"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2oWgoq2xFkgK0T9F5UXoDy7szCdz.woff"
          >
            SCORE: 78/100
          </Text>
        </RoundedBox>
      </group>
    </Float>
  )
}

export default function HeroCard3D() {
  return (
    <div className="w-full h-full relative" style={{ contain: 'paint' }}>
      <Canvas camera={{ position: [0, 0, 5.5], fov: 42 }}>
        <ambientLight intensity={0.15} />
        
        {/* Advanced rectAreaLights for glowing neon reflections */}
        <pointLight position={[3, 3, 3]} intensity={2.5} color="#ef233c" />
        <pointLight position={[-3, -1, 3]} intensity={1.8} color="#7a0010" />
        <pointLight position={[0, 0, 5]} intensity={0.3} color="#ffffff" />
        
        <DeveloperCard />
        <Environment preset="warehouse" />
      </Canvas>
    </div>
  )
}
