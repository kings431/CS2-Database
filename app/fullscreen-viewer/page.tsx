'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'

const SkinViewer = dynamic(() => import('../../components/SkinViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800 rounded flex items-center justify-center">Loading 3D viewer...</div>
})

export default function FullscreenViewerPage() {
  const [selectedModel, setSelectedModel] = useState('knife_karambit')
  const [selectedSkin, setSelectedSkin] = useState('autotronic')
  const [selectedFloat, setSelectedFloat] = useState(0.15)
  const [selectedFOV, setSelectedFOV] = useState(60)
  const [selectedBackground, setSelectedBackground] = useState('')
  const [isFullScreen, setIsFullScreen] = useState(false)

  // Handle ESC key to exit full screen
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false)
      }
    }

    if (isFullScreen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullScreen])

  const models = [
    { value: 'ak47', label: 'AK-47' },
    { value: 'knife_karambit', label: 'Karambit' },
    { value: 'knife_m9', label: 'M9 Bayonet' },
    { value: 'm4a4', label: 'M4A4' },
    { value: 'awp', label: 'AWP' }
  ]

  const skins = [
    { value: 'redline', label: 'Redline' },
    { value: 'fade', label: 'Fade' },
    { value: 'asiimov', label: 'Asiimov' },
    { value: 'vanilla', label: 'Vanilla' },
    { value: 'marble_fade', label: 'Marble Fade' },
    { value: 'doppler', label: 'Doppler' },
    { value: 'tiger_tooth', label: 'Tiger Tooth' },
    { value: 'black_laminate', label: 'Black Laminate' },
    { value: 'crimson_web', label: 'Crimson Web' },
    { value: 'stained', label: 'Stained' },
    { value: 'case_hardened', label: 'Case Hardened' },
    { value: 'blue_steel', label: 'Blue Steel' },
    { value: 'rust_coat', label: 'Rust Coat' },
    { value: 'damascus-steel', label: 'Damascus Steel' },
    { value: 'gamma_doppler', label: 'Gamma Doppler' },
    { value: 'autotronic', label: 'Autotronic' },
    { value: 'lore', label: 'Lore' },
    { value: 'freehand', label: 'Freehand' },
    { value: 'bright_water', label: 'Bright Water' }
  ]

  const backgrounds = [
    { value: '', label: 'Default Gradient' },
    { value: '/backgrounds/back1.jpg', label: 'Background 1' },
    { value: '/backgrounds/back2.jpg', label: 'Background 2' },
    { value: '/backgrounds/back3.jpg', label: 'Background 3' },
    { value: '/backgrounds/back4.jpg', label: 'Background 4' },
    { value: '/backgrounds/back5.png', label: 'Background 5' },
    { value: '/backgrounds/gradient.png', label: 'Gradient' }
  ]

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 z-50">
        <SkinViewer
          model={selectedModel}
          skin={selectedSkin}
          float={selectedFloat}
          fov={selectedFOV}
          fullScreen={true}
          className="w-full h-full"
        />
        {/* Full screen controls overlay */}
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={() => setIsFullScreen(false)}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
          >
            Exit Full Screen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Full Screen 3D Viewer</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  {models.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Skin</label>
                <select
                  value={selectedSkin}
                  onChange={(e) => setSelectedSkin(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  {skins.map((skin) => (
                    <option key={skin.value} value={skin.value}>
                      {skin.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Background</label>
                <select
                  value={selectedBackground}
                  onChange={(e) => setSelectedBackground(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  {backgrounds.map((bg) => (
                    <option key={bg.value} value={bg.value}>
                      {bg.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Float ({selectedFloat.toFixed(2)})</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedFloat}
                  onChange={(e) => setSelectedFloat(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">FOV ({selectedFOV}°)</label>
                <input
                  type="range"
                  min="30"
                  max="120"
                  step="1"
                  value={selectedFOV}
                  onChange={(e) => setSelectedFOV(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <button
                onClick={() => setIsFullScreen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Enter Full Screen Mode
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-gray-700 rounded">
              <h3 className="font-medium mb-2">Current Selection:</h3>
              <p className="text-sm text-gray-300">
                Model: {models.find(m => m.value === selectedModel)?.label}<br />
                Skin: {skins.find(s => s.value === selectedSkin)?.label}<br />
                Background: {backgrounds.find(b => b.value === selectedBackground)?.label || 'Default'}<br />
                Float: {selectedFloat.toFixed(2)}<br />
                FOV: {selectedFOV}°
              </p>
            </div>
          </div>
          
          {/* 3D Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">3D Viewer Preview</h2>
              <div className="w-full h-96 bg-gray-900 rounded overflow-hidden">
                <SkinViewer
                  model={selectedModel}
                  skin={selectedSkin}
                  float={selectedFloat}
                  fov={selectedFOV}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Full Screen Mode Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Full Screen Experience:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Immersive 3D viewing experience</li>
                <li>• No UI distractions - just the 3D model</li>
                <li>• Full screen canvas for maximum detail</li>
                <li>• Perfect for showcasing skins</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Controls:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Mouse: Rotate the model</li>
                <li>• Scroll: Zoom in/out</li>
                <li>• Exit button: Return to normal view</li>
                <li>• ESC key: Exit full screen</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 