import React from 'react'
import Link from 'next/link'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default async function ScreenshotsPage() {
  const screenshotsDir = join(process.cwd(), 'public', 'screenshots')
  
  let screenshots: Array<{
    filename: string
    weaponType: string
    skin: string
    float: number
    timestamp: number
    date: Date
  }> = []
  
  if (existsSync(screenshotsDir)) {
    try {
      const files = await readdir(screenshotsDir)
      const pngFiles = files.filter(file => file.endsWith('.png'))
      
      screenshots = pngFiles.map(filename => {
        const nameParts = filename.replace('.png', '').split('_')
        const weaponType = nameParts[0] || 'unknown'
        const skin = nameParts[1] || 'unknown'
        const float = parseFloat(nameParts[2]) || 0.15
        const timestamp = parseInt(nameParts[3]) || Date.now()
        
        return {
          filename,
          weaponType,
          skin,
          float,
          timestamp,
          date: new Date(timestamp)
        }
      }).sort((a, b) => b.timestamp - a.timestamp) // Sort by newest first
    } catch (error) {
      console.error('Error reading screenshots directory:', error)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">CS2 Screenshots Gallery</h1>
              <p className="text-gray-400 mt-1">
                {screenshots.length} screenshot{screenshots.length !== 1 ? 's' : ''} captured
              </p>
            </div>
            <Link
              href="/viewer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              🎮 Back to Viewer
            </Link>
          </div>
        </div>
      </div>
      
      {/* Gallery */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {screenshots.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-xl font-semibold mb-2">No Screenshots Yet</h2>
            <p className="text-gray-400 mb-6">
              Take your first screenshot in the 3D viewer!
            </p>
            <Link
              href="/viewer"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go to Viewer
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {screenshots.map((screenshot) => (
              <Link
                key={screenshot.filename}
                href={`/screenshots/${screenshot.filename}`}
                className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={`/screenshots/${screenshot.filename}`}
                    alt={`${screenshot.weaponType} ${screenshot.skin}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1">
                    {screenshot.weaponType.replace('_', ' ').toUpperCase()}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {screenshot.skin.replace('_', ' ').toUpperCase()}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Float: {screenshot.float.toFixed(3)}</span>
                    <span>{screenshot.date.toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 