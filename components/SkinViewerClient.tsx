'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import SkinViewerFallback from './SkinViewerFallback';
import WeaponModel from './WeaponModel';

interface SkinViewerProps {
  model?: string;
  skin?: string;
  float?: number;
  stickers?: (string | null)[];
  className?: string;
  // New props for screenshot integration
  itemName?: string;
  category?: string;
  wear?: string;
  pattern?: number;
}

// Weapon data structure
interface WeaponData {
  type: string;
  name: string;
  skins: { value: string; label: string }[];
  modelPath: string;
  geometry: [number, number, number]; // fallback geometry
  scale: number;
  position: [number, number, number];
}

// Available weapons
const WEAPONS: { [key: string]: WeaponData } = {
  ak47: {
    type: 'rifle',
    name: 'AK-47',
    skins: [
      { value: 'redline', label: 'Redline' },
      { value: 'asiimov', label: 'Asiimov' },
      { value: 'vulcan', label: 'Vulcan' },
      { value: 'fire_serpent', label: 'Fire Serpent' },
      { value: 'dragon_lore', label: 'Dragon Lore' }
    ],
    modelPath: '/models/weapons/ak47/ak-47.glb',
    geometry: [2.2, 0.15, 0.15],
    scale: 1.0,
    position: [0, 0, 0]
  },
  m4a4: {
    type: 'rifle',
    name: 'M4A4',
    skins: [
      { value: 'howl', label: 'Howl' },
      { value: 'asiimov', label: 'Asiimov' },
      { value: 'desolate_space', label: 'Desolate Space' },
      { value: 'evolved', label: 'Evolved' }
    ],
    modelPath: '/models/m4a4_realistic.glb',
    geometry: [2.0, 0.15, 0.15],
    scale: 1.0,
    position: [0, 0, 0]
  },
  awp: {
    type: 'sniper',
    name: 'AWP',
    skins: [
      { value: 'dragon_lore', label: 'Dragon Lore' },
      { value: 'asiimov', label: 'Asiimov' },
      { value: 'medusa', label: 'Medusa' },
      { value: 'fever_dream', label: 'Fever Dream' }
    ],
    modelPath: '/models/awp_realistic.glb',
    geometry: [2.8, 0.12, 0.12],
    scale: 1.2,
    position: [0, 0, 0]
  },
  knife_karambit: {
    type: 'knife',
    name: 'Karambit',
    skins: [
      { value: 'fade', label: 'Fade' },
      { value: 'marble_fade', label: 'Marble Fade' },
      { value: 'doppler', label: 'Doppler' },
      { value: 'tiger_tooth', label: 'Tiger Tooth' }
    ],
    modelPath: '/models/karambit_realistic.glb',
    geometry: [0.6, 0.08, 0.08],
    scale: 1.5,
    position: [0, 0, 0]
  },
  knife_m9: {
    type: 'knife',
    name: 'M9 Bayonet',
    skins: [
      { value: 'marble', label: 'Marble Fade' },
      { value: 'doppler', label: 'Doppler' },
      { value: 'tiger_tooth', label: 'Tiger Tooth' },
      { value: 'ultraviolet', label: 'Ultraviolet' }
    ],
    modelPath: '/models/m9_bayonet_realistic.glb',
    geometry: [0.7, 0.08, 0.08],
    scale: 1.3,
    position: [0, 0, 0]
  },
  gloves_sport: {
    type: 'gloves',
    name: 'Sport Gloves',
    skins: [
      { value: 'ominous', label: 'Ominous' },
      { value: 'vice', label: 'Vice' },
      { value: 'pandora', label: 'Pandora\'s Box' }
    ],
    modelPath: '/models/sport_gloves_realistic.glb',
    geometry: [0.8, 0.4, 0.3],
    scale: 1.0,
    position: [0, 0, 0]
  },
  gloves_specialist: {
    type: 'gloves',
    name: 'Specialist Gloves',
    skins: [
      { value: 'fade', label: 'Fade' },
      { value: 'crimson_kimono', label: 'Crimson Kimono' },
      { value: 'emerald_web', label: 'Emerald Web' }
    ],
    modelPath: '/models/specialist_gloves_realistic.glb',
    geometry: [0.8, 0.4, 0.3],
    scale: 1.0,
    position: [0, 0, 0]
  }
};

