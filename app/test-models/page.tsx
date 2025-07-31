'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const SkinViewer = dynamic(() => import('../../components/SkinViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-gray-800 rounded flex items-center justify-center">Loading 3D viewer...</div>
})

export default function TestModelsPage() {
  const [selectedModel, setSelectedModel] = useState('ak47')
  const [selectedSkin, setSelectedSkin] = useState('redline')

  const models = [
    { value: 'ak47', label: 'AK-47' },
    { value: 'knife_karambit', label: 'Karambit' },
    { value: 'knife_m9', label: 'M9 Bayonet' }
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">3D Model Test Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
            </div>
            
            <div className="mt-6 p-4 bg-gray-700 rounded">
              <h3 className="font-medium mb-2">Current Selection:</h3>
              <p className="text-sm text-gray-300">
                Model: {models.find(m => m.value === selectedModel)?.label}<br />
                Skin: {skins.find(s => s.value === selectedSkin)?.label}
              </p>
            </div>
          </div>
          
          {/* 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">3D Viewer</h2>
              <div className="w-full h-96 bg-gray-900 rounded overflow-hidden">
                <SkinViewer
                  model={selectedModel}
                  skin={selectedSkin}
                  float={0.15}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Model Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-medium mb-2">Available Models:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• AK-47: <code>/models/weapons/ak47/weapon_rif_ak47.glb</code></li>
                <li>• Karambit: <code>/models/weapons/knives/karambit/weapon_knife_karambit.glb</code></li>
                <li>• M9 Bayonet: <code>/models/weapons/knives/m9_bayonet/weapon_knife_m9.glb</code></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Instructions:</h3>
              <ul className="space-y-1 text-gray-300">
                <li>• Use the controls to switch between models</li>
                <li>• The 3D viewer should load the corresponding GLB file</li>
                <li>• If a model fails to load, it will show a fallback geometry</li>
                <li>• Check the browser console for any loading errors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 