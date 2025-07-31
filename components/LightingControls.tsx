'use client'

import React from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface LightingControlsProps {
  ambientIntensity: number
  directionalIntensity: number
  pointLight1Intensity: number
  pointLight2Intensity: number
  pointLight3Intensity: number
  pointLight4Intensity: number
  rimLightIntensity: number
}

export default function LightingControls({
  ambientIntensity,
  directionalIntensity,
  pointLight1Intensity,
  pointLight2Intensity,
  pointLight3Intensity,
  pointLight4Intensity,
  rimLightIntensity
}: LightingControlsProps) {
  const { scene } = useThree()

  // Update lighting when props change
  React.useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Light) {
        if (child.name === 'ambient') {
          child.intensity = ambientIntensity
        } else if (child.name === 'directional') {
          child.intensity = directionalIntensity
        } else if (child.name === 'point1') {
          child.intensity = pointLight1Intensity
        } else if (child.name === 'point2') {
          child.intensity = pointLight2Intensity
        } else if (child.name === 'point3') {
          child.intensity = pointLight3Intensity
        } else if (child.name === 'point4') {
          child.intensity = pointLight4Intensity
        } else if (child.name === 'rim') {
          child.intensity = rimLightIntensity
        }
      }
    })
  }, [scene, ambientIntensity, directionalIntensity, pointLight1Intensity, pointLight2Intensity, pointLight3Intensity, pointLight4Intensity, rimLightIntensity])

  return (
    <>
      {/* Ambient Light - Overall scene illumination */}
      <ambientLight 
        name="ambient"
        intensity={ambientIntensity} 
      />
      
      {/* Main Directional Light - Primary light source */}
      <directionalLight 
        name="directional"
        position={[10, 10, 5]} 
        intensity={directionalIntensity}
        castShadow
      />
      
      {/* Point Light 1 - Blue accent light */}
      <pointLight 
        name="point1"
        position={[-5, 5, 5]} 
        intensity={pointLight1Intensity} 
        color="#4a90e2"
        distance={20}
      />
      
      {/* Point Light 2 - Red accent light */}
      <pointLight 
        name="point2"
        position={[5, -5, -5]} 
        intensity={pointLight2Intensity} 
        color="#e24a4a"
        distance={20}
      />
      
      {/* Point Light 3 - Green accent light (back lighting) */}
      <pointLight 
        name="point3"
        position={[0, 0, -8]} 
        intensity={pointLight3Intensity} 
        color="#4ae24a"
        distance={15}
      />
      
      {/* Point Light 4 - White fill light */}
      <pointLight 
        name="point4"
        position={[0, 8, 0]} 
        intensity={pointLight4Intensity} 
        color="#ffffff"
        distance={12}
      />
      
      {/* Rim Light - Back lighting for better definition */}
      <directionalLight 
        name="rim"
        position={[0, 0, -10]} 
        intensity={rimLightIntensity}
        color="#ffffff"
      />
    </>
  )
} 