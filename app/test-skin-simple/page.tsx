'use client'

import React, { useEffect, useState } from 'react'

export default function TestSkinSimplePage() {
  const [testResult, setTestResult] = useState<string>('Testing...')

  useEffect(() => {
    const testSkinGenerator = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { skinGenerator } = await import('../../lib/skin-generator')
        
        // Test basic skin generation
        const crimsonWeb = skinGenerator.generateSkin('crimson_web', 0.15)
        console.log('Crimson Web generated:', crimsonWeb.substring(0, 100))
        
        setTestResult(`✅ Success! Generated skin: ${crimsonWeb.substring(0, 50)}...`)
      } catch (error) {
        console.error('Skin generator test failed:', error)
        setTestResult(`❌ Error: ${error}`)
      }
    }
    
    testSkinGenerator()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Simple Skin Generator Test</h1>
      
      <div className="p-4 bg-gray-800 rounded">
        <h2 className="text-lg font-semibold mb-2">Test Result:</h2>
        <p>{testResult}</p>
      </div>
      
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Check Browser Console</h2>
        <p className="text-gray-300">Open the browser console (F12) to see detailed logs.</p>
      </div>
    </div>
  )
} 