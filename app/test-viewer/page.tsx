'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const SkinViewer = dynamic(() => import('../../components/SkinViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800 rounded flex items-center justify-center">Loading 3D viewer...</div>
})

export default function TestViewerPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Test Viewer</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic 3D Viewer Test</h2>
          <div className="w-full h-96 bg-gray-900 rounded overflow-hidden">
            <SkinViewer
              model="ak47"
              skin="redline"
              float={0.15}
              fov={60}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 