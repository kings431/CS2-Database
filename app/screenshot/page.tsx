'use client'

import { useState } from 'react'
import { Search, Copy, Download, X, Clock } from 'lucide-react'

interface ScreenshotResult {
  name: string
  wear: string
  pattern: number
  float: number
  category: string
  rarity: string
  imageUrl: string
  inspectLink: string
  timestamp: string
}

export default function ScreenshotTool() {
  const [inspectLink, setInspectLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScreenshotResult | null>(null)
  const [error, setError] = useState('')

  const handleGetScreenshot = async () => {
    if (!inspectLink.trim()) {
      setError('Please enter a Steam inspect link')
      return
    }

    setIsLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inspectLink: inspectLink.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate screenshot')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate screenshot. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (result?.imageUrl) {
      navigator.clipboard.writeText(result.imageUrl)
    }
  }

  const handleDownload = () => {
    if (result?.imageUrl) {
      const link = document.createElement('a')
      link.href = result.imageUrl
      link.download = `${result.name.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleClear = () => {
    setResult(null)
    setError('')
    setInspectLink('')
  }

  const getWearColor = (wear: string) => {
    const float = parseFloat(wear)
    if (float < 0.07) return 'text-green-400'
    if (float < 0.15) return 'text-green-300'
    if (float < 0.38) return 'text-yellow-400'
    if (float < 0.45) return 'text-orange-400'
    return 'text-red-400'
  }

  const getWearBarPosition = (wear: string) => {
    const float = parseFloat(wear)
    return Math.min(float * 100, 100)
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'contraband': return 'text-yellow-400'
      case 'covert': return 'text-red-400'
      case 'classified': return 'text-purple-400'
      case 'restricted': return 'text-pink-400'
      case 'mil-spec': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">CS2 (CS:GO) Skin Screenshot Tool</h1>
          <div className="text-gray-300 space-y-2">
            <p>
              Need a high-resolution screenshot of your CS2 (CS:GO) items? No matter if you want to trade CS2 (CS:GO) skins and need a good screenshot or if just want to admire a great-looking sticker craft: We have you covered.
            </p>
            <p>
              Our CS2 (CS:GO) Skin Screenshot Tool allows you to take screenshots of any knives, gloves, or weapon skins in CS2 (CS:GO) with the click of one button. Simply paste in the inspect link and hit the get screenshot button. All screenshots have a permanent link that you can freely share with anyone.
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={inspectLink}
              onChange={(e) => setInspectLink(e.target.value)}
              placeholder="steam://rungame/730/76561202255233023/+csgo_econ_action_preview%20S76561198093714585A44626866315D13835460595494074492"
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleGetScreenshot}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-medium flex items-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  GET SCREENSHOT
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="text-red-400 mt-2 text-sm">{error}</p>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-gray-800 rounded-lg p-6">
            {/* Item Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{result.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRarityColor(result.rarity)} bg-gray-700`}>
                    {result.rarity}
                  </span>
                  <span className="text-gray-400 text-sm capitalize">{result.category}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClear}
                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Item Card */}
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex gap-6">
                {/* Skin Image Section */}
                <div className="flex-1 relative">
                  <div className="w-full h-64 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                    {result.imageUrl ? (
                      <img
                        src={result.imageUrl}
                        alt={result.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Fallback placeholder */}
                    <div className="fallback hidden w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm">Image not available</p>
                      </div>
                    </div>
                  </div>
                  {/* Temp Logo */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
                    CS2DB
                  </div>
                </div>

                {/* Properties Section */}
                <div className="w-64 space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm">Pattern</label>
                    <p className="text-lg font-medium">{result.pattern}</p>
                  </div>
                  
                  <div>
                    <label className="text-gray-400 text-sm">Wear</label>
                    <p className={`text-lg font-medium ${getWearColor(result.wear)}`}>
                      {result.wear}
                    </p>
                    
                    {/* Wear Bar */}
                    <div className="mt-2 bg-gray-600 rounded-full h-2 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
                      <div 
                        className="absolute top-0 w-2 h-2 bg-white rounded-full transform -translate-y-0.5"
                        style={{ left: `${getWearBarPosition(result.wear)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-sm">Float Value</label>
                    <p className="text-lg font-medium">{result.float}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center justify-end mt-4 text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {result.timestamp}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 