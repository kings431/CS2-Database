import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SkinViewer with SSR disabled
const SkinViewer = dynamic(() => import('@/components/SkinViewer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D viewer...</p>
      </div>
    </div>
  ),
});

export default function TestSkinViewerPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            CS2 Skin Viewer - Comprehensive Test
          </h1>
          <p className="text-gray-600">
            Testing the complete 3D CS2 Skin Viewer with multiple weapons, maps, and skins.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Interactive 3D Skin Viewer
            </h2>
            <p className="text-gray-600">
              Select different weapons, skins, maps, and customize your loadout in real-time.
            </p>
          </div>
          <SkinViewer
            model="ak47"
            skin="redline"
            float={0.12}
            stickers={["katowice2014.svg", null, null, null]}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Available Weapons
            </h3>
            <ul className="text-blue-800 space-y-2">
              <li><strong>Rifles:</strong> AK-47, M4A4, AWP</li>
              <li><strong>Knives:</strong> Karambit, M9 Bayonet</li>
              <li><strong>Gloves:</strong> Sport Gloves, Specialist Gloves</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              Available Maps
            </h3>
            <ul className="text-green-800 space-y-2">
              <li>de_dust2</li>
              <li>de_mirage</li>
              <li>de_inferno</li>
              <li>de_nuke</li>
              <li>de_overpass</li>
            </ul>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">
              Features
            </h3>
            <ul className="text-purple-800 space-y-2">
              <li>• Real-time 3D weapon rendering</li>
              <li>• Dynamic skin switching</li>
              <li>• Map background selection</li>
              <li>• Wear/float adjustment</li>
              <li>• Sticker application</li>
              <li>• Interactive camera controls</li>
            </ul>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-4">
              Popular Skins
            </h3>
            <ul className="text-yellow-800 space-y-2">
              <li>AK-47 | Fire Serpent</li>
              <li>M4A4 | Howl</li>
              <li>AWP | Dragon Lore</li>
              <li>Karambit | Fade</li>
              <li>Sport Gloves | Ominous</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 p-4 bg-orange-50 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            How to Use
          </h3>
          <ul className="text-orange-800 space-y-1">
            <li>• Use the Weapon dropdown to switch between different weapons</li>
            <li>• Select different skins for each weapon</li>
            <li>• Choose a map background from the Map dropdown</li>
            <li>• Adjust the wear/float slider to see wear effects</li>
            <li>• Apply stickers using the sticker dropdowns</li>
            <li>• Rotate and zoom the 3D model with your mouse</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 