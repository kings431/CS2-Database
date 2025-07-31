import React from 'react'
import { notFound } from 'next/navigation'
import { readFile, readdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface ScreenshotPageProps {
  params: {
    filename: string
  }
}

export default async function ScreenshotPage({ params }: ScreenshotPageProps) {
  const { filename } = params
  
  // Validate filename
  if (!filename.endsWith('.png')) {
    notFound()
  }
  
  // Check if file exists
  const screenshotsDir = join(process.cwd(), 'public', 'screenshots')
  const filePath = join(screenshotsDir, filename)
  
  if (!existsSync(filePath)) {
    notFound()
  }
  
  // Parse metadata from filename
  const nameParts = filename.replace('.png', '').split('_')
  const weaponType = nameParts[0] || 'unknown'
  const skin = nameParts[1] || 'unknown'
  const float = parseFloat(nameParts[2]) || 0.15
  const timestamp = parseInt(nameParts[3]) || Date.now()
  
  const date = new Date(timestamp)
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">CS2 Skin Screenshot</h1>
              <p className="text-gray-400 mt-1">
                {weaponType.replace('_', ' ').toUpperCase()} | {skin.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Float: {float.toFixed(3)}</p>
              <p className="text-sm text-gray-400">{date.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Screenshot Display */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-center">
            <img
              src={`/screenshots/${filename}`}
              alt={`${weaponType} ${skin} screenshot`}
              className="max-w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
          
          {/* Metadata */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Weapon Details</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Type:</span> {weaponType.replace('_', ' ').toUpperCase()}</p>
                <p><span className="text-gray-400">Skin:</span> {skin.replace('_', ' ').toUpperCase()}</p>
                <p><span className="text-gray-400">Float:</span> {float.toFixed(3)}</p>
                <p><span className="text-gray-400">Condition:</span> {
                  float <= 0.07 ? 'Factory New' :
                  float <= 0.15 ? 'Minimal Wear' :
                  float <= 0.38 ? 'Field-Tested' :
                  float <= 0.45 ? 'Well-Worn' : 'Battle-Scarred'
                }</p>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Screenshot Info</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-400">Created:</span> {date.toLocaleString()}</p>
                <p><span className="text-gray-400">Filename:</span> {filename}</p>
                <p><span className="text-gray-400">Share URL:</span> 
                  <span className="ml-1 text-blue-400 break-all">
                    {process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/screenshots/{filename}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`/screenshots/${filename}`}
              download
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              📥 Download
            </a>
            <a
              href="/viewer"
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              🎮 Back to Viewer
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/screenshots/${filename}`)
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              📋 Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 