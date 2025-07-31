'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SkinViewer with SSR disabled
const SkinViewer = dynamic(() => import('@/components/SkinViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

export default function SkinViewerPage() {
  const [selectedCategory, setSelectedCategory] = useState('gloves');
  const [selectedModel, setSelectedModel] = useState('gloves_sport');
  const [selectedSkin, setSelectedSkin] = useState('ominous');
  const [float, setFloat] = useState(0.12);
  const [scale, setScale] = useState(1.0);

  // Weapon categories and their models
  const categories = {
    guns: {
      name: 'Guns',
      icon: 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2',
      models: [
        { value: 'ak47', label: 'AK-47', defaultSkin: 'redline' },
        { value: 'm4a4', label: 'M4A4', defaultSkin: 'howl' },
        { value: 'awp', label: 'AWP', defaultSkin: 'dragon_lore' }
      ]
    },
    knives: {
      name: 'Knives',
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      models: [
        { value: 'knife_karambit', label: 'Karambit', defaultSkin: 'crimson_web' },
        { value: 'knife_m9', label: 'M9 Bayonet', defaultSkin: 'marble' }
      ]
    },
    gloves: {
      name: 'Gloves',
      icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M15 7l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2',
      models: [
        { value: 'gloves_sport', label: 'Sport Gloves', defaultSkin: 'ominous' },
        { value: 'gloves_specialist', label: 'Specialist Gloves', defaultSkin: 'fade' }
      ]
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    const firstModel = categories[category as keyof typeof categories].models[0];
    setSelectedModel(firstModel.value);
    setSelectedSkin(firstModel.defaultSkin);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    const modelData = categories[selectedCategory as keyof typeof categories].models.find(m => m.value === model);
    if (modelData) {
      setSelectedSkin(modelData.defaultSkin);
    }
  };

  const getCurrentModelName = () => {
    const category = categories[selectedCategory as keyof typeof categories];
    const model = category.models.find(m => m.value === selectedModel);
    return model?.label || 'Unknown';
  };

  const getCurrentSkinName = () => {
    return selectedSkin.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Weapon Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weapon Selection</h3>
              
              {/* Weapon Categories */}
              <div className="space-y-3">
                {Object.entries(categories).map(([key, category]) => (
                  <div
                    key={key}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === key 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCategorySelect(key)}
                  >
                    <div className={`w-8 h-8 rounded flex items-center justify-center ${
                      selectedCategory === key ? 'bg-blue-600' : 'bg-gray-600'
                    }`}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                      </svg>
                    </div>
                    <span className={selectedCategory === key ? 'font-medium text-gray-900' : 'text-gray-700'}>
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Model Selection */}
              {selectedCategory && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Select Model</h4>
                  <div className="space-y-2">
                    {categories[selectedCategory as keyof typeof categories].models.map((model) => (
                      <button
                        key={model.value}
                        onClick={() => handleModelSelect(model.value)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          selectedModel === model.value
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {model.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Float Control */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Float (Wear)</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={float}
                    onChange={(e) => setFloat(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Factory New</span>
                    <span>Battle-Scarred</span>
                  </div>
                  <div className="text-center text-sm font-medium text-gray-900">
                    {float.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Zoom Control */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Zoom Level</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Close</span>
                    <span>Far</span>
                  </div>
                  <div className="text-center text-sm font-medium text-gray-900">
                    {scale.toFixed(1)}x
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Use mouse wheel or drag to zoom further
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - 3D Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {getCurrentModelName()} | {getCurrentSkinName()}
                </h2>
                <p className="text-gray-600">Interactive 3D viewer with real-time controls.</p>
              </div>
              <SkinViewer
                model={selectedModel}
                skin={selectedSkin}
                float={float}
                scale={scale}
                stickers={[null, null, null, null]}
              />
            </div>
          </div>

          {/* Right Panel - Item Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
              
              {/* Item Image */}
              <div className="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              
              {/* Wear Conditions */}
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-gray-900">Wear Conditions</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="wear" id="fn" className="text-blue-600" defaultChecked />
                    <label htmlFor="fn" className="text-sm text-gray-700">Factory New ($733.70)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="wear" id="mw" className="text-blue-600" />
                    <label htmlFor="mw" className="text-sm text-gray-700">Minimal Wear ($172.29)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="wear" id="ft" className="text-blue-600" />
                    <label htmlFor="ft" className="text-sm text-gray-700">Field-Tested ($98.46)</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" name="wear" id="ww" className="text-blue-600" />
                    <label htmlFor="ww" className="text-sm text-gray-700">Well-Worn ($85.99)</label>
                  </div>
                </div>
              </div>
              
              {/* Pattern and Float */}
              <div className="space-y-2 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pattern</label>
                  <input type="text" value="Coming Soon" disabled className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Float</label>
                  <input type="text" value={`${float.toFixed(2)} FN`} disabled className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500" />
                </div>
              </div>
              
              {/* Item Prices */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Item Prices</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                  </svg>
                  <span>$733.70</span>
                </div>
                <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 