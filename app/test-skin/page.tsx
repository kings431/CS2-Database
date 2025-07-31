'use client'

import React, { useEffect, useState } from 'react'
import { skinGenerator } from '../../lib/skin-generator'

export default function TestSkinPage() {
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    const testSkins = () => {
      const results: string[] = []
      
      try {
        // Test basic skin generation
        const crimsonWeb = skinGenerator.generateSkin('crimson_web', 0.15)
        results.push(`✅ Crimson Web generated: ${crimsonWeb.substring(0, 50)}...`)
        
        const fade = skinGenerator.generateSkin('fade', 0.25)
        results.push(`✅ Fade generated: ${fade.substring(0, 50)}...`)
        
        const doppler = skinGenerator.generateSkin('doppler', 0.35)
        results.push(`✅ Doppler generated: ${doppler.substring(0, 50)}...`)
        
        // Test skin name extraction
        const testPath = '/textures/skins/knife_karambit_crimson_web'
        const pathParts = testPath.split('/')
        const fileName = pathParts[pathParts.length - 1]
        const parts = fileName.split('_')
        const extractedSkin = parts.length >= 3 ? parts.slice(2).join('_') : parts[parts.length - 1]
        results.push(`✅ Skin name extraction: "${extractedSkin}" from "${fileName}"`)
        
      } catch (error) {
        results.push(`❌ Error: ${error}`)
      }
      
      setTestResults(results)
    }
    
    testSkins()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Skin Generator Test</h1>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Results:</h2>
        {testResults.map((result, index) => (
          <div key={index} className="p-3 bg-gray-800 rounded">
            {result}
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Manual Tests:</h2>
        <div className="grid grid-cols-2 gap-4">
          {['crimson_web', 'fade', 'doppler', 'tiger_tooth', 'case_hardened'].map((skin) => (
            <div key={skin} className="p-4 bg-gray-800 rounded">
              <h3 className="font-medium mb-2">{skin}</h3>
              <img 
                src={skinGenerator.generateSkin(skin, 0.15)} 
                alt={skin}
                className="w-full h-32 object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 