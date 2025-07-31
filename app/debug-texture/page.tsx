'use client'

import React, { useState, useEffect } from 'react'
import { skinGenerator } from '../../lib/skin-generator'

export default function DebugTexturePage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testTextureLoading = async () => {
    setIsLoading(true)
    setTestResults([])
    
    addLog('Starting texture loading test...')
    
    try {
      // Test blue_steel skin
      addLog('Testing blue_steel skin...')
      const blueSteelUrl = await skinGenerator.generateSkin('blue_steel', 0.15, 1)
      addLog(`Blue Steel URL length: ${blueSteelUrl.length}`)
      addLog(`Blue Steel URL preview: ${blueSteelUrl.substring(0, 100)}...`)
      
      // Test crimson_web skin
      addLog('Testing crimson_web skin...')
      const crimsonWebUrl = await skinGenerator.generateSkin('crimson_web', 0.15, 1)
      addLog(`Crimson Web URL length: ${crimsonWebUrl.length}`)
      addLog(`Crimson Web URL preview: ${crimsonWebUrl.substring(0, 100)}...`)
      
      // Test autotronic skin
      addLog('Testing autotronic skin...')
      const autotronicUrl = await skinGenerator.generateSkin('autotronic', 0.15, 1)
      addLog(`Autotronic URL length: ${autotronicUrl.length}`)
      addLog(`Autotronic URL preview: ${autotronicUrl.substring(0, 100)}...`)
      
      addLog('All tests completed!')
    } catch (error) {
      addLog(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Texture Loading Debug</h1>
        
        <div className="mb-8">
          <button
            onClick={testTextureLoading}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg"
          >
            {isLoading ? 'Testing...' : 'Test Texture Loading'}
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="bg-black rounded p-4 h-96 overflow-y-auto font-mono text-sm">
            {testResults.length === 0 ? (
              <p className="text-gray-400">No test results yet. Click the button above to start testing.</p>
            ) : (
              testResults.map((log, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Expected Behavior:</h2>
          <ul className="text-gray-300 space-y-2">
            <li>• Texture URLs should be data URLs starting with "data:image/png;base64,"</li>
            <li>• URL length should be around 100,000+ characters for a 1024x1024 texture</li>
            <li>• No errors should appear in the console</li>
            <li>• Each skin should generate a different texture</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 