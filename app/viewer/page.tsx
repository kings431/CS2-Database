'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const SkinViewer = dynamic(() => import('../../components/SkinViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800 rounded flex items-center justify-center">Loading 3D viewer...</div>
})



export default function ViewerPage() {
  const [selectedModel, setSelectedModel] = useState('knife_karambit')
  const [selectedSkin, setSelectedSkin] = useState('blue_steel')
  const [selectedFloat, setSelectedFloat] = useState(0.15)
  const [selectedPattern, setSelectedPattern] = useState(1)
  const [selectedFOV, setSelectedFOV] = useState(60)
  const [selectedBackground, setSelectedBackground] = useState('')
  const [showControls, setShowControls] = useState(true)
  
  // Lighting state
  const [ambientIntensity, setAmbientIntensity] = useState(0.6)
  const [directionalIntensity, setDirectionalIntensity] = useState(1.2)
  const [pointLight1Intensity, setPointLight1Intensity] = useState(0.4)
  const [pointLight2Intensity, setPointLight2Intensity] = useState(0.3)
  const [pointLight3Intensity, setPointLight3Intensity] = useState(0.5)
  const [pointLight4Intensity, setPointLight4Intensity] = useState(0.6)
  const [rimLightIntensity, setRimLightIntensity] = useState(0.8)

  // Handle ESC key to toggle controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowControls(!showControls)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showControls])

  const models = [
    { value: 'ak47', label: 'AK-47' },
    { value: 'knife_karambit', label: 'Karambit' },
    { value: 'knife_m9', label: 'M9 Bayonet' },
    { value: 'm4a4', label: 'M4A4' },
    { value: 'awp', label: 'AWP' }
  ]

  const skins = [
    // Karambit skins (we have these files)
    { value: 'crimson_web', label: 'Crimson Web' },
    { value: 'autotronic', label: 'Autotronic' },
    { value: 'black_laminate', label: 'Black Laminate' },
    { value: 'lore', label: 'Lore' },
    { value: 'case_hardened', label: 'Case Hardened' },
    { value: 'tiger_tooth', label: 'Tiger Tooth' },
    { value: 'damascus-steel', label: 'Damascus Steel' },
    { value: 'freehand', label: 'Freehand' },
    { value: 'bright_water', label: 'Bright Water' },
    { value: 'stained', label: 'Stained' },
    { value: 'blue_steel', label: 'Blue Steel' },
    { value: 'rust_coat', label: 'Rust Coat' },
    { value: 'gamma_doppler', label: 'Gamma Doppler' },
    
    // AK47 skins (we have these files)
    { value: 'ak47_redline', label: 'AK-47 Redline' },
    { value: 'ak47_asiimov', label: 'AK-47 Asiimov' },
    { value: 'ak47_vulcan', label: 'AK-47 Vulcan' },
    { value: 'ak47_fire_serpent', label: 'AK-47 Fire Serpent' },
    { value: 'ak47_dragon_lore', label: 'AK-47 Dragon Lore' },
    
    // AWP skins (we have these files)
    { value: 'awp_asiimov', label: 'AWP Asiimov' },
    { value: 'awp_dragon_lore', label: 'AWP Dragon Lore' },
    
    // M4A4 skins (we have these files)
    { value: 'm4a4_asiimov', label: 'M4A4 Asiimov' },
    { value: 'm4a4_howl', label: 'M4A4 Howl' },
    
    // Gloves (we have these files)
    { value: 'gloves_specialist_fade', label: 'Specialist Fade' },
    { value: 'gloves_sport_ominous', label: 'Sport Ominous' }
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-white">CS2Tracker</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Dashboard</a>
              <a href="/inventory" className="text-gray-300 hover:text-white transition-colors">Inventory</a>
              <a href="/database" className="text-gray-300 hover:text-white transition-colors">Database</a>
              <a href="/analytics" className="text-gray-300 hover:text-white transition-colors">Analytics</a>
              <a href="/screenshots" className="text-gray-300 hover:text-white transition-colors">📸 Screenshots</a>
            </div>

            {/* Controls Toggle */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowControls(!showControls)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                {showControls ? 'Hide Controls' : 'Show Controls'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex h-screen pt-16">
        {/* 3D Viewer - Takes up most of the screen */}
        <div className="flex-1 relative h-full">
                                           <SkinViewer
              model={selectedModel}
              skin={selectedSkin}
              float={selectedFloat}
              pattern={selectedPattern}
              fov={selectedFOV}
              background={selectedBackground}
              fullScreen={false}
              className="w-full h-full"
              ambientIntensity={ambientIntensity}
              directionalIntensity={directionalIntensity}
              pointLight1Intensity={pointLight1Intensity}
              pointLight2Intensity={pointLight2Intensity}
              pointLight3Intensity={pointLight3Intensity}
              pointLight4Intensity={pointLight4Intensity}
              rimLightIntensity={rimLightIntensity}
            />
        </div>

        {/* Selection Panel - Right Side */}
        {showControls && (
          <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">3D Viewer Controls</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Press ESC to toggle controls
                </p>
              </div>
              
              {/* Model Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
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
              
              {/* Skin Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Skin</label>
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

              {/* Background Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Background</label>
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

                             {/* Float Slider */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Float ({selectedFloat.toFixed(2)})
                 </label>
                 <input
                   type="range"
                   min="0"
                   max="1"
                   step="0.01"
                   value={selectedFloat}
                   onChange={(e) => setSelectedFloat(parseFloat(e.target.value))}
                   className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                 />
                 <div className="flex justify-between text-xs text-gray-400 mt-1">
                   <span>Factory New</span>
                   <span>Battle-Scarred</span>
                 </div>
               </div>

               {/* Pattern Selection */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   Pattern ({selectedPattern})
                 </label>
                 <input
                   type="number"
                   min="1"
                   max="1000"
                   value={selectedPattern}
                   onChange={(e) => setSelectedPattern(parseInt(e.target.value) || 1)}
                   className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
                 />
                 <div className="text-xs text-gray-400 mt-1">
                   <span>Pattern seed for skins like Case Hardened, Fade, etc.</span>
                 </div>
               </div>

                             {/* FOV Slider */}
               <div>
                 <label className="block text-sm font-medium text-gray-300 mb-2">
                   FOV ({selectedFOV}°)
                 </label>
                 <input
                   type="range"
                   min="30"
                   max="120"
                   step="1"
                   value={selectedFOV}
                   onChange={(e) => setSelectedFOV(parseInt(e.target.value))}
                   className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                 />
                 <div className="flex justify-between text-xs text-gray-400 mt-1">
                   <span>30°</span>
                   <span>120°</span>
                 </div>
               </div>

               {/* Lighting Controls */}
               <div className="pt-4 border-t border-gray-700">
                 <h3 className="font-medium mb-4 text-gray-300">Lighting Controls</h3>
                 
                 {/* Ambient Light */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Ambient Light ({ambientIntensity.toFixed(1)})
                   </label>
                   <input
                     type="range"
                     min="0"
                     max="2"
                     step="0.1"
                     value={ambientIntensity}
                     onChange={(e) => setAmbientIntensity(parseFloat(e.target.value))}
                     className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                   />
                 </div>

                 {/* Directional Light */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Main Light ({directionalIntensity.toFixed(1)})
                   </label>
                   <input
                     type="range"
                     min="0"
                     max="3"
                     step="0.1"
                     value={directionalIntensity}
                     onChange={(e) => setDirectionalIntensity(parseFloat(e.target.value))}
                     className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                   />
                 </div>

                 {/* Point Light 1 (Blue) */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Blue Light ({pointLight1Intensity.toFixed(1)})
                   </label>
                   <input
                     type="range"
                     min="0"
                     max="2"
                     step="0.1"
                     value={pointLight1Intensity}
                     onChange={(e) => setPointLight1Intensity(parseFloat(e.target.value))}
                     className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                   />
                 </div>

                 {/* Point Light 2 (Red) */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Red Light ({pointLight2Intensity.toFixed(1)})
                   </label>
                   <input
                     type="range"
                     min="0"
                     max="2"
                     step="0.1"
                     value={pointLight2Intensity}
                     onChange={(e) => setPointLight2Intensity(parseFloat(e.target.value))}
                     className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                   />
                 </div>

                 {/* Point Light 3 (Green - Back Light) */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Back Light ({pointLight3Intensity.toFixed(1)})
                   </label>
                   <input
                     type="range"
                     min="0"
                     max="2"
                     step="0.1"
                     value={pointLight3Intensity}
                     onChange={(e) => setPointLight3Intensity(parseFloat(e.target.value))}
                     className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                   />
                 </div>

                 {/* Point Light 4 (White Fill) */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Fill Light ({pointLight4Intensity.toFixed(1)})
                   </label>
                   <input
                     type="range"
                     min="0"
                     max="2"
                     step="0.1"
                     value={pointLight4Intensity}
                     onChange={(e) => setPointLight4Intensity(parseFloat(e.target.value))}
                     className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                   />
                 </div>

                 {/* Rim Light */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Rim Light ({rimLightIntensity.toFixed(1)})
                   </label>
                   <input
                     type="range"
                     min="0"
                     max="2"
                     step="0.1"
                     value={rimLightIntensity}
                     onChange={(e) => setRimLightIntensity(parseFloat(e.target.value))}
                     className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                   />
                 </div>

                 {/* Lighting Presets */}
                 <div className="mb-4">
                   <label className="block text-sm font-medium text-gray-300 mb-2">
                     Lighting Presets
                   </label>
                   <div className="grid grid-cols-2 gap-2">
                     <button
                       onClick={() => {
                         setAmbientIntensity(0.8)
                         setDirectionalIntensity(1.5)
                         setPointLight1Intensity(0.3)
                         setPointLight2Intensity(0.2)
                         setPointLight3Intensity(0.8)
                         setPointLight4Intensity(0.7)
                         setRimLightIntensity(1.0)
                       }}
                       className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
                     >
                       Bright
                     </button>
                     <button
                       onClick={() => {
                         setAmbientIntensity(0.4)
                         setDirectionalIntensity(0.8)
                         setPointLight1Intensity(0.6)
                         setPointLight2Intensity(0.5)
                         setPointLight3Intensity(0.3)
                         setPointLight4Intensity(0.4)
                         setRimLightIntensity(0.6)
                       }}
                       className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded"
                     >
                       Dramatic
                     </button>
                     <button
                       onClick={() => {
                         setAmbientIntensity(0.6)
                         setDirectionalIntensity(1.2)
                         setPointLight1Intensity(0.4)
                         setPointLight2Intensity(0.3)
                         setPointLight3Intensity(0.5)
                         setPointLight4Intensity(0.6)
                         setRimLightIntensity(0.8)
                       }}
                       className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                     >
                       Default
                     </button>
                     <button
                       onClick={() => {
                         setAmbientIntensity(1.0)
                         setDirectionalIntensity(0.5)
                         setPointLight1Intensity(0.8)
                         setPointLight2Intensity(0.7)
                         setPointLight3Intensity(1.0)
                         setPointLight4Intensity(0.9)
                         setRimLightIntensity(0.4)
                       }}
                       className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded"
                     >
                       Soft
                     </button>
                   </div>
                 </div>
               </div>

              {/* Current Selection Display */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="font-medium mb-2 text-gray-300">Current Selection:</h3>
                                 <div className="text-sm text-gray-400 space-y-1">
                   <p>Model: {models.find(m => m.value === selectedModel)?.label}</p>
                   <p>Skin: {skins.find(s => s.value === selectedSkin)?.label}</p>
                   <p>Background: {backgrounds.find(b => b.value === selectedBackground)?.label || 'Default'}</p>
                   <p>Float: {selectedFloat.toFixed(2)}</p>
                   <p>Pattern: {selectedPattern}</p>
                   <p>FOV: {selectedFOV}°</p>
                 </div>
              </div>

              



              {/* Instructions */}
              <div className="pt-4 border-t border-gray-700">
                <h3 className="font-medium mb-2 text-gray-300">Controls:</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>• Mouse: Rotate the model</p>
                  <p>• Scroll: Zoom in/out</p>
                  <p>• ESC: Toggle controls</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 