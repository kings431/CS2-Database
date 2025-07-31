'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import SkinViewerFallback from './SkinViewerFallback';
import WeaponModel from './WeaponModel';
import LightingControls from './LightingControls';
import ScreenshotButtonInCanvas from './ScreenshotButtonInCanvas';
import ScreenshotButtonOverlay from './ScreenshotButtonOverlay';


interface SkinViewerProps {
  model?: string;
  skin?: string;
  float?: number;
  stickers?: (string | null)[];
  className?: string;
  fov?: number;
  scale?: number;
  // New props for screenshot integration
  itemName?: string;
  category?: string;
  wear?: string;
  pattern?: number;
  // Full screen mode
  fullScreen?: boolean;
  // Background prop
  background?: string;
  // Screenshot functionality
  onScreenshotTaken?: (permalink: string) => void;
  // Lighting props
  ambientIntensity?: number;
  directionalIntensity?: number;
  pointLight1Intensity?: number;
  pointLight2Intensity?: number;
  pointLight3Intensity?: number;
  pointLight4Intensity?: number;
  rimLightIntensity?: number;
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
    modelPath: '/models/weapons/ak47/weapon_rif_ak47.glb',
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
      { value: 'crimson_web', label: 'Crimson Web' },
      { value: 'stained', label: 'Stained' },
      { value: 'case_hardened', label: 'Case Hardened' },
      { value: 'blue_steel', label: 'Blue Steel' },
      { value: 'tiger_tooth', label: 'Tiger Tooth' },
      { value: 'rust_coat', label: 'Rust Coat' },
      { value: 'damascus-steel', label: 'Damascus Steel' },
      { value: 'gamma_doppler', label: 'Gamma Doppler' },
      { value: 'autotronic', label: 'Autotronic' },
      { value: 'lore', label: 'Lore' },
      { value: 'freehand', label: 'Freehand' },
      { value: 'bright_water', label: 'Bright Water' },
      { value: 'black_laminate', label: 'Black Laminate' }
    ],
    modelPath: '/models/weapons/knives/karambit/weapon_knife_karambit.glb',
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
    modelPath: '/models/weapons/knives/m9_bayonet/weapon_knife_m9.glb',
    geometry: [0.6, 0.08, 0.08],
    scale: 1.5,
    position: [0, 0, 0]
  },
  gloves_sport: {
    type: 'gloves',
    name: 'Sport Gloves',
    skins: [
      { value: 'ominous', label: 'Ominous' },
      { value: 'vice', label: 'Vice' },
      { value: 'pandora', label: 'Pandora\'s Box' },
      { value: 'amphibious', label: 'Amphibious' },
      { value: 'arid', label: 'Arid' },
      { value: 'bronze_morph', label: 'Bronze Morph' },
      { value: 'cobalt_skulls', label: 'Cobalt Skulls' },
      { value: 'crimson_weave', label: 'Crimson Weave' },
      { value: 'eclipse', label: 'Eclipse' },
      { value: 'hedge_maze', label: 'Hedge Maze' },
      { value: 'king_snake', label: 'King Snake' },
      { value: 'lunar_weave', label: 'Lunar Weave' },
      { value: 'mega_weave', label: 'Mega Weave' },
      { value: 'moto_boomslang', label: 'Moto Boomslang' },
      { value: 'nocts', label: 'Nocts' },
      { value: 'pandora', label: 'Pandora\'s Box' },
      { value: 'slingshot', label: 'Slingshot' },
      { value: 'spearmint', label: 'Spearmint' },
      { value: 'superconductor', label: 'Superconductor' },
      { value: 'tiger_strike', label: 'Tiger Strike' },
      { value: 'vice', label: 'Vice' }
    ],
    modelPath: '/models/gloves/v_glove_hardknuckle.glb',
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
      { value: 'emerald_web', label: 'Emerald Web' },
      { value: 'bamboo_print', label: 'Bamboo Print' },
      { value: 'blood_pressure', label: 'Blood Pressure' },
      { value: 'blue_steel', label: 'Blue Steel' },
      { value: 'case_hardened', label: 'Case Hardened' },
      { value: 'cobalt_skulls', label: 'Cobalt Skulls' },
      { value: 'crimson_weave', label: 'Crimson Weave' },
      { value: 'emerald_web', label: 'Emerald Web' },
      { value: 'fade', label: 'Fade' },
      { value: 'field_agent', label: 'Field Agent' },
      { value: 'foundation', label: 'Foundation' },
      { value: 'forest_ddpat', label: 'Forest DDPAT' },
      { value: 'free_hand', label: 'Free Hand' },
      { value: 'green_web', label: 'Green Web' },
      { value: 'lunar_weave', label: 'Lunar Weave' },
      { value: 'mega_weave', label: 'Mega Weave' },
      { value: 'mint_kimono', label: 'Mint Kimono' },
      { value: 'orange_kimono', label: 'Orange Kimono' },
      { value: 'pandora', label: 'Pandora\'s Box' },
      { value: 'polygon', label: 'Polygon' },
      { value: 'pow', label: 'POW!' },
      { value: 'red_kimono', label: 'Red Kimono' },
      { value: 'slaughters', label: 'Slaughter' },
      { value: 'stained', label: 'Stained' },
      { value: 'urban_hazard', label: 'Urban Hazard' },
      { value: 'vice', label: 'Vice' }
    ],
    modelPath: '/models/gloves/v_glove_bloodhound.glb',
    geometry: [0.8, 0.4, 0.3],
    scale: 1.0,
    position: [0, 0, 0]
  }
};