// Available maps
const MAPS = [
  { value: 'de_dust2', label: 'de_dust2' },
  { value: 'de_mirage', label: 'de_mirage' },
  { value: 'de_inferno', label: 'de_inferno' },
  { value: 'de_nuke', label: 'de_nuke' },
  { value: 'de_overpass', label: 'de_overpass' }
];



// Map background component
const MapBackground: React.FC<{ mapPath?: string }> = ({ mapPath }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (mapPath) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        mapPath,
        (loadedTexture) => {
          loadedTexture.flipY = false;
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.warn('Failed to load map texture:', error);
        }
      );
    }
  }, [mapPath]);

  return (
    <mesh position={[0, -5, -10]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial 
        map={texture} 
        color={texture ? 0xffffff : 0x8B7355}
      />
    </mesh>
  );
};

// Map item name and category to model and skin
const mapItemToModel = (itemName: string, category: string): { model: string; skin: string } => {
  const name = itemName.toLowerCase();
  
  // Map knives
  if (category === 'knife') {
    if (name.includes('karambit')) {
      if (name.includes('vanilla')) {
        return { model: 'knife_karambit', skin: 'vanilla' };
      } else if (name.includes('fade')) {
        return { model: 'knife_karambit', skin: 'fade' };
      } else if (name.includes('marble')) {
        return { model: 'knife_karambit', skin: 'marble_fade' };
      } else if (name.includes('doppler')) {
        return { model: 'knife_karambit', skin: 'doppler' };
      } else {
        return { model: 'knife_karambit', skin: 'fade' }; // Default
      }
    } else if (name.includes('butterfly')) {
      return { model: 'knife_butterfly', skin: 'fade' };
    } else if (name.includes('bayonet')) {
      return { model: 'knife_m9', skin: 'marble' };
    } else {
      return { model: 'knife_karambit', skin: 'fade' }; // Default knife
    }
  }
  
  // Map rifles
  if (category === 'rifle') {
    if (name.includes('ak-47') || name.includes('ak47')) {
      if (name.includes('redline')) {
        return { model: 'ak47', skin: 'redline' };
      } else if (name.includes('asiimov')) {
        return { model: 'ak47', skin: 'asiimov' };
      } else if (name.includes('fire serpent')) {
        return { model: 'ak47', skin: 'fire_serpent' };
      } else {
        return { model: 'ak47', skin: 'redline' }; // Default
      }
    } else if (name.includes('m4a4') || name.includes('m4a1')) {
      if (name.includes('howl')) {
        return { model: 'm4a4', skin: 'howl' };
      } else if (name.includes('asiimov')) {
        return { model: 'm4a4', skin: 'asiimov' };
      } else {
        return { model: 'm4a4', skin: 'howl' }; // Default
      }
    } else {
      return { model: 'ak47', skin: 'redline' }; // Default rifle
    }
  }
  
  // Map snipers
  if (category === 'sniper') {
    if (name.includes('awp')) {
      if (name.includes('dragon lore')) {
        return { model: 'awp', skin: 'dragon_lore' };
      } else if (name.includes('asiimov')) {
        return { model: 'awp', skin: 'asiimov' };
      } else {
        return { model: 'awp', skin: 'dragon_lore' }; // Default
      }
    } else {
      return { model: 'awp', skin: 'dragon_lore' }; // Default sniper
    }
  }
  
  // Map pistols
  if (category === 'pistol') {
    if (name.includes('usp')) {
      return { model: 'usp', skin: 'kill_confirmed' };
    } else if (name.includes('glock')) {
      return { model: 'glock', skin: 'fade' };
    } else if (name.includes('deagle')) {
      return { model: 'deagle', skin: 'golden_koi' };
    } else {
      return { model: 'usp', skin: 'kill_confirmed' }; // Default pistol
    }
  }
  
  // Default fallback
  return { model: 'ak47', skin: 'redline' };
};

