'use client'

import React, { useEffect, useState } from 'react'

export default function DebugSkinPage() {
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  useEffect(() => {
    const debugSkinGenerator = async () => {
      const info: string[] = []
      
      try {
        // Test browser environment
        info.push(`Browser environment: ${typeof window !== 'undefined'}`)
        info.push(`Canvas available: ${typeof HTMLCanvasElement !== 'undefined'}`)
        
        // Test canvas creation
        if (typeof window !== 'undefined') {
          const canvas = document.createElement('canvas')
          canvas.width = 100
          canvas.height = 100
          const ctx = canvas.getContext('2d')
          info.push(`Canvas context created: ${ctx !== null}`)
          
          if (ctx) {
            // Test basic drawing
            ctx.fillStyle = '#FF0000'
            ctx.fillRect(0, 0, 100, 100)
            const dataUrl = canvas.toDataURL()
            info.push(`Canvas toDataURL works: ${dataUrl.substring(0, 50)}...`)
          }
        }
        
        // Test skin generator
        const { skinGenerator } = await import('../../lib/skin-generator')
        const crimsonWeb = skinGenerator.generateSkin('crimson_web', 0.15)
        info.push(`Skin generator works: ${crimsonWeb.substring(0, 50)}...`)
        
        // Test texture loading
        const img = new Image()
        img.onload = () => {
          info.push('Image loaded successfully')
          setDebugInfo([...info])
        }
        img.onerror = () => {
          info.push('Image failed to load')
          setDebugInfo([...info])
        }
        img.src = crimsonWeb
        
      } catch (error) {
        info.push(`Error: ${error}`)
        setDebugInfo(info)
      }
    }
    
    debugSkinGenerator()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Skin Generator Debug</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Debug Info:</h2>
        {debugInfo.map((info, index) => (
          <div key={index} className="p-3 bg-gray-800 rounded">
            {info}
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Test Skins:</h2>
        <div className="grid grid-cols-2 gap-4">
          {['crimson_web', 'fade', 'doppler'].map((skin) => (
            <div key={skin} className="p-4 bg-gray-800 rounded">
              <h3 className="font-medium mb-2">{skin}</h3>
              <div className="w-full h-32 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-gray-400">Loading...</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 