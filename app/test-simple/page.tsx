'use client'

import React from 'react'

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Simple Test Page</h1>
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Test</h2>
          <p className="text-gray-300">
            If you can see this page, the basic Next.js setup is working.
          </p>
        </div>
      </div>
    </div>
  )
} 