// Available backgrounds
const BACKGROUNDS = [
  { value: '', label: 'Default Gradient' },
  { value: '/backgrounds/back1.jpg', label: 'Background 1' },
  { value: '/backgrounds/back2.jpg', label: 'Background 2' },
  { value: '/backgrounds/back3.jpg', label: 'Background 3' },
  { value: '/backgrounds/back4.jpg', label: 'Background 4' },
  { value: '/backgrounds/back5.png', label: 'Background 5' },
  { value: '/backgrounds/gradient.png', label: 'Gradient' }
];

// Pattern data for skins that support patterns
const SKIN_PATTERNS: { [key: string]: { name: string; description: string; minPattern: number; maxPattern: number; examples?: string[] } } = {
  'redline': { name: 'Redline', description: 'A classic red and black pattern.', minPattern: 1, maxPattern: 10 },
  'asiimov': { name: 'Asiimov', description: 'A camouflage pattern.', minPattern: 1, maxPattern: 10 },
  'vulcan': { name: 'Vulcan', description: 'A dark blue and black pattern.', minPattern: 1, maxPattern: 10 },
  'fire_serpent': { name: 'Fire Serpent', description: 'A fiery red and black pattern.', minPattern: 1, maxPattern: 10 },
  'dragon_lore': { name: 'Dragon Lore', description: 'A detailed dragon pattern.', minPattern: 1, maxPattern: 10 },
  'howl': { name: 'Howl', description: 'A howling wolf pattern.', minPattern: 1, maxPattern: 10 },
  'desolate_space': { name: 'Desolate Space', description: 'A dark blue and black pattern.', minPattern: 1, maxPattern: 10 },
  'evolved': { name: 'Evolved', description: 'A detailed evolved pattern.', minPattern: 1, maxPattern: 10 },
  'dragon_lore_awp': { name: 'Dragon Lore', description: 'A detailed dragon pattern.', minPattern: 1, maxPattern: 10 },
  'medusa': { name: 'Medusa', description: 'A detailed medusa pattern.', minPattern: 1, maxPattern: 10 },
  'fever_dream': { name: 'Fever Dream', description: 'A detailed fever dream pattern.', minPattern: 1, maxPattern: 10 },
  'crimson_web': { name: 'Crimson Web', description: 'A detailed crimson web pattern.', minPattern: 1, maxPattern: 10 },
  'stained': { name: 'Stained', description: 'A detailed stained pattern.', minPattern: 1, maxPattern: 10 },
  'case_hardened': { name: 'Case Hardened', description: 'A detailed case hardened pattern.', minPattern: 1, maxPattern: 10 },
  'blue_steel': { name: 'Blue Steel', description: 'A detailed blue steel pattern.', minPattern: 1, maxPattern: 10 },
  'tiger_tooth': { name: 'Tiger Tooth', description: 'A detailed tiger tooth pattern.', minPattern: 1, maxPattern: 10 },
  'rust_coat': { name: 'Rust Coat', description: 'A detailed rust coat pattern.', minPattern: 1, maxPattern: 10 },
  'damascus-steel': { name: 'Damascus Steel', description: 'A detailed damascus steel pattern.', minPattern: 1, maxPattern: 10 },
  'gamma_doppler': { name: 'Gamma Doppler', description: 'A detailed gamma doppler pattern.', minPattern: 1, maxPattern: 10 },
  'autotronic': { name: 'Autotronic', description: 'A detailed autotronic pattern.', minPattern: 1, maxPattern: 10 },
  'lore': { name: 'Lore', description: 'A detailed lore pattern.', minPattern: 1, maxPattern: 10 },
  'freehand': { name: 'Freehand', description: 'A detailed freehand pattern.', minPattern: 1, maxPattern: 10 },
  'bright_water': { name: 'Bright Water', description: 'A detailed bright water pattern.', minPattern: 1, maxPattern: 10 },
  'black_laminate': { name: 'Black Laminate', description: 'A detailed black laminate pattern.', minPattern: 1, maxPattern: 10 },
  'marble': { name: 'Marble Fade', description: 'A detailed marble fade pattern.', minPattern: 1, maxPattern: 10 },
  'doppler': { name: 'Doppler', description: 'A detailed doppler pattern.', minPattern: 1, maxPattern: 10 },
  'ultraviolet': { name: 'Ultraviolet', description: 'A detailed ultraviolet pattern.', minPattern: 1, maxPattern: 10 }
};


