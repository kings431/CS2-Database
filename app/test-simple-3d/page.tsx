'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';

function SimpleBox() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function TestSimple3DPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Simple 3D Test
          </h1>
          <p className="text-gray-600">
            Testing basic 3D rendering with React Three Fiber.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Basic 3D Cube
            </h2>
            <p className="text-gray-600">
              This should display a simple orange cube.
            </p>
          </div>
          <div className="w-full h-[400px]">
            <Canvas>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <SimpleBox />
            </Canvas>
          </div>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            Success Indicators
          </h3>
          <ul className="text-green-800 space-y-1">
            <li>• You should see an orange cube</li>
            <li>• No console errors should appear</li>
            <li>• The page should load without crashing</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 