const SkinViewerClient: React.FC<SkinViewerProps> = ({
  model = 'ak47',
  skin = 'redline',
  float = 0.0,
  stickers = [null, null, null, null],
  className = '',
  itemName,
  category,
  wear,
  pattern
}) => {
  // Map item data to model and skin if provided
  const mappedData = itemName && category ? mapItemToModel(itemName, category) : { model, skin };
  const selectedModel = mappedData.model;
  const selectedSkin = mappedData.skin;
  const wearValue = wear ? parseFloat(wear) : float;
  
  const [selectedWeapon, setSelectedWeapon] = useState(selectedModel);
  const [selectedSkinValue, setSelectedSkinValue] = useState(selectedSkin);
  const [selectedFloat, setSelectedFloat] = useState(wearValue);
  const [selectedStickers, setSelectedStickers] = useState<(string | null)[]>(stickers);
  const [selectedMap, setSelectedMap] = useState('de_dust2');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Available stickers
  const availableStickers = [
    { value: 'katowice2014.svg', label: 'Katowice 2014' },
    { value: 'dreamhack2014.svg', label: 'DreamHack 2014' },
    { value: 'cologne2014.svg', label: 'Cologne 2014' },
    { value: 'mlg2015.svg', label: 'MLG 2015' }
  ];

  const weaponData = WEAPONS[selectedWeapon] || WEAPONS.ak47;
  const skinPath = selectedSkin ? `/textures/skins/${selectedWeapon}_${selectedSkin}.svg` : undefined;
  const mapPath = selectedMap ? `/textures/maps/${selectedMap}.svg` : undefined;

  return (
    <div className={`w-full h-full min-h-[600px] bg-gray-900 rounded-lg overflow-hidden ${className}`}>
      {/* 3D Canvas */}
      <div className="w-full h-[500px] relative">
        <Canvas
          camera={{ position: [0, 0, 2], fov: 75 }}
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-5, 5, 5]} intensity={0.4} color="#4a90e2" />
          <pointLight position={[5, -5, -5]} intensity={0.3} color="#e24a4a" />

          <Suspense fallback={null}>
            <MapBackground mapPath={mapPath} />
            <WeaponModel 
              weaponType={selectedWeapon}
              skinPath={skinPath} 
              float={selectedFloat}
              stickers={selectedStickers}
              position={weaponData.position}
              scale={weaponData.scale}
            />
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              minDistance={1.5}
              maxDistance={5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={0}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="p-6 bg-gray-800 border-t border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Weapon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Weapon
            </label>
            <select
              value={selectedWeapon}
              onChange={(e) => {
                setSelectedWeapon(e.target.value);
                setSelectedSkinValue(WEAPONS[e.target.value]?.skins[0]?.value || 'redline');
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {Object.entries(WEAPONS).map(([key, weapon]) => (
                <option key={key} value={key}>
                  {weapon.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skin Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Skin
            </label>
            <select
              value={selectedSkinValue}
              onChange={(e) => setSelectedSkinValue(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {weaponData.skins.map((skinOption) => (
                <option key={skinOption.value} value={skinOption.value}>
                  {skinOption.label}
                </option>
              ))}
            </select>
          </div>

          {/* Map Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Map
            </label>
            <select
              value={selectedMap}
              onChange={(e) => setSelectedMap(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              {MAPS.map((map) => (
                <option key={map.value} value={map.value}>
                  {map.label}
                </option>
              ))}
            </select>
          </div>

          {/* Float/Wear Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Wear (Float: {selectedFloat.toFixed(2)})
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
          </div>
        </div>

        {/* Sticker Selection */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Stickers
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((index) => (
              <select
                key={index}
                value={selectedStickers[index] || ''}
                onChange={(e) => {
                  const newStickers = [...selectedStickers];
                  newStickers[index] = e.target.value || null;
                  setSelectedStickers(newStickers);
                }}
                className="px-2 py-1 text-xs bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
              >
                <option value="">None</option>
                {availableStickers.map((sticker) => (
                  <option key={sticker.value} value={sticker.value}>
                    {sticker.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        {/* Model Info */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span className="font-medium">Weapon: {weaponData.name}</span>
            <span className="font-medium">Skin: {selectedSkinValue}</span>
            <span className="font-medium">Map: {selectedMap}</span>
            <span className="font-medium">Float: {selectedFloat.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinViewerClient; 