// Static background component - removed 3D background system
const StaticBackground: React.FC = () => {
  return null; // We'll handle background via CSS instead
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
      } else if (name.includes('tiger tooth')) {
        return { model: 'knife_karambit', skin: 'tiger_tooth' };
      } else if (name.includes('black laminate')) {
        return { model: 'knife_karambit', skin: 'black_laminate' };
      } else if (name.includes('crimson web')) {
        return { model: 'knife_karambit', skin: 'crimson_web' };
      } else if (name.includes('stained')) {
        return { model: 'knife_karambit', skin: 'stained' };
      } else if (name.includes('case hardened')) {
        return { model: 'knife_karambit', skin: 'case_hardened' };
      } else if (name.includes('blue steel')) {
        return { model: 'knife_karambit', skin: 'blue_steel' };
      } else if (name.includes('rust coat')) {
        return { model: 'knife_karambit', skin: 'rust_coat' };
      } else if (name.includes('damascus steel')) {
        return { model: 'knife_karambit', skin: 'damascus-steel' };
      } else if (name.includes('gamma doppler')) {
        return { model: 'knife_karambit', skin: 'gamma_doppler' };
      } else if (name.includes('autotronic')) {
        return { model: 'knife_karambit', skin: 'autotronic' };
      } else if (name.includes('lore')) {
        return { model: 'knife_karambit', skin: 'lore' };
      } else if (name.includes('freehand')) {
        return { model: 'knife_karambit', skin: 'freehand' };
      } else if (name.includes('bright water')) {
        return { model: 'knife_karambit', skin: 'bright_water' };
      } else {
        return { model: 'knife_karambit', skin: 'fade' }; // Default
      }
    } else if (name.includes('butterfly')) {
      return { model: 'knife_butterfly', skin: 'fade' };
    } else if (name.includes('bayonet') || name.includes('m9')) {
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
      } else if (name.includes('fade')) {
        return { model: 'ak47', skin: 'fade' };
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
  fov = 60,
  scale = 1.0,
  itemName,
  category,
  wear,
  pattern,
  fullScreen,
  background,
  onScreenshotTaken,
  ambientIntensity = 0.6,
  directionalIntensity = 1.2,
  pointLight1Intensity = 0.4,
  pointLight2Intensity = 0.3,
  pointLight3Intensity = 0.5,
  pointLight4Intensity = 0.6,
  rimLightIntensity = 0.8
}) => {
  // Map item data to model and skin if provided
  const mappedData = itemName && category ? mapItemToModel(itemName, category) : { model, skin };
  const selectedModel = mappedData.model;
  const selectedSkin = mappedData.skin;
  const wearValue = wear ? parseFloat(wear) : float;
  
  const [selectedWeapon, setSelectedWeapon] = useState(selectedModel);
  const [selectedSkinValue, setSelectedSkinValue] = useState(selectedSkin);
  const [selectedFloat, setSelectedFloat] = useState(wearValue);
  const [selectedPattern, setSelectedPattern] = useState(pattern || 1);
  const [selectedStickers, setSelectedStickers] = useState<(string | null)[]>(stickers);
  const [selectedBackground, setSelectedBackground] = useState(background || '');
  const [selectedFOV, setSelectedFOV] = useState(fov);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  


  // Update state when props change
  useEffect(() => {
    setSelectedWeapon(selectedModel);
    setSelectedSkinValue(selectedSkin);
    setSelectedFloat(wearValue);
    setSelectedPattern(pattern || 1);
    setSelectedFOV(fov);
    setSelectedBackground(background || '');
    console.log('Background changed to:', background);
  }, [selectedModel, selectedSkin, wearValue, pattern, fov, background]);

  // Log background changes
  useEffect(() => {
    console.log('Selected background state:', selectedBackground);
  }, [selectedBackground]);

  // Available stickers
  const availableStickers = [
    { value: 'katowice2014.svg', label: 'Katowice 2014' },
    { value: 'dreamhack2014.svg', label: 'DreamHack 2014' },
    { value: 'cologne2014.svg', label: 'Cologne 2014' },
    { value: 'mlg2015.svg', label: 'MLG 2015' }
  ];

  // Get pattern information for current skin
  const getPatternInfo = () => {
    const skinName = selectedSkinValue;
    const patternData = SKIN_PATTERNS[skinName as keyof typeof SKIN_PATTERNS];
    
    if (patternData) {
      return {
        name: patternData.name,
        description: patternData.description,
        minPattern: patternData.minPattern,
        maxPattern: patternData.maxPattern,
        currentPattern: selectedPattern,
        examples: patternData.examples || []
      };
    }
    return null;
  };

  const patternInfo = getPatternInfo();

  const weaponData = WEAPONS[selectedWeapon] || WEAPONS.ak47;

    return (
    <div className={`w-full h-full ${fullScreen ? 'fixed inset-0 z-50' : 'min-h-[600px]'} bg-gray-900 ${fullScreen ? '' : 'rounded-lg overflow-hidden'} ${className}`}>
      {/* 3D Canvas */}
      <div className={`w-full h-full relative`}>
        <ScreenshotButtonOverlay
          weaponType={selectedWeapon}
          skin={selectedSkinValue}
          float={selectedFloat}
          background={selectedBackground}
          fov={selectedFOV}
        />
        <Canvas
          camera={{ position: [0, 0, 4], fov: selectedFOV }}
          style={{ 
            background: selectedBackground 
              ? `url(${selectedBackground}) center/cover no-repeat`
              : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          }}
          onCreated={({ camera }) => {
            console.log('Canvas created with camera:', camera);
            console.log('Canvas background style:', selectedBackground 
              ? `url(${selectedBackground}) center/cover no-repeat`
              : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)');
          }}
        >
          <LightingControls
            ambientIntensity={ambientIntensity}
            directionalIntensity={directionalIntensity}
            pointLight1Intensity={pointLight1Intensity}
            pointLight2Intensity={pointLight2Intensity}
            pointLight3Intensity={pointLight3Intensity}
            pointLight4Intensity={pointLight4Intensity}
            rimLightIntensity={rimLightIntensity}
          />

          <Suspense fallback={
            <mesh geometry={new THREE.BoxGeometry(1, 1, 1)}>
              <meshStandardMaterial color={0x808080} />
            </mesh>
          }>
            <WeaponModel 
              weaponType={selectedWeapon}
              skinPath={`${selectedSkinValue}_${selectedPattern}`} // Pass skin name with pattern
              float={selectedFloat}
              stickers={selectedStickers}
              position={weaponData.position}
              scale={weaponData.scale * scale}
            />
            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={0.5}
              maxDistance={20}
              minPolarAngle={0}
              maxPolarAngle={Math.PI}
              zoomSpeed={1.5}
              rotateSpeed={0.8}
              panSpeed={1.0}
              dampingFactor={0.05}
              enableDamping={true}
            />
            
            {/* Screenshot Button Inside Canvas */}
            <ScreenshotButtonInCanvas
              weaponType={selectedWeapon}
              skin={selectedSkinValue}
              float={selectedFloat}
              background={selectedBackground}
              fov={selectedFOV}
            />

          </Suspense>
        </Canvas>
      </div>

    </div>
  );
};

export default SkinViewerClient; 