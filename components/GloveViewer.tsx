'use client'

import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface GloveViewerProps {
  modelPath: string
}

function GloveModel({ modelPath }: { modelPath: string }) {
  const { scene } = useGLTF(modelPath)

  React.useEffect(() => {
    // Ensure the model is properly scaled and positioned
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <primitive 
      object={scene} 
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
    />
  )
}

export default function GloveViewer({ modelPath }: GloveViewerProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-5, 5, 5]} intensity={0.4} color="#4a90e2" />
        <pointLight position={[5, -5, -5]} intensity={0.3} color="#e24a4a" />

        <Suspense fallback={null}>
          <GloveModel modelPath={modelPath} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
        />
      </Canvas>
    </div>
  )
} 