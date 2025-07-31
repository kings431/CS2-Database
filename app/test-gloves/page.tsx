'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const GloveViewer = dynamic(() => import('../../components/GloveViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800 rounded flex items-center justify-center">Loading glove viewer...</div>
})

export default function TestGlovesPage() {
  const [selectedGlove, setSelectedGlove] = useState('fingers_handwrap.glb')

  const gloveModels = [
    { value: 'fingers_handwrap.glb', label: 'Fingers Handwrap' },
    { value: 'Inspect_s2Gloves.CfjxhPGH.glb', label: 'Inspect S2 Gloves' },
    { value: 'v_glove_bloodhound.glb', label: 'Bloodhound Gloves' },
    { value: 'v_glove_hardknuckle.glb', label: 'Hard Knuckle Gloves' }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Glove Model Tester</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Glove Selection */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Select Glove Model</h2>
            <div className="space-y-4">
              {gloveModels.map((glove) => (
                <button
                  key={glove.value}
                  onClick={() => setSelectedGlove(glove.value)}
                  className={`w-full p-4 text-left rounded-lg border transition-colors ${
                    selectedGlove === glove.value
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="font-medium">{glove.label}</div>
                  <div className="text-sm opacity-75">{glove.value}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3D Viewer */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">3D Preview</h2>
            <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
              <GloveViewer modelPath={`/models/gloves/${selectedGlove}`} />
            </div>
          </div>
        </div>

        {/* Model Information */}
        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Model Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-300 mb-2">Current Model:</h3>
              <p className="text-gray-400">{gloveModels.find(g => g.value === selectedGlove)?.label}</p>
              <p className="text-sm text-gray-500">{selectedGlove}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-300 mb-2">File Path:</h3>
              <p className="text-gray-400">/models/gloves/{selectedGlove}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 