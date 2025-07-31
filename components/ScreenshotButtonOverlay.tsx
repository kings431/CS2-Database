'use client'

import React, { useState, useEffect } from 'react'

interface ScreenshotButtonOverlayProps {
  weaponType: string
  skin: string
  float: number
  background: string
  fov: number
  className?: string
}

export default function ScreenshotButtonOverlay({ 
  weaponType, 
  skin, 
  float, 
  background, 
  fov,
  className = ''
}: ScreenshotButtonOverlayProps) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [permalink, setPermalink] = useState<string | null>(null)

  // Set up the global callback
  useEffect(() => {
    window.screenshotCallback = async (imageData: string) => {
      try {
        console.log('Capturing screenshot for:', { weaponType, skin, float, background, fov })
        
        // Upload to server
        const response = await fetch('/api/screenshot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData,
            weaponType,
            skin,
            float,
            background,
            fov
          }),
        })
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Server response:', errorText)
          throw new Error(`HTTP error! status: ${response.status}: ${errorText}`)
        }
        
        const result = await response.json()
        
        if (result.success) {
          setPermalink(result.permalink)
          // Copy permalink to clipboard
          const fullUrl = `${window.location.origin}${result.permalink}`
          await navigator.clipboard.writeText(fullUrl)
          console.log('Screenshot saved successfully:', result.permalink)
        } else {
          console.error('Screenshot failed:', result.error)
          alert('Failed to save screenshot. Please try again.')
        }
      } catch (error) {
        console.error('Screenshot capture failed:', error)
        alert('Failed to capture screenshot. Please try again.')
      } finally {
        setIsCapturing(false)
      }
    }

    return () => {
      window.screenshotCallback = undefined
    }
  }, [weaponType, skin, float, background, fov])

  const captureScreenshot = () => {
    setIsCapturing(true)
    setPermalink(null)
    
    // Trigger the screenshot from within the Canvas
    if (window.triggerScreenshot) {
      window.triggerScreenshot()
    } else {
      // Fallback: trigger the callback directly
      setTimeout(() => {
        if (window.screenshotCallback) {
          window.screenshotCallback('')
        }
      }, 100)
    }
  }

  const copyPermalink = async () => {
    if (permalink) {
      const fullUrl = `${window.location.origin}${permalink}`
      await navigator.clipboard.writeText(fullUrl)
    }
  }

  return (
    <div className={`absolute top-4 right-4 z-10 ${className}`}>
      <div className="flex flex-col gap-2">
        <button
          onClick={captureScreenshot}
          disabled={isCapturing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors shadow-lg"
          title="Take a screenshot and get a shareable link"
        >
          {isCapturing ? '📸 Capturing...' : '📸 Screenshot'}
        </button>
        
        {permalink && (
          <div className="p-3 bg-green-900 border border-green-700 rounded-lg shadow-lg min-w-64">
            <p className="text-green-100 text-sm mb-2">✅ Screenshot saved!</p>
            <div className="flex gap-2">
              <button
                onClick={copyPermalink}
                className="px-3 py-1 bg-green-700 hover:bg-green-600 text-white text-xs rounded"
              >
                📋 Copy Link
              </button>
              <a
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-blue-700 hover:bg-blue-600 text-white text-xs rounded"
              >
                🔗 View
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 