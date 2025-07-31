'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

interface ScreenshotButtonInCanvasProps {
  weaponType: string
  skin: string
  float: number
  background: string
  fov: number
  className?: string
}

export default function ScreenshotButtonInCanvas({ 
  weaponType, 
  skin, 
  float, 
  background, 
  fov,
  className = ''
}: ScreenshotButtonInCanvasProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const { gl, scene, camera } = useThree()
  const captureRef = useRef(false)

  // Set up global trigger function
  useEffect(() => {
    window.triggerScreenshot = () => {
      captureRef.current = true
    }
    
    return () => {
      window.triggerScreenshot = undefined
    }
  }, [])

  // Listen for capture requests
  useFrame(() => {
    if (captureRef.current) {
      // Force a render
      gl.render(scene, camera)
      
      // Get the canvas data
      const canvas = gl.domElement
      
      // Create a temporary canvas to combine background and 3D content
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      
      if (tempCtx) {
        // Set the same dimensions as the original canvas
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        
        // Create the background based on the background prop
        if (background && background.trim() !== '') {
          // Try to load background image
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height)
            // Then draw the 3D canvas on top
            tempCtx.drawImage(canvas, 0, 0)
            
            const imageData = tempCanvas.toDataURL('image/png', 1.0)
            if (window.screenshotCallback) {
              window.screenshotCallback(imageData)
            }
          }
          img.onerror = () => {
            // Fallback to gradient if image fails to load
            const gradient = tempCtx.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height)
            gradient.addColorStop(0, '#1a1a2e')
            gradient.addColorStop(0.5, '#16213e')
            gradient.addColorStop(1, '#0f3460')
            tempCtx.fillStyle = gradient
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
            
            tempCtx.drawImage(canvas, 0, 0)
            const imageData = tempCanvas.toDataURL('image/png', 1.0)
            if (window.screenshotCallback) {
              window.screenshotCallback(imageData)
            }
          }
          img.src = background
        } else {
          // Default gradient background
          const gradient = tempCtx.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height)
          gradient.addColorStop(0, '#1a1a2e')
          gradient.addColorStop(0.5, '#16213e')
          gradient.addColorStop(1, '#0f3460')
          tempCtx.fillStyle = gradient
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)
          
          tempCtx.drawImage(canvas, 0, 0)
          const imageData = tempCanvas.toDataURL('image/png', 1.0)
          if (window.screenshotCallback) {
            window.screenshotCallback(imageData)
          }
        }
      } else {
        // Fallback to just the canvas
        const imageData = canvas.toDataURL('image/png', 1.0)
        if (window.screenshotCallback) {
          window.screenshotCallback(imageData)
        }
      }
      
      captureRef.current = false
    }
  })

  return (
    <mesh position={[0, 0, 0]} visible={false}>
      <boxGeometry args={[0.1, 0.1, 0.1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  )
